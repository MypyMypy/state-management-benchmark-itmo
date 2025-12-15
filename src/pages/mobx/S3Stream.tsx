import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { mobxStreamStore } from '@/entities/stream/mobx/streamStore';
import { StreamCard } from '@/shared/ui/cards/StreamCard';
import { CardsGrid } from '@/shared/ui/cards/CardsGrid';
import { StreamControls } from '@/shared/ui/controls/StreamControls';
import { PresetSelector } from '@/shared/ui/presets/PresetSelector';
import { streamPresets, StreamPreset } from '@/shared/config/presets';
import { usePerf } from '@/shared/lib/usePerf';

const MobxStream = observer(()=> {
  const [running, setRunning] = useState(false);
  const [rate, setRate] = useState(20);
  const [visible, setVisible] = useState(100);
  const [presetName, setPresetName] = useState<string | undefined>();
  useEffect(()=> {
    if (!running) return;
    const perf = usePerf(presetName ? `mobx:stream:${presetName}` : 'mobx:stream');
    const id = setInterval(()=> {
      const updates = Array.from({length: rate}, ()=> ({ idx: Math.floor(Math.random()*mobxStreamStore.data.length), value: Math.random() }));
      perf.measureBlock(null, ()=> {
        mobxStreamStore.batchUpdate(updates);
      });
    }, 1000);
    return ()=> clearInterval(id);
  }, [running, rate, mobxStreamStore.data.length, presetName]);
  return (
    <div>
      <div style={{marginBottom:12}}>
        <label style={{display:'inline-flex', alignItems:'center', gap:6}}>
          Видимых карточек:
          <input type="number" value={visible} onChange={e=> setVisible(Math.max(1, Number(e.target.value)))} style={{width:100}} />
        </label>
      </div>
      <h2>MobX S3 Поток (карточки) — версия {mobxStreamStore.version}</h2>
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
        total={mobxStreamStore.data.length}
        render={(i) => <StreamCard key={i} id={i} value={mobxStreamStore.data[i]} />}
      />
      <PresetSelector
        presets={streamPresets}
        current={presetName}
        onApply={(p: StreamPreset) => {
          setPresetName(p.name);
          mobxStreamStore.replaceAll(p.dataSize);
          setRate(p.rate);
          setVisible(p.visibleCards);
          performance.clearMarks();
          performance.clearMeasures();
        }}
        label="Поток"
      />
    </div>
  );
});
export default MobxStream;
