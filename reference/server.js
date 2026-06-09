// ==================== server.js  ====================
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
const app = express();

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});

// ── 미들웨어
app.use(express.json());

// ── 정적 파일 제공 (public 폴더)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// ── API Key 검증
app.post("/verify-key", async (req, res) => {
  const { apiKey, model } = req.body || {};

  if (!model || model === "selectmodel") {
    return res.status(400).json({ success: false, message: "모델을 선택해주세요." });
  }
  if (!apiKey) {
    return res.status(400).json({ success: false, message: "API Key를 입력해주세요." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!response.ok) {
      const err = await safeJson(response);
      return res.status(401).json({
        success: false,
        message: err?.error?.message || "API 키가 잘못되었습니다. 다시 입력해주세요."
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("검증 오류:", error);
    return res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// ── 채팅 프록시
app.post("/chat", async (req, res) => {
  const { apiKey, model, messages } = req.body || {};

  if (!apiKey) {
    return res.status(400).json({ success: false, message: "API Key가 없습니다." });
  }
  if (!model) {
    return res.status(400).json({ success: false, message: "model이 없습니다." });
  }
  if (!Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: "messages 형식이 올바르지 않습니다." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
      }),
    });

    const data = await safeJson(response);

    if (!response.ok) {
      // OpenAI 에러를 상태코드와 함께 그대로 전달
      return res.status(response.status).json({ success: false, ...data });
    }

    //실제 서빙된 모델명을 함께 회신
    return res.json({ success: true, ...data, servedModel: data?.model });
  } catch (error) {
    console.error("Chat API 오류:", error);
    return res.status(500).json({ success: false, message: "OpenAI API 호출 실패" });
  }
});

async function safeJson(resp) {
  try { return await resp.json(); }
  catch { return {}; }
}

// ── 서버 실행
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
