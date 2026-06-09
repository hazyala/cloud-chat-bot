import { RotateCcw } from "lucide-react";

export function ChatHeader({ onReset }) {
  return (
    <header className="chat-header">
      <div>
        <p>무료 Gemini 모델 전용</p>
        <h2>질문을 입력하세요</h2>
      </div>
      <button className="icon-button" onClick={onReset} title="대화 초기화" type="button">
        <RotateCcw size={20} />
      </button>
    </header>
  );
}
