import { useRef, useState } from "react";

const INITIAL_MESSAGES = [
  {
    id: crypto.randomUUID(),
    role: "assistant",
    content: "안녕하세요. Cloud Chatbot입니다. 학습, 일정, 프로젝트 아이디어를 함께 정리해볼까요?"
  }
];

export function useChat(defaultModel) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

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

  return {
    error,
    input,
    inputRef,
    isLoading,
    messages,
    selectedModel,
    resetChat,
    sendMessage,
    setInput,
    setSelectedModel
  };
}
