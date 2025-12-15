import React, { Profiler, type ProfilerOnRenderCallback } from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/app/App';
import { reportWebVitals } from '@/app/reportWebVitals';
import '@/shared/lib/whyDidYouRender';
import './styles.css';

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
) => {
  const startMark = `profiler:${id}:${phase}:start`;
  const endMark = `profiler:${id}:${phase}:end`;

  const hasStart = performance.getEntriesByName(startMark).length > 0;
  if (!hasStart) {
    performance.mark(startMark);
    return;
  }

  performance.mark(endMark);
  try {
    performance.measure(`profiler:${id}:${phase}`, startMark, endMark);
  } catch {
  }
};

performance.mark('profiler:App:mount:start');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Profiler id="App" onRender={onRender}>
      <App />
    </Profiler>
  </React.StrictMode>
);

performance.mark('profiler:App:mount:end');
performance.measure('App:mount', 'profiler:App:mount:start', 'profiler:App:mount:end');

reportWebVitals(metric => {
  (window as any).__vitals = (window as any).__vitals || [];
  (window as any).__vitals.push(metric);
  console.log(metric);
});
