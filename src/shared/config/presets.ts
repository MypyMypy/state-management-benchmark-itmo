export interface CatalogPreset {
  name: string;
  initialItems: number;
  updateBatchSize: number;
  addCount: number;
  removeRandomCount: number;
}
export interface StreamPreset {
  name: string;
  dataSize: number;
  rate: number;
  visibleCards: number;
}

export interface FormPreset {
  name: string;
  fieldsCount: number;
  debounceMs: number;
}

export const catalogPresets: CatalogPreset[] = [
  {
    name: "Малый",
    initialItems: 2000,
    updateBatchSize: 10,
    addCount: 50,
    removeRandomCount: 50,
  },
  {
    name: "Средний",
    initialItems: 10000,
    updateBatchSize: 20,
    addCount: 200,
    removeRandomCount: 200,
  },
  {
    name: "Большой",
    initialItems: 25000,
    updateBatchSize: 40,
    addCount: 500,
    removeRandomCount: 500,
  },
  {
    name: "Стресс",
    initialItems: 50000,
    updateBatchSize: 80,
    addCount: 2000,
    removeRandomCount: 2000,
  },
];

export const streamPresets: StreamPreset[] = [
  { name: "Малый", dataSize: 500, rate: 20, visibleCards: 50 },
  { name: "Средний", dataSize: 1000, rate: 40, visibleCards: 100 },
  { name: "Большой", dataSize: 2000, rate: 60, visibleCards: 250 },
  { name: "Стресс", dataSize: 5000, rate: 120, visibleCards: 400 },
];

export const formPresets: FormPreset[] = [
  { name: "Малый", fieldsCount: 3, debounceMs: 300 },
  { name: "Средний", fieldsCount: 8, debounceMs: 300 },
  { name: "Большой", fieldsCount: 15, debounceMs: 200 },
  { name: "Стресс", fieldsCount: 25, debounceMs: 150 },
];

export function findCatalogPreset(name: string): CatalogPreset | undefined {
  return catalogPresets.find((p) => p.name === name);
}
export function findStreamPreset(name: string): StreamPreset | undefined {
  return streamPresets.find((p) => p.name === name);
}
export function findFormPreset(name: string): FormPreset | undefined {
  return formPresets.find((p) => p.name === name);
}
