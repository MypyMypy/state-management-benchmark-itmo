import { markStart, markEnd } from './perf';

export type PerfApi = {
  base: string;
  start: (suffix?: string) => void;
  end: (suffix?: string) => void;
  measureBlock: <T>(suffix: string | undefined | null, fn: () => T) => T;
  clear: () => void;
};

export function usePerf(baseLabel: string): PerfApi {
  const start = (suffix?: string) => {
    const label = suffix ? `${baseLabel}:${suffix}` : baseLabel;
    markStart(label);
  };
  const end = (suffix?: string) => {
    const label = suffix ? `${baseLabel}:${suffix}` : baseLabel;
    markEnd(label);
  };
  const measureBlock = <T>(suffix: string | undefined | null, fn: () => T): T => {
    const label = suffix ? `${baseLabel}:${suffix}` : baseLabel;
    markStart(label);
    try {
      return fn();
    } finally {
      markEnd(label);
    }
  };
  const clear = () => {
    performance.clearMarks();
    performance.clearMeasures();
  };
  return { base: baseLabel, start, end, measureBlock, clear };
}
