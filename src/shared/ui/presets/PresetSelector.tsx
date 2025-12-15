import React from 'react';

export interface PresetBase { name: string; }
interface PresetSelectorProps<T extends PresetBase> {
  presets: T[];
  current?: string;
  onApply: (preset: T) => void;
  label?: string;
}

export function PresetSelector<T extends PresetBase>({ presets, current, onApply, label = 'Пресеты' }: PresetSelectorProps<T>) {
  return (
    <div style={{display:'flex', gap:4, alignItems:'center', flexWrap:'wrap'}}>
      <span style={{fontSize:12, opacity:0.7}}>{label}:</span>
      {presets.map(p => (
        <button
          key={p.name}
          onClick={() => onApply(p)}
          style={{
            padding:'4px 8px',
            border:'1px solid #ccc',
            background: current === p.name ? '#1976d2' : '#f5f5f5',
            color: current === p.name ? '#fff' : '#333',
            borderRadius:4,
            cursor:'pointer'
          }}
        >{p.name}</button>
      ))}
    </div>
  );
}

export default PresetSelector;