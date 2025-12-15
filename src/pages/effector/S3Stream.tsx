import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { batchUpdate, streamStore } from '@/entities/stream/effector/stream';
import { StreamCard } from '@/shared/ui/cards/StreamCard';
import { CardsGrid } from '@/shared/ui/cards/CardsGrid';
import { StreamControls } from '@/shared/ui/controls/StreamControls';
import { PresetSelector } from '@/shared/ui/presets/PresetSelector';
import { streamPresets, StreamPreset } from '@/shared/config/presets';
import { replaceAll } from '@/entities/stream/effector/stream';
import { usePerf } from '@/shared/lib/usePerf';

export default function EffectorStream() {
  const stream = useUnit(streamStore);
  const updateBatch = useUnit(batchUpdate);
  const [running, setRunning] = useState(false);
  const [rate, setRate] = useState(20);
  const [visible, setVisible] = useState(100);
  const [presetName, setPresetName] = useState<string | undefined>();

  useEffect(()=> {
    if (!running) return;
    const perf = usePerf(presetName ? `effector:stream:${presetName}` : 'effector:stream');
    const id = setInterval(()=> {
      const updates = Array.from({length: rate}, ()=> ({ idx: Math.floor(Math.random()*stream.data.length), value: Math.random() }));
      perf.measureBlock(null, ()=> {
        updateBatch(updates);
      });
    }, 1000);
    return ()=> clearInterval(id);
  }, [running, rate, updateBatch, stream.data.length, presetName]);

  return (
    <div>
      <div style={{marginBottom:12}}>
        <label style={{display:'inline-flex', alignItems:'center', gap:6}}>
          Видимых карточек:
          <input type="number" value={visible} onChange={e=> setVisible(Math.max(1, Number(e.target.value)))} style={{width:100}} />
        </label>
      </div>
      <h2>Effector S3 Поток (карточки) — версия {stream.version}</h2>
      <StreamControls
        rate={rate}
        visible={visible}
        running={running}
        onRateChange={(n) => setRate(n)}
        onVisibleChange={(n) => setVisible(n)}
        onToggleRunning={() => setRunning(r => !r)}
        hideVisible
      />
      <CardsGrid
        items={Array.from({length: visible}, (_, idx)=> idx)}
        total={stream.data.length}
        render={(i) => <StreamCard key={i} id={i} value={stream.data[i]} />}
      />
      <PresetSelector
        presets={streamPresets}
        current={presetName}
        onApply={(p: StreamPreset) => {
          setPresetName(p.name);
          replaceAll(p.dataSize);
          setRate(p.rate);
          setVisible(p.visibleCards);
          performance.clearMarks();
          performance.clearMeasures();
        }}
        label="Поток"
      />
    </div>
  );
}
