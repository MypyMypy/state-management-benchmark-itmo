import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals(cb: (metric: any) => void) {
  try {
    onCLS(cb);
    onINP(cb); // INP заменяет FID в новых версиях
    onLCP(cb);
    onTTFB(cb);
  } catch (e) {
    // ignore
  }
}
