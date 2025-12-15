import { makeAutoObservable } from 'mobx';
import { FormState, buildInitialForm } from '@/shared/lib/validation';

class MobxFormStore {
  values: FormState = buildInitialForm(3);
  localErrors: Record<string,string|null> = {};
  globalError: string | null = null;
  fieldCount = 3;
  debounceMs = 300;
  constructor(){ makeAutoObservable(this); }
  setField(field: keyof FormState, value: string){ this.values[field] = value; }
  setLocalErrors(e: Record<string,string|null>){ this.localErrors = e; }
  setGlobalError(e: string | null){ this.globalError = e; }
  applyPreset(fieldsCount: number, debounceMs: number){
    this.fieldCount = fieldsCount;
    this.debounceMs = debounceMs;
    this.values = buildInitialForm(fieldsCount);
    this.localErrors = {};
    this.globalError = null;
  }
}
export const mobxFormStore = new MobxFormStore();
