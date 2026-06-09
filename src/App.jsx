import { useMemo, useRef, useState } from "react";
import { Bot, Check, Loader2, RotateCcw, Send, Sparkles, UserRound } from "lucide-react";

const MODELS = [
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    tag: "고성능",
    note: "복잡한 질의와 코드 보조에 적합"
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    tag: "기본",
    note: "빠른 응답과 가벼운 작업에 적합"
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    tag: "안정",
    note: "검증된 경량 멀티모달 모델"
  }
];

const INITIAL_MESSAGES = [
  {
    id: crypto.randomUUID(),
    role: "assistant",
    content: "안녕하세요. PASS Club 챗봇입니다. 학습, 일정, 프로젝트 아이디어를 함께 정리해볼까요?"
  }
];

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[1].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const activeModel = useMemo(
    () => MODELS.find((model) => model.id === selectedModel) ?? MODELS[1],
    [selectedModel]
  );

  async function sendMessage(event) {
    event?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedInput
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: nextMessages.map(({ role, content }) => ({ role, content }))
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "응답 처리 중 오류가 발생했습니다.");

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer
        }
      ]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function resetChat() {
    setMessages(INITIAL_MESSAGES);
    setError("");
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <main className="app-shell">
      <section className="workspace" aria-label="PASS Club Gemini chatbot">
        <aside className="model-panel">
          <div className="brand-lockup">
            <span className="brand-mark">
              <Sparkles size={22} strokeWidth={2.2} />
            </span>
            <div>
              <p>Polytech PASS Club</p>
              <h1>Gemini Chatbot</h1>
            </div>
          </div>

          <div className="model-list" aria-label="Gemini model selector">
            {MODELS.map((model) => (
              <button
                className={`model-card ${model.id === selectedModel ? "is-active" : ""}`}
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                type="button"
              >
                <span className="model-card-top">
                  <span>{model.name}</span>
                  {model.id === selectedModel ? <Check size={18} /> : null}
                </span>
                <span className="model-meta">
                  <strong>{model.tag}</strong>
                  {model.note}
                </span>
              </button>
            ))}
          </div>

          <div className="runtime-card">
            <span>현재 모델</span>
            <strong>{activeModel.name}</strong>
            <p>API 키는 서버 환경 변수에서만 사용됩니다.</p>
          </div>
        </aside>

        <section className="chat-panel">
          <header className="chat-header">
            <div>
              <p>무료 Gemini 모델 전용</p>
              <h2>질문을 입력하세요</h2>
            </div>
            <button className="icon-button" onClick={resetChat} title="대화 초기화" type="button">
              <RotateCcw size={20} />
            </button>
          </header>

          <div className="message-list" aria-live="polite">
            {messages.map((message) => (
              <article className={`message-row ${message.role}`} key={message.id}>
                <span className="avatar" aria-hidden="true">
                  {message.role === "assistant" ? <Bot size={19} /> : <UserRound size={19} />}
                </span>
                <p>{message.content}</p>
              </article>
            ))}
            {isLoading ? (
              <article className="message-row assistant">
                <span className="avatar" aria-hidden="true">
                  <Loader2 className="spin" size={19} />
                </span>
                <p>응답을 작성하는 중입니다.</p>
              </article>
            ) : null}
          </div>

          {error ? <div className="error-banner">{error}</div> : null}

          <form className="composer" onSubmit={sendMessage}>
            <textarea
              aria-label="메시지"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="메시지를 입력하세요"
              ref={inputRef}
              rows={1}
              value={input}
            />
            <button className="send-button" disabled={!input.trim() || isLoading} title="전송" type="submit">
              {isLoading ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
