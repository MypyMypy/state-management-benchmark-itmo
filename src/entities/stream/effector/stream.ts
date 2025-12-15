import { createStore, createEvent } from 'effector';
export const batchUpdate = createEvent<{ idx:number; value:number }[]>();
export const replaceAll = createEvent<number>();
export const streamStore = createStore({ data: new Array(1000).fill(0).map(()=> Math.random()), version:0 })
  .on(batchUpdate, (s, updates) => {
    const data = [...s.data];
    for (const u of updates) data[u.idx] = u.value;
    return { data, version: s.version + 1 };
  })
  .on(replaceAll, (_, size) => ({ data: new Array(size).fill(0).map(()=> Math.random()), version:0 }));
