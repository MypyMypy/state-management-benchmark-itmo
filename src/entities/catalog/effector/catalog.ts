import { createStore, createEvent, sample } from "effector";
import { generateCatalog } from "@/entities/catalog/types";

export const filterChanged = createEvent<string>();
export const sortChanged = createEvent<"asc" | "desc">();
export const pageChanged = createEvent<number>();
export const updatesApplied = createEvent<{ id: number; value: number }[]>();
export const addItems = createEvent<number>();
export const removeItemsByIds = createEvent<number[]>();
export const removeRandom = createEvent<number>();
export const replaceAll = createEvent<number>();

const itemsStore = createStore(generateCatalog(10000))
  .on(updatesApplied, (items, updates) => {
    const map = new Map(updates.map((u) => [u.id, u.value]));
    return items.map((it) =>
      map.has(it.id) ? { ...it, value: map.get(it.id)! } : it
    );
  })
  .on(addItems, (items, count) => {
    const n = Math.max(0, count | 0);
    if (n <= 0) return items;
    const maxId = items.length ? Math.max(...items.map((i) => i.id)) : -1;
    const start = maxId + 1;
    const added = Array.from({ length: n }, (_, i) => {
      const id = start + i;
      return { id, name: `Элемент ${id}`, value: Math.random() };
    });
    return [...items, ...added];
  })
  .on(removeItemsByIds, (items, ids) => {
    if (!ids.length) return items;
    const set = new Set(ids);
    return items.filter((i) => !set.has(i.id));
  })
  .on(removeRandom, (items, count) => {
    const n = Math.min(Math.max(0, count | 0), items.length);
    if (n <= 0) return items;
    const idxs = new Set<number>();
    while (idxs.size < n) idxs.add(Math.floor(Math.random() * items.length));
    const toRemove = Array.from(idxs)
      .map((idx) => items[idx]?.id)
      .filter((x): x is number => typeof x === "number");
    const set = new Set(toRemove);
    return items.filter((i) => !set.has(i.id));
  })
  .on(replaceAll, (_, size) => generateCatalog(size));
export const filterStore = createStore("").on(filterChanged, (_, f) => f);
export const sortStore = createStore<"asc" | "desc">("asc").on(
  sortChanged,
  (_, s) => s
);
export const pageStore = createStore(0)
  .on(pageChanged, (_, p) => p)
  .reset(filterChanged);
export const pageSizeStore = createStore(50);

export const derivedStore = sample({
  source: {
    items: itemsStore,
    filter: filterStore,
    sort: sortStore,
    page: pageStore,
    pageSize: pageSizeStore,
  },
  fn: ({ items, filter, sort }) => {
    const fLower = filter.toLowerCase();
    let filtered = items.filter((i) => i.name.toLowerCase().includes(fLower));
    filtered = filtered.sort((a, b) =>
      sort === "asc" ? a.value - b.value : b.value - a.value
    );
    // No pagination: return all visible for heavier UI
    return filtered;
  },
});
