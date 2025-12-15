import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormState, buildInitialForm } from '@/shared/lib/validation';

interface FormSliceState {
  values: FormState;
  localErrors: Record<string,string|null>;
  globalError: string | null;
}
const initialState: FormSliceState = {
  values: buildInitialForm(3),
  localErrors: {},
  globalError: null,
  fieldCount: 3,
  debounceMs: 300,
};
const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    fieldChanged(state, action: PayloadAction<{ field:string; value:string }>) {
      state.values[action.payload.field] = action.payload.value;
    },
    localErrorsUpdated(state, action: PayloadAction<Record<string,string|null>>) { state.localErrors = action.payload; },
    globalErrorUpdated(state, action: PayloadAction<string | null>) { state.globalError = action.payload; }
    ,presetApplied(state, action: PayloadAction<{ fieldsCount:number; debounceMs:number }>) {
      state.fieldCount = action.payload.fieldsCount;
      state.debounceMs = action.payload.debounceMs;
      state.values = buildInitialForm(action.payload.fieldsCount);
      state.localErrors = {};
      state.globalError = null;
    }
  }
});
export const { fieldChanged, localErrorsUpdated, globalErrorUpdated, presetApplied } = formSlice.actions;
export default formSlice.reducer;
