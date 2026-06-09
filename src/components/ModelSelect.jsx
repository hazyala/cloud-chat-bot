import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ModelSelect({ id = "model", models, selectedModel, onSelectModel }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeModel = models.find((model) => model.id === selectedModel) ?? models[0];

  function handleSelect(modelId) {
    onSelectModel(modelId);
    setIsOpen(false);
  }

  return (
    <div className="model-toggle" id={id}>
      <button
        className="model-toggle-button"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{activeModel.name}</span>
        <ChevronDown className="model-toggle-arrow" aria-hidden="true" strokeWidth={2.4} />
      </button>

      {isOpen ? (
        <div className="model-options" role="listbox" aria-label="Gemini model">
          {models.map((model) => (
            <button
              className={`model-option ${model.id === selectedModel ? "is-selected" : ""}`}
              key={model.id}
              role="option"
              aria-selected={model.id === selectedModel}
              type="button"
              onClick={() => handleSelect(model.id)}
            >
              {model.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
