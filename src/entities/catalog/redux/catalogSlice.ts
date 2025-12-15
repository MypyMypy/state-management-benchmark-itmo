import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CatalogItem, generateCatalog } from "@/entities/catalog/types";

interface CatalogState {
  items: CatalogItem[];
  filter: string;
  sort: "asc" | "desc";
  page: number;
  pageSize: number;
}

const initialState: CatalogState = {
  items: generateCatalog(10000),
  filter: "",
  sort: "asc",
  page: 0,
  pageSize: 50,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
      state.page = 0;
    },
    setSort(state, action: PayloadAction<"asc" | "desc">) {
      state.sort = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    applyUpdates(
      state,
      action: PayloadAction<{ id: number; value: number }[]>
    ) {
      const map = new Map(action.payload.map((u) => [u.id, u.value]));
      for (const item of state.items) {
        const v = map.get(item.id);
        if (v !== undefined) item.value = v;
      }
    },
    replaceAll(state, action: PayloadAction<number>) {
      const size = action.payload;
      state.items = generateCatalog(size);
    },
    addItems(state, action: PayloadAction<number | CatalogItem[]>) {
      if (typeof action.payload === 'number') {
        const count = action.payload;
        const maxId = state.items.length ? Math.max(...state.items.map(i => i.id)) : -1;
        for (let i = 1; i <= count; i++) {
          const id = maxId + i;
          state.items.push({ id, name: `Элемент ${id}`, value: Math.random() });
        }
      } else {
        for (const it of action.payload) state.items.push(it);
      }
    },
    removeItemsByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload);
      state.items = state.items.filter(i => !ids.has(i.id));
    },
    removeRandom(state, action: PayloadAction<number>) {
      const count = Math.min(action.payload, state.items.length);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * state.items.length);
        state.items.splice(idx, 1);
      }
    }
  },
});

export const { setFilter, setSort, setPage, applyUpdates, replaceAll, addItems, removeItemsByIds, removeRandom } =
  catalogSlice.actions;
export default catalogSlice.reducer;
