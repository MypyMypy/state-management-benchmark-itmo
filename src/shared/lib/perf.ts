export function markStart(label: string) {
  performance.mark(`${label}:start`);
}
export function markEnd(label: string) {
  performance.mark(`${label}:end`);
  // Guard: if start mark was cleared (e.g. user cleared marks before effect cleanup), skip measure to avoid runtime error.
  const hasStart = performance.getEntriesByName(`${label}:start`).length > 0;
  if (hasStart) {
    performance.measure(label, `${label}:start`, `${label}:end`);
  }
}
export function getMeasures(prefix: string) {
  return performance.getEntriesByType('measure').filter(m => m.name.startsWith(prefix));
}
