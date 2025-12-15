import { makeAutoObservable } from 'mobx';
class MobxStreamStore {
  data: number[] = new Array(1000).fill(0).map(()=> Math.random());
  version = 0;
  constructor(){ makeAutoObservable(this); }
  batchUpdate(updates: { idx:number; value:number }[]) {
    for (const u of updates) this.data[u.idx] = u.value;
    this.version++;
  }
  replaceAll(size:number) {
    this.data = new Array(size).fill(0).map(()=> Math.random());
    this.version = 0;
  }
}
export const mobxStreamStore = new MobxStreamStore();
