import { useMemo } from "react";
import { ChatHeader } from "./components/ChatHeader.jsx";
import { Composer } from "./components/Composer.jsx";
import { MessageList } from "./components/MessageList.jsx";
import { ModelPanel } from "./components/ModelPanel.jsx";
import { useChat } from "./hooks/useChat.js";
import { DEFAULT_GEMINI_MODEL, GEMINI_MODELS } from "../shared/geminiModels.js";

export default function App() {
  const {
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
  } = useChat(DEFAULT_GEMINI_MODEL);

  const activeModel = useMemo(
    () => GEMINI_MODELS.find((model) => model.id === selectedModel) ?? GEMINI_MODELS[0],
    [selectedModel]
  );

  return (
    <main className="app-shell">
      <section className="workspace" aria-label="Cloud Gemini chatbot">
        <ModelPanel
          activeModel={activeModel}
          models={GEMINI_MODELS}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />

        <section className="chat-panel">
          <ChatHeader onReset={resetChat} />
          <MessageList isLoading={isLoading} messages={messages} />
          {error ? <div className="error-banner">{error}</div> : null}
          <Composer
            input={input}
            inputRef={inputRef}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={sendMessage}
          />
        </section>
      </section>
    </main>
  );
}
