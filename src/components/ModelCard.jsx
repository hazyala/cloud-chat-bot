import { Check } from "lucide-react";

export function ModelCard({ isActive, model, onSelect }) {
  return (
    <button className={`model-card ${isActive ? "is-active" : ""}`} onClick={onSelect} type="button">
      <span className="model-card-top">
        <span>{model.name}</span>
        {isActive ? <Check size={18} /> : null}
      </span>
      <span className="model-meta">
        <strong>{model.tag}</strong>
        {model.note}
      </span>
    </button>
  );
}
