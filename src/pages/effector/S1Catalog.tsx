import React, { useCallback, useEffect, useState } from "react";
import { useUnit } from "effector-react";
import {
  derivedStore,
  filterChanged,
  sortChanged,
  updatesApplied,
  addItems,
  removeItemsByIds,
  removeRandom,
} from "@/entities/catalog/effector/catalog";
import { createRandomUpdates } from "@/shared/lib/stream";
import { CatalogCard } from "@/shared/ui/cards/CatalogCard";
import { CardsGrid } from "@/shared/ui/cards/CardsGrid";
import { CatalogControls } from "@/shared/ui/controls/CatalogControls";
import { PresetSelector } from "@/shared/ui/presets/PresetSelector";
import { catalogPresets, CatalogPreset } from "@/shared/config/presets";
import { replaceAll } from "@/entities/catalog/effector/catalog";
import { usePerf } from "@/shared/lib/usePerf";
import { usePerfMark } from "@/shared/lib/usePerfMark";

export default function EffectorCatalog() {
  const list = useUnit(derivedStore);
  const changeFilter = useUnit(filterChanged);
  const applyUpdatesEv = useUnit(updatesApplied);
  const addItemsEv = useUnit(addItems);
  const removeByIdsEv = useUnit(removeItemsByIds);
  const removeRandomEv = useUnit(removeRandom);
  const [filter, setFilter] = useState("");
  const [sort, setSortLocal] = useState<"asc" | "desc">("asc");
  const [running, setRunning] = useState(false);
  const [addCount, setAddCount] = useState(50);
  const [removeCount, setRemoveCount] = useState(50);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [batchSize, setBatchSize] = useState(20);
  const [presetName, setPresetName] = useState<string | undefined>();
  const [showCards, setShowCards] = useState(true);
  usePerfMark("MobxCatalog:render");

  useEffect(() => {
    changeFilter(filter);
  }, [filter, changeFilter]);

  useEffect(() => {
    sortChanged(sort);
  }, [sort]);

  useEffect(() => {
    if (!running) return;
    const perf = usePerf(
      presetName ? `effector:updates:${presetName}` : "effector:updates"
    );
    const id = setInterval(() => {
      const updates = createRandomUpdates(batchSize, list.length);
      perf.measureBlock(null, () => {
        applyUpdatesEv(updates);
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, applyUpdatesEv, list.length, batchSize, presetName]);

  return (
    <div>
      <h2>Effector S1 Каталог (карточки, без пагинации)</h2>
      <CatalogControls
        filter={filter}
        sort={sort}
        running={running}
        addCount={addCount}
        removeCount={removeCount}
        selectedCount={selected.size}
        onFilterChange={(v) => setFilter(v)}
        onSortChange={(v) => setSortLocal(v)}
        onToggleRunning={() => setRunning((r) => !r)}
        onToggleShowCards={() => setShowCards((s) => !s)}
        onAddCountChange={(n) => setAddCount(n)}
        onRemoveCountChange={(n) => setRemoveCount(n)}
        onAdd={(n) => addItemsEv(n)}
        onRemoveRandom={(n) => removeRandomEv(n)}
        onRemoveSelected={() => {
          if (selected.size) {
            removeByIdsEv(Array.from(selected));
            setSelected(new Set());
          }
        }}
      />
      <PresetSelector
        presets={catalogPresets}
        current={presetName}
        onApply={(p: CatalogPreset) => {
          setPresetName(p.name);
          replaceAll(p.initialItems);
          setAddCount(p.addCount);
          setRemoveCount(p.removeRandomCount);
          setBatchSize(p.updateBatchSize);
          setSelected(new Set());
          performance.clearMarks();
          performance.clearMeasures();
        }}
        label="Каталог"
      />
      {showCards && (
        <CardsGrid
          items={list}
          render={(i) => (
            <CatalogCard
              key={i.id}
              id={i.id}
              name={i.name}
              value={i.value}
              selected={selected.has(i.id)}
              onToggleSelect={(id) =>
                setSelected((prev) => {
                  const next = new Set(prev);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  return next;
                })
              }
              onRemove={(id) => removeByIdsEv([id])}
            />
          )}
        />
      )}
    </div>
  );
}
