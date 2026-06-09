import { BrandLockup } from "./BrandLockup.jsx";
import { ModelCard } from "./ModelCard.jsx";
import { RuntimeStatus } from "./RuntimeStatus.jsx";

export function ModelPanel({ activeModel, models, selectedModel, onSelectModel }) {
  return (
    <aside className="model-panel">
      <BrandLockup />
      <div className="model-list" aria-label="Gemini model selector">
        {models.map((model) => (
          <ModelCard
            isActive={model.id === selectedModel}
            key={model.id}
            model={model}
            onSelect={() => onSelectModel(model.id)}
          />
        ))}
      </div>
      <RuntimeStatus activeModel={activeModel} />
    </aside>
  );
}
