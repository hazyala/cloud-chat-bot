import { useState } from "react";
import { DEFAULT_GEMINI_MODEL } from "../shared/geminiModels.js";
import { ChatPage } from "./pages/ChatPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";

export default function App() {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_GEMINI_MODEL);
  const [page, setPage] = useState("home");

  if (page === "chat") {
    return <ChatPage selectedModel={selectedModel} onBackHome={() => setPage("home")} />;
  }

  return (
    <HomePage
      selectedModel={selectedModel}
      onSelectModel={setSelectedModel}
      onStartChat={() => setPage("chat")}
    />
  );
}
