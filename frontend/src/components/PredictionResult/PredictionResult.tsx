import type { ClassificationResult } from '../../types';
import styles from './PredictionResult.module.css';

interface PredictionResultProps {
  result: ClassificationResult;
  imageUrl: string;
}

export default function PredictionResult({ result, imageUrl }: PredictionResultProps) {
  const confidencePercent = (result.confidence * 100).toFixed(1);

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt="Загруженное изображение" className={styles.image} />
      </div>
      <div className={styles.result}>
        <h3 className={styles.title}>Результат классификации</h3>
        <div className={styles.prediction}>
          <span className={styles.className}>{result.className}</span>
          <span className={styles.confidence}>{confidencePercent}%</span>
        </div>
        <div className={styles.bars}>
          {result.probabilities.map((prob, idx) => (
            <div key={idx} className={styles.barRow}>
              <span className={styles.barLabel}>
                {result.probabilities.length === 3
                  ? ['Варан', 'Хамелеон', 'Геккон'][idx]
                  : `Класс ${idx}`}
              </span>
              <div className={styles.barBg}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${prob * 100}%`,
                    backgroundColor: idx === result.classId ? '#60a5fa' : 'rgba(255,255,255,0.3)',
                  }}
                />
              </div>
              <span className={styles.barPercent}>{(prob * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
