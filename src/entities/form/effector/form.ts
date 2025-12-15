import { createStore, createEvent } from "effector";
import { FormState, buildInitialForm } from "@/shared/lib/validation";

export const fieldChanged = createEvent<{ field: string; value: string }>();
export const localErrorsUpdated = createEvent<Record<string, string | null>>();
export const globalErrorUpdated = createEvent<string | null>();
export const formPresetApplied = createEvent<{
  fieldsCount: number;
  debounceMs: number;
}>();

const initial: FormState = buildInitialForm(3);
export const valuesStore = createStore<FormState>(initial)
  .on(fieldChanged, (s, { field, value }) => ({ ...s, [field]: value }))
  .on(formPresetApplied, (_, p) => buildInitialForm(p.fieldsCount));
export const localErrorsStore = createStore<Record<string, string | null>>(
  {}
).on(localErrorsUpdated, (_, e) => e);
export const globalErrorStore = createStore<string | null>(null).on(
  globalErrorUpdated,
  (_, e) => e
);
export const formMetaStore = createStore<{
  fieldsCount: number;
  debounceMs: number;
}>({ fieldsCount: 3, debounceMs: 300 }).on(formPresetApplied, (_, p) => ({
  fieldsCount: p.fieldsCount,
  debounceMs: p.debounceMs,
}));
