import { makeAutoObservable } from "mobx";
import { CatalogItem, generateCatalog } from "../types";

export class MobxCatalogStore {
  items: CatalogItem[] = generateCatalog(10000);
  filter = "";
  sort: "asc" | "desc" = "asc";
  page = 0;
  pageSize = 50;
  constructor() {
    makeAutoObservable(this);
  }
  setFilter(f: string) {
    this.filter = f;
    this.page = 0;
  }
  setSort(s: "asc" | "desc") {
    this.sort = s;
  }
  setPage(p: number) {
    this.page = p;
  }
  applyUpdates(updates: { id: number; value: number }[]) {
    const map = new Map(updates.map((u) => [u.id, u.value]));
    for (const item of this.items) {
      const v = map.get(item.id);
      if (v !== undefined) item.value = v;
    }
  }
  replaceAll(size: number) {
    this.items = generateCatalog(size);
  }
  addItems(count: number) {
    if (count <= 0) return;
    const maxId = this.items.length ? Math.max(...this.items.map((i) => i.id)) : 0;
    const start = maxId + 1;
    for (let i = 0; i < count; i++) {
      const id = start + i;
      this.items.push({ id, name: `Элемент ${id}`, value: Math.random() });
    }
  }
  removeItemsByIds(ids: number[]) {
    if (!ids.length) return;
    const set = new Set(ids);
    this.items = this.items.filter((i) => !set.has(i.id));
  }
  removeRandom(count: number) {
    const n = Math.min(count, this.items.length);
    if (n <= 0) return;
    const idxs = new Set<number>();
    while (idxs.size < n) {
      idxs.add(Math.floor(Math.random() * this.items.length));
    }
    const toRemove = Array.from(idxs).map((idx) => this.items[idx]?.id).filter((v)=> v!==undefined) as number[];
    this.removeItemsByIds(toRemove);
  }
  get filtered() {
    const f = this.filter.toLowerCase();
    return this.items.filter((i) => i.name.toLowerCase().includes(f));
  }
  get sorted() {
    return [...this.filtered].sort((a, b) =>
      this.sort === "asc" ? a.value - b.value : b.value - a.value
    );
  }
  get paginated() {
    const start = this.page * this.pageSize;
    return this.sorted.slice(start, start + this.pageSize);
  }
}
export const mobxCatalogStore = new MobxCatalogStore();
