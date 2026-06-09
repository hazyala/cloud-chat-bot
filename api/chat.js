const ALLOWED_MODELS = new Set([
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite"
]);

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

function readText(parts = []) {
  return parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
}

function toGeminiContents(messages = []) {
  return messages
    .filter((message) => message?.content?.trim())
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content.trim() }]
    }));
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "POST 요청만 지원합니다." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: "서버에 GEMINI_API_KEY가 설정되어 있지 않습니다." });
  }

  const { model = process.env.GEMINI_DEFAULT_MODEL, messages } = request.body ?? {};
  if (!ALLOWED_MODELS.has(model)) {
    return response.status(400).json({ error: "지원하지 않는 Gemini 모델입니다." });
  }

  const contents = toGeminiContents(messages);
  if (contents.length === 0) {
    return response.status(400).json({ error: "전송할 메시지가 없습니다." });
  }

  const geminiResponse = await fetch(
    `${GEMINI_ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 2048
        }
      })
    }
  );

  const payload = await geminiResponse.json().catch(() => ({}));
  if (!geminiResponse.ok) {
    return response.status(geminiResponse.status).json({
      error: payload?.error?.message ?? "Gemini 응답을 가져오지 못했습니다."
    });
  }

  const answer = readText(payload?.candidates?.[0]?.content?.parts);
  if (!answer) {
    return response.status(502).json({ error: "Gemini가 빈 응답을 반환했습니다." });
  }

  return response.status(200).json({ answer });
}
