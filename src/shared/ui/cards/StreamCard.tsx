import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Cards.module.css";

type Props = {
  id: number;
  value: number;
};

const StreamCardInner: React.FC<Props> = ({ id, value }) => {
  const [history, setHistory] = useState<number[]>([]);
  const renders = useRef(0);
  const prev = useRef<number | null>(null);
  const [flash, setFlash] = useState(false);
  renders.current++;

  useEffect(() => {
    setHistory((h) =>
      h.length > 28 ? [...h.slice(-28), value] : [...h, value]
    );
    if (prev.current !== null && prev.current !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 150);
      return () => clearTimeout(t);
    }
    prev.current = value;
  }, [value]);

  const w = 220;
  const h = 36;
  const points = useMemo(() => {
    const arr = history.length ? history : [value];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const rng = max - min || 1;
    return arr
      .map((v, i) => {
        const x = (i / Math.max(1, arr.length - 1)) * w;
        const y = h - ((v - min) / rng) * (h - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");
  }, [history, value]);

  return (
    <div className={`${styles.card} ${flash ? styles.highlight : ""}`}>
      <div className={styles.header}>
        <div className={styles.title}>Поток №{id}</div>
        <span className={styles.badge}>перерисовок: {renders.current}</span>
      </div>
      <div className={styles.meta}>
        <span className={styles.value}>значение: {value.toFixed(4)}</span>
      </div>
      <svg
        className={styles.spark}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
      >
        <polyline
          points={`0,${h - 2} ${w},${h - 2}`}
          stroke="#eee"
          fill="none"
        />
        <polyline
          points={points}
          stroke="#42a5f5"
          fill="none"
          strokeWidth={1.5}
        />
      </svg>
    </div>
  );
};

export const StreamCard = React.memo(
  StreamCardInner,
  (prev, next) => prev.value === next.value && prev.id === next.id
);
export default StreamCard;
