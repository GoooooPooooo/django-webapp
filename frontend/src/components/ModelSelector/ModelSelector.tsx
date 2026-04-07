import styles from './ModelSelector.module.css';

interface ModelSelectorProps {
  models: string[];
  selectedModel: string;
  onSelect: (model: string) => void;
  isLoading: boolean;
}

export default function ModelSelector({
  models,
  selectedModel,
  onSelect,
  isLoading,
}: ModelSelectorProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Модель:</label>
      <select
        className={styles.select}
        value={selectedModel}
        onChange={(e) => onSelect(e.target.value)}
        disabled={isLoading}
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
      {isLoading && <span className={styles.loading}>Загрузка...</span>}
    </div>
  );
}
