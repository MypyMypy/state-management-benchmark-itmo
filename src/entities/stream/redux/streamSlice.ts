import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StreamState { data: number[]; version: number; }
const initialState: StreamState = { data: new Array(1000).fill(0).map(()=> Math.random()), version:0 };
const streamSlice = createSlice({
  name: 'stream',
  initialState,
  reducers: {
    batchUpdate(state, action: PayloadAction<{ idx:number; value:number }[]>) {
      for (const u of action.payload) state.data[u.idx] = u.value;
      state.version++;
    }
    ,replaceAll(state, action: PayloadAction<number>) {
      const size = action.payload;
      state.data = new Array(size).fill(0).map(()=> Math.random());
      state.version = 0;
    }
  }
});
export const { batchUpdate, replaceAll } = streamSlice.actions;
export default streamSlice.reducer;
