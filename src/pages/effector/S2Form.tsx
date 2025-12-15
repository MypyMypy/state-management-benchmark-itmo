import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { fieldChanged, localErrorsUpdated, globalErrorUpdated, valuesStore, localErrorsStore, globalErrorStore, formPresetApplied, formMetaStore } from '@/entities/form/effector/form';
import { validateLocal, validateGlobal, formProgress } from '@/shared/lib/validation';
import { FormField } from '@/shared/ui/form/FormField';
import { PresetSelector } from '@/shared/ui/presets/PresetSelector';
import { formPresets, FormPreset } from '@/shared/config/presets';
import { usePerf } from '@/shared/lib/usePerf';

export default function EffectorForm() {
  const values = useUnit(valuesStore);
  const localErrors = useUnit(localErrorsStore);
  const globalError = useUnit(globalErrorStore);
  const meta = useUnit(formMetaStore);
  const changeField = useUnit(fieldChanged);
  const updateLocalErrors = useUnit(localErrorsUpdated);
  const updateGlobalError = useUnit(globalErrorUpdated);
  const applyPresetEvent = useUnit(formPresetApplied);
  const [timer, setTimer] = useState<number | null>(null);
  const [presetName, setPresetName] = useState<string | undefined>();

  useEffect(()=> {
    const perf = usePerf(presetName ? `effector:form:${presetName}` : 'effector:form');
    perf.measureBlock('local', () => {
      updateLocalErrors(validateLocal(values));
    });
    if (timer) clearTimeout(timer);
    const t = window.setTimeout(()=> {
      perf.measureBlock('global', () => {
        updateGlobalError(validateGlobal(values));
      });
    }, meta.debounceMs);
    setTimer(t);
  }, [values, updateLocalErrors, updateGlobalError, meta.debounceMs, presetName]);

  const applyPreset = (p: FormPreset) => {
    setPresetName(p.name);
    applyPresetEvent({ fieldsCount: p.fieldsCount, debounceMs: p.debounceMs });
    performance.clearMarks();
    performance.clearMeasures();
  };

  const progress = formProgress(values);

  return (
    <div>
      <h2>Effector S2 Форма {presetName ? `(${presetName})` : ''}</h2>
      <PresetSelector presets={formPresets} current={presetName} onApply={applyPreset} label="Форма" />
      <div style={{display:'flex', flexWrap:'wrap'}}>
        {Object.keys(values).map(field => (
          <FormField
            key={field}
            name={field}
            value={values[field]}
            error={localErrors[field] || undefined}
            onChange={(v)=> changeField({ field, value: v })}
          />
        ))}
      </div>
      <div style={{marginBottom:8, fontSize:12}}>Всего полей: {progress.total}, заполнено: {progress.filled} ({progress.percent}%), задержка: {meta.debounceMs}ms</div>
      {globalError && <div style={{color:'orange'}}>{globalError}</div>}
    </div>
  );
}
