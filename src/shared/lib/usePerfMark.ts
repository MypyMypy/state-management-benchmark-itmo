import { useEffect } from 'react';
import { markStart, markEnd } from './perf';

export function usePerfMark(label: string) {
  useEffect(() => {
    markStart(label);
    return () => markEnd(label);
  });
}
