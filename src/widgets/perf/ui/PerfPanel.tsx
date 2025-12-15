import React, { useEffect, useMemo, useState } from "react";
import styles from "./PerfPanel.module.css";

interface StatRow {
  name: string;
  count: number;
  mean: number;
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
}

function computeStats(name: string, durations: number[]): StatRow {
  const sorted = [...durations].sort((a, b) => a - b);
  const n = sorted.length;
  const pick = (q: number) => sorted[Math.floor((n - 1) * q)] || 0;
  const sum = sorted.reduce((a, b) => a + b, 0);
  return {
    name,
    count: n,
    mean: n ? sum / n : 0,
    p50: pick(0.5),
    p95: pick(0.95),
    p99: pick(0.99),
    min: sorted[0] || 0,
    max: sorted[n - 1] || 0,
  };
}

export const PerfPanel: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tick, setTick] = useState(0);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  const { stats, recent } = useMemo(() => {
    const measures = performance.getEntriesByType(
      "measure"
    ) as PerformanceMeasure[];

    const groups = new Map<string, number[]>();
    for (const m of measures) {
      if (filter && !m.name.includes(filter)) continue;
      if (!groups.has(m.name)) groups.set(m.name, []);
      groups.get(m.name)!.push(m.duration);
    }

    const stats = Array.from(groups.entries())
      .map(([name, ds]) => computeStats(name, ds))
      .sort((a, b) => a.name.localeCompare(b.name));

    const recent = Object.fromEntries(
      Array.from(groups.entries()).map(([name, ds]) => [name, ds.slice(-30)])
    );
    return { stats, recent };
  }, [tick, filter]);

  const vitals = (window as any).__vitals as any[] | undefined;

  const exportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      measures: performance.getEntriesByType("measure").map((m) => ({
        name: m.name,
        duration: m.duration,
        startTime: m.startTime,
      })),
      vitals: vitals || [],
      userAgent: navigator.userAgent,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "perf-session.json";
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  };

  const clearAll = () => {
    performance.clearMarks();
    performance.clearMeasures();
    if ((window as any).__vitals) (window as any).__vitals = [];
    setTick((t) => t + 1);
  };

  if (!open) {
    return (
      <button
        style={{ position: "fixed", right: 8, bottom: 8, zIndex: 9999 }}
        onClick={() => setOpen(true)}
      >
        Perf
      </button>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <button onClick={() => setOpen(false)}>✕</button>
        <button onClick={() => setTick((t) => t + 1)}>Refresh</button>
        <button onClick={clearAll}>Clear</button>
        <button onClick={exportJson}>Export</button>
        <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />{" "}
          Auto
        </label>
        <input
          placeholder="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Count</th>
              <th>Mean</th>
              <th>p50</th>
              <th>p95</th>
              <th>p99</th>
              <th>Min</th>
              <th>Max</th>
              <th>Last 30</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td>{s.count}</td>
                <td>{s.mean.toFixed(2)}</td>
                <td>{s.p50.toFixed(2)}</td>
                <td>{s.p95.toFixed(2)}</td>
                <td>{s.p99.toFixed(2)}</td>
                <td>{s.min.toFixed(2)}</td>
                <td>{s.max.toFixed(2)}</td>
                <td className={styles.spark}>
                  {recent[s.name] && recent[s.name].length > 1 ? (
                    <Sparkline data={recent[s.name]} />
                  ) : (
                    <span style={{ opacity: 0.4 }}>–</span>
                  )}
                </td>
              </tr>
            ))}
            {!stats.length && (
              <tr>
                <td colSpan={8} style={{ opacity: 0.7 }}>
                  No measures
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.vitals}>
        <strong>Web Vitals ({vitals?.length || 0}):</strong>
        <div className={styles.small}>
          {(vitals || []).map((v) => (
            <div key={v.id || v.name + v.value}>
              {v.name}: {v.value.toFixed(2)} {v.rating ? `(${v.rating})` : ""}
            </div>
          ))}
          {(!vitals || vitals.length === 0) && (
            <div style={{ opacity: 0.7 }}>No vitals yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfPanel;

interface SparkProps {
  data: number[];
}
const Sparkline: React.FC<SparkProps> = ({ data }) => {
  const w = 100;
  const h = 24;
  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((d, i) => {
      const x = (i / (n - 1)) * w;
      const y = h - ((d - min) / range) * (h - 4) - 2; // padding
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline className="bg" points={`0,${h - 2} ${w},${h - 2}`} />
      <polyline points={pts} />
    </svg>
  );
};
