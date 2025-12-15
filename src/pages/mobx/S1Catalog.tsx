import React, { useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { mobxCatalogStore } from "@/entities/catalog/mobx/catalogStore";
import { createRandomUpdates } from "@/shared/lib/stream";
import { CatalogCard } from "@/shared/ui/cards/CatalogCard";
import { CardsGrid } from "@/shared/ui/cards/CardsGrid";
import { CatalogControls } from "@/shared/ui/controls/CatalogControls";
import { PresetSelector } from "@/shared/ui/presets/PresetSelector";
import { catalogPresets, CatalogPreset } from "@/shared/config/presets";
import { usePerf } from "@/shared/lib/usePerf";
import { usePerfMark } from "@/shared/lib/usePerfMark";

const MobxCatalog = observer(() => {
  const [running, setRunning] = useState(false);
  const [addCount, setAddCount] = useState(50);
  const [removeCount, setRemoveCount] = useState(50);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [batchSize, setBatchSize] = useState(20);
  const [presetName, setPresetName] = useState<string | undefined>();
  const [showCards, setShowCards] = useState(true);
  usePerfMark("MobxCatalog:render");

  useEffect(() => {
    if (!running) return;
    const perf = usePerf(
      presetName ? `mobx:updates:${presetName}` : "mobx:updates"
    );
    const id = setInterval(() => {
      const updates = createRandomUpdates(
        batchSize,
        mobxCatalogStore.items.length
      );
      perf.measureBlock(null, () => {
        mobxCatalogStore.applyUpdates(updates);
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, batchSize, presetName]);

  const filtered = useMemo(
    () =>
      mobxCatalogStore.items.filter((i) =>
        i.name.toLowerCase().includes(mobxCatalogStore.filter.toLowerCase())
      ),
    [mobxCatalogStore.items, mobxCatalogStore.filter]
  );
  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        mobxCatalogStore.sort === "asc" ? a.value - b.value : b.value - a.value
      ),
    [filtered, mobxCatalogStore.sort]
  );
  const visible = sorted; // без пагинации — показываем всё

  const toggleSelect = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const removeSelected = () => {
    if (selected.size === 0) return;
    mobxCatalogStore.removeItemsByIds(Array.from(selected));
    setSelected(new Set());
  };

  const applyPreset = (p: CatalogPreset) => {
    setPresetName(p.name);
    mobxCatalogStore.replaceAll(p.initialItems);
    setAddCount(p.addCount);
    setRemoveCount(p.removeRandomCount);
    setBatchSize(p.updateBatchSize);
    setSelected(new Set());
    performance.clearMarks();
    performance.clearMeasures();
  };

  return (
    <div>
      <h2>MobX S1 Каталог (карточки, без пагинации)</h2>
      <CatalogControls
        filter={mobxCatalogStore.filter}
        sort={mobxCatalogStore.sort}
        running={running}
        addCount={addCount}
        removeCount={removeCount}
        selectedCount={selected.size}
        onFilterChange={(v) => mobxCatalogStore.setFilter(v)}
        onSortChange={(v) => mobxCatalogStore.setSort(v)}
        onToggleRunning={() => setRunning((r) => !r)}
        onToggleShowCards={() => setShowCards((s) => !s)}
        onAddCountChange={(n) => setAddCount(n)}
        onRemoveCountChange={(n) => setRemoveCount(n)}
        onAdd={(n) => mobxCatalogStore.addItems(n)}
        onRemoveRandom={(n) => mobxCatalogStore.removeRandom(n)}
        onRemoveSelected={removeSelected}
      />
      <PresetSelector
        presets={catalogPresets}
        current={presetName}
        onApply={applyPreset}
        label="Каталог"
      />
      {showCards && (
        <CardsGrid
          items={visible}
          total={mobxCatalogStore.items.length}
          render={(i) => (
            <CatalogCard
              key={i.id}
              id={i.id}
              name={i.name}
              value={i.value}
              selected={selected.has(i.id)}
              onToggleSelect={toggleSelect}
              onRemove={(id) => mobxCatalogStore.removeItemsByIds([id])}
            />
          )}
        />
      )}
    </div>
  );
});
export default MobxCatalog;
