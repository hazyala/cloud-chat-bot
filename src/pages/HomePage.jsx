import { useState } from "react";
import { GEMINI_MODELS } from "../../shared/geminiModels.js";
import { GlassLayers } from "../components/GlassLayers.jsx";
import { LiquidGlassFilter } from "../components/LiquidGlassFilter.jsx";
import { ModelSelect } from "../components/ModelSelect.jsx";

export function HomePage({ selectedModel, onSelectModel, onStartChat }) {
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);

  function handleStartClick() {
    setIsModelPickerOpen(true);
  }

  return (
    <main className="home-page">
      <div
        className={[
          "container",
          isModelPickerOpen ? "morphing show-input hide-button" : ""
        ].join(" ")}
      >
        <div className="glass-container">
          <GlassLayers />

          <button id="startBtn" onClick={handleStartClick} type="button" aria-hidden={isModelPickerOpen}>
            <span className="main-text">GET STARTED</span>
            <br />
            <span className="sub-text">CloudChatBot</span>
          </button>

          <div id="inputContent" className={`input-card ${isModelPickerOpen ? "" : "hidden"}`}>
            <ModelSelect models={GEMINI_MODELS} selectedModel={selectedModel} onSelectModel={onSelectModel} />
            <div className="model-summary">
              <span>CloudChatBot</span>
              <strong>Gemini model ready</strong>
            </div>
            <button id="enterBtn" onClick={onStartChat} type="button">
              Start
            </button>
          </div>
        </div>
        <LiquidGlassFilter />
      </div>
    </main>
  );
}
