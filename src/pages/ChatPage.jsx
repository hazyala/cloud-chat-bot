import { GEMINI_MODELS } from "../../shared/geminiModels.js";
import { GlassLayers } from "../components/GlassLayers.jsx";
import { LiquidGlassFilter } from "../components/LiquidGlassFilter.jsx";
import { useChat } from "../hooks/useChat.js";

function Bubble({ message }) {
  return (
    <div className={`bubble ${message.role === "user" ? "user" : "assistant"}`}>
      <div className="bubble-inner">{message.content}</div>
    </div>
  );
}

export function ChatPage({ selectedModel, onBackHome }) {
  const { error, input, inputRef, isLoading, messages, resetChat, sendMessage, setInput } = useChat(selectedModel);
  const activeModel = GEMINI_MODELS.find((model) => model.id === selectedModel);

  function handleSubmit(event) {
    sendMessage(event);
  }

  return (
    <main className="chat-page">
      <header className="chat-header">
        <div className="chat-title">Ask anything</div>
        <div className="chat-meta">
          <span id="model-badge">model: {activeModel?.name ?? selectedModel}</span>
          <button className="ghost" onClick={resetChat} type="button">
            RESET
          </button>
          <button className="ghost" onClick={onBackHome} type="button">
            HOME
          </button>
        </div>
      </header>

      <section id="chat" className="chat-container" aria-live="polite" aria-busy={isLoading}>
        {messages.map((message) => (
          <Bubble key={message.id} message={message} />
        ))}
        {isLoading ? (
          <div className="bubble assistant thinking">
            <div className="bubble-inner">Thinking...</div>
          </div>
        ) : null}
        {error ? (
          <div className="bubble assistant">
            <div className="bubble-inner">Error: {error}</div>
          </div>
        ) : null}
      </section>

      <div className="chat-composer-stage">
        <div className="glass-container chat-glass">
          <GlassLayers />
          <form id="composer" className="composer" autoComplete="off" onSubmit={handleSubmit}>
            <textarea
              id="message"
              rows={1}
              placeholder="Please enter a message."
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button type="submit" id="send-btn" disabled={!input.trim() || isLoading}>
              SEND
            </button>
          </form>
        </div>
        <LiquidGlassFilter />
      </div>
    </main>
  );
}
