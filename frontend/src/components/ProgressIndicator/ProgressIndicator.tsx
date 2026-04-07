import styles from './ProgressIndicator.module.css';

interface ProgressIndicatorProps {
  state: 'loading' | 'inferring' | null;
}

export default function ProgressIndicator({ state }: ProgressIndicatorProps) {
  if (!state) return null;

  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.text}>
        {state === 'loading' ? 'Загрузка модели...' : 'Классификация...'}
      </p>
    </div>
  );
}
