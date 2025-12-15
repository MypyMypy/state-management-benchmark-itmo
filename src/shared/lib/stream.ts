export function createRandomUpdates(count: number, size: number) {
  const updates: { id: number; value: number }[] = [];
  for (let i = 0; i < count; i++) {
    updates.push({ id: Math.floor(Math.random() * size), value: Math.random() });
  }
  return updates;
}
