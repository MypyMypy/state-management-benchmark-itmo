import React, { useMemo, useState, useEffect, useCallback } from "react";
import { usePerfMark } from "@/shared/lib/usePerfMark";
import { useDispatch, useSelector } from "react-redux";
import {
  applyUpdates,
  setFilter,
  setSort,
  addItems,
  removeItemsByIds,
  removeRandom,
  replaceAll,
} from "@/entities/catalog/redux/catalogSlice";
import { PresetSelector } from "@/shared/ui/presets/PresetSelector";
import { catalogPresets, CatalogPreset } from "@/shared/config/presets";
import { createRandomUpdates } from "@/shared/lib/stream";
import { RootState } from "@/app/providers/store";
import { CatalogCard } from "@/shared/ui/cards/CatalogCard";
import { CardsGrid } from "@/shared/ui/cards/CardsGrid";
import { CatalogControls } from "@/shared/ui/controls/CatalogControls";
import { usePerf } from "@/shared/lib/usePerf";

export default function ReduxCatalog() {
  const dispatch = useDispatch();
  const { items, filter, sort } = useSelector((s: RootState) => s.catalog);
  const [running, setRunning] = useState(false);
  const [addCount, setAddCount] = useState(50);
  const [removeCount, setRemoveCount] = useState(50);
  const [batchSize, setBatchSize] = useState(20);
  const [presetName, setPresetName] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showCards, setShowCards] = useState(true);
  usePerfMark("ReduxCatalog:render");

  const filtered = useMemo(
    () =>
      items.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase())),
    [items, filter]
  );
  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        sort === "asc" ? a.value - b.value : b.value - a.value
      ),
    [filtered, sort]
  );
  const visible = sorted; // убрали пагинацию — показываем всё

  useEffect(() => {
    if (!running) return;
    const perf = usePerf(
      presetName ? `redux:updates:${presetName}` : "redux:updates"
    );
    const id = setInterval(() => {
      const updates = createRandomUpdates(batchSize, items.length);
      perf.measureBlock(null, () => {
        dispatch(applyUpdates(updates));
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, dispatch, items.length, batchSize, presetName]);
  const applyPreset = (p: CatalogPreset) => {
    setPresetName(p.name);
    dispatch(replaceAll(p.initialItems));
    setAddCount(p.addCount);
    setRemoveCount(p.removeRandomCount);
    setBatchSize(p.updateBatchSize);
    setSelected(new Set());
    performance.clearMarks();
    performance.clearMeasures();
  };

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
    dispatch(removeItemsByIds(Array.from(selected)));
    setSelected(new Set());
  };

  return (
    <div>
      <h2>Redux S1 Каталог (карточки, без пагинации)</h2>
      <CatalogControls
        filter={filter}
        sort={sort}
        running={running}
        addCount={addCount}
        removeCount={removeCount}
        selectedCount={selected.size}
        onFilterChange={(v) => dispatch(setFilter(v))}
        onSortChange={(v) => dispatch(setSort(v))}
        onToggleRunning={() => setRunning((r) => !r)}
        onToggleShowCards={() => setShowCards((s) => !s)}
        onAddCountChange={(n) => setAddCount(n)}
        onRemoveCountChange={(n) => setRemoveCount(n)}
        onAdd={(n) => dispatch(addItems(n))}
        onRemoveRandom={(n) => dispatch(removeRandom(n))}
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
          total={items.length}
          render={(i) => (
            <CatalogCard
              key={i.id}
              id={i.id}
              name={i.name}
              value={i.value}
              selected={selected.has(i.id)}
              onToggleSelect={toggleSelect}
              onRemove={(id) => dispatch(removeItemsByIds([id]))}
            />
          )}
        />
      )}
    </div>
  );
}
