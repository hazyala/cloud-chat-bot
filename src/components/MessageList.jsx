import { Bot, Loader2, UserRound } from "lucide-react";

function Message({ message }) {
  return (
    <article className={`message-row ${message.role}`}>
      <span className="avatar" aria-hidden="true">
        {message.role === "assistant" ? <Bot size={19} /> : <UserRound size={19} />}
      </span>
      <p>{message.content}</p>
    </article>
  );
}

export function MessageList({ isLoading, messages }) {
  return (
    <div className="message-list" aria-live="polite">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
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
  );
}
