export function ModelSelect({ id = "model", models, selectedModel, onSelectModel }) {
  return (
    <select id={id} value={selectedModel} onChange={(event) => onSelectModel(event.target.value)}>
      {models.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </select>
  );
}
