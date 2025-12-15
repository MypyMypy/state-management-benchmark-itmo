import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { batchUpdate } from "@/entities/stream/redux/streamSlice";
import { RootState } from "@/app/providers/store";
import { StreamCard } from "@/shared/ui/cards/StreamCard";
import { CardsGrid } from "@/shared/ui/cards/CardsGrid";
import { PresetSelector } from "@/shared/ui/presets/PresetSelector";
import { streamPresets, StreamPreset } from "@/shared/config/presets";
import { replaceAll } from "@/entities/stream/redux/streamSlice";
import StreamControls from "@/shared/ui/controls/StreamControls";
import { usePerf } from "@/shared/lib/usePerf";

export default function ReduxStream() {
  const dispatch = useDispatch();
  const { data, version } = useSelector((s: RootState) => s.stream);
  const [running, setRunning] = useState(false);
  const [rate, setRate] = useState(20);
  const [visible, setVisible] = useState(100);
  const [presetName, setPresetName] = useState<string | undefined>();

  useEffect(() => {
    if (!running) return;
    const perf = usePerf(
      presetName ? `redux:stream:${presetName}` : "redux:stream"
    );
    const interval = setInterval(() => {
      const updates = Array.from({ length: rate }, () => ({
        idx: Math.floor(Math.random() * data.length),
        value: Math.random(),
      }));
      perf.measureBlock(null, () => {
        dispatch(batchUpdate(updates));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, rate, dispatch, data.length, presetName]);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Видимых карточек:
          <input
            type="number"
            value={visible}
            onChange={(e) => setVisible(Math.max(1, Math.min(Number(e.target.value), data.length)))}
            style={{ width: 100 }}
          />
        </label>
      </div>
      <h2>Redux S3 Поток (карточки) — версия {version}</h2>
      <StreamControls
        rate={rate}
        visible={visible}
        running={running}
        onRateChange={(n: number) => setRate(n)}
        onVisibleChange={(n: number) => setVisible(n)}
        onToggleRunning={() => setRunning((r) => !r)}
        hideVisible
      />
      <PresetSelector
        presets={streamPresets}
        current={presetName}
        onApply={(p: StreamPreset) => {
          setPresetName(p.name);
          dispatch(replaceAll(p.dataSize));
          setRate(p.rate);
          setVisible(p.visibleCards);
          performance.clearMarks();
          performance.clearMeasures();
        }}
        label="Поток"
      />
      <CardsGrid
        items={Array.from({ length: visible }, (_, idx) => idx)}
        total={data.length}
        render={(i) => <StreamCard key={i} id={i} value={data[i]} />}
      />
    </div>
  );
}
