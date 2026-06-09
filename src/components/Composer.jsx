import { Loader2, Send } from "lucide-react";

export function Composer({ input, inputRef, isLoading, onInputChange, onSubmit }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <form className="composer" onSubmit={onSubmit}>
      <textarea
        aria-label="메시지"
        onChange={(event) => onInputChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
        ref={inputRef}
        rows={1}
        value={input}
      />
      <button className="send-button" disabled={!input.trim() || isLoading} title="전송" type="submit">
        {isLoading ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
      </button>
    </form>
  );
}
