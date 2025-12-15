import React, { useMemo } from 'react';
import styles from './Cards.module.css';

type Props = {
  id: number;
  name: string;
  value: number;
  selected?: boolean;
  onToggleSelect?: (id:number)=>void;
  onRemove?: (id:number)=>void;
};

function hashColor(id:number, value:number) {
  const x = Math.abs(Math.sin(id + value) * 16777215) | 0;
  const hex = ('000000' + x.toString(16)).slice(-6);
  return '#' + hex;
}

const Spark: React.FC<{seed:number}> = ({ seed }) => {
  const w=220, h=36, n=24;
  const pts = useMemo(()=>{
    let x = Math.sin(seed) * 1000;
    const arr:number[] = [];
    for (let i=0;i<n;i++){ x = Math.sin(x*1.3+7.1)*0.5+0.5; arr.push(x); }
    const min = Math.min(...arr), max = Math.max(...arr) || 1;
    return arr.map((v,i)=>{
      const px = (i/(n-1))*w; const py = h - ((v-min)/(max-min))* (h-4) - 2;
      return `${px},${py}`;
    }).join(' ');
  },[seed]);
  return (
    <svg className={styles.spark} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={`0,${h-2} ${w},${h-2}`} stroke="#eee" fill="none" />
      <polyline points={pts} stroke="#7cb342" fill="none" strokeWidth={1.5} />
    </svg>
  );
};

export const CatalogCard: React.FC<Props> = ({ id, name, value, selected, onToggleSelect, onRemove }) => {
  const color = hashColor(id, value);
  const heavyDerived = useMemo(()=> {
    // имитация небольшой вычислительной нагрузки
    let s = 0; for (let i=0;i<500;i++){ s += Math.sqrt((i+1)*value) % 7; }
    return s;
  }, [value]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{name}</div>
        <div className={styles.row}>
          {onToggleSelect && (
            <input type="checkbox" checked={!!selected} onChange={()=> onToggleSelect(id)} />
          )}
          <span className={styles.badge}>id:{id}</span>
        </div>
      </div>
      <div className={styles.meta}>
        <span>цвет: <span style={{color}}>{color}</span></span>
        <span className={styles.value}>значение: {value.toFixed(4)}</span>
        <span className={styles.badge}>производное: {heavyDerived.toFixed(2)}</span>
      </div>
      <Spark seed={id + value} />
      {onRemove && (
        <div className={styles.actions}>
          <button onClick={()=> onRemove(id)}>Удалить</button>
        </div>
      )}
    </div>
  );
};

export default CatalogCard;
