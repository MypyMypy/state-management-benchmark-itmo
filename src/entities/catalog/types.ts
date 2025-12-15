export interface CatalogItem {
  id: number;
  name: string;
  value: number;
}

export function generateCatalog(size: number): CatalogItem[] {
  const arr: CatalogItem[] = [];
  for (let i = 0; i < size; i++) {
    arr.push({ id: i, name: `Элемент ${i}`, value: Math.random() });
  }
  return arr;
}
