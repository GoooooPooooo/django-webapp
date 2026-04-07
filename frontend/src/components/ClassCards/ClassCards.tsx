import { CLASS_LABELS } from '../../types';
import styles from './ClassCards.module.css';

const classEmojis = ['🦎', '🦎', '🦎'];
const classDescriptions = [
  'Варан — крупные ящерицы',
  'Хамелеон — мастера маскировки',
  'Геккон — маленькие ящерицы',
];

export default function ClassCards() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Классы рептилий</h3>
      <div className={styles.cards}>
        {CLASS_LABELS.map((label, idx) => (
          <div key={label} className={styles.card}>
            <span className={styles.emoji}>{classEmojis[idx]}</span>
            <span className={styles.name}>{label}</span>
            <span className={styles.description}>{classDescriptions[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
