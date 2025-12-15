export type FieldErrors = Record<string, string | null>;

export interface FormState {
  name: string;
  email: string;
  age: string;
  [key: string]: string; // динамические extra поля
}

export function validateLocal(state: FormState): FieldErrors {
  const errors: FieldErrors = {};
  errors.name = state.name.length < 2 ? 'Имя слишком короткое' : null;
  errors.email = /^[^@]+@[^@]+\.[^@]+$/.test(state.email) ? null : 'Неверный email';
  errors.age = /^(\d+)$/.test(state.age) ? null : 'Возраст должен быть числом';
  for (const key of Object.keys(state)) {
    if (key === 'name' || key === 'email' || key === 'age') continue;
    // простое правило для extra: непустое
    errors[key] = state[key].trim() ? null : 'Пустое поле';
  }
  return errors;
}

export function validateGlobal(state: FormState): string | null {
  const ageNum = parseInt(state.age, 10);
  if (!isNaN(ageNum) && ageNum < 18 && state.name && state.email) {
    return 'Для несовершеннолетних требуется согласие опекуна';
  }
  // aggregated completeness check: доля заполненных extra
  const extraKeys = Object.keys(state).filter(k => !['name','email','age'].includes(k));
  if (extraKeys.length) {
    const filled = extraKeys.filter(k => state[k].trim()).length;
    const ratio = filled / extraKeys.length;
    if (ratio < 0.5) return 'Менее 50% дополнительных полей заполнено';
  }
  return null;
}

export function buildInitialForm(totalFields: number): FormState {
  const base: FormState = { name: '', email: '', age: '' };
  const extras = totalFields - 3;
  for (let i=1;i<=extras;i++) {
    (base as any)[`extra${i}`] = '';
  }
  return base;
}

export function formProgress(state: FormState): { filled: number; total: number; percent: number } {
  const keys = Object.keys(state);
  const filled = keys.filter(k => state[k].trim()).length;
  const total = keys.length;
  return { filled, total, percent: total ? Math.round((filled/total)*100) : 0 };
}
