import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { mobxFormStore } from '@/entities/form/mobx/formStore';
import { validateLocal, validateGlobal, formProgress } from '@/shared/lib/validation';
import { PresetSelector } from '@/shared/ui/presets/PresetSelector';
import { formPresets, FormPreset } from '@/shared/config/presets';
import { FormField } from '@/shared/ui/form/FormField';
import { usePerf } from '@/shared/lib/usePerf';

const MobxForm = observer(()=> {
  const [timer, setTimer] = useState<number | null>(null);
  const [presetName, setPresetName] = useState<string | undefined>();
  useEffect(()=> {
    const perf = usePerf(presetName ? `mobx:form:${presetName}` : 'mobx:form');
    perf.measureBlock('local', () => {
      mobxFormStore.setLocalErrors(validateLocal(mobxFormStore.values));
    });
    if (timer) clearTimeout(timer);
    const t = window.setTimeout(()=> {
      perf.measureBlock('global', () => {
        mobxFormStore.setGlobalError(validateGlobal(mobxFormStore.values));
      });
    }, mobxFormStore.debounceMs);
    setTimer(t);
  }, [Object.values(mobxFormStore.values).join('|'), mobxFormStore.debounceMs, presetName]);

  const applyPreset = (p: FormPreset) => {
    setPresetName(p.name);
    mobxFormStore.applyPreset(p.fieldsCount, p.debounceMs);
    performance.clearMarks();
    performance.clearMeasures();
  };

  const progress = formProgress(mobxFormStore.values);
  return (
    <div>
      <h2>MobX S2 Форма {presetName ? `(${presetName})` : ''}</h2>
      <PresetSelector presets={formPresets} current={presetName} onApply={applyPreset} label="Форма" />
      <div style={{display:'flex', flexWrap:'wrap'}}>
        {Object.keys(mobxFormStore.values).map(field => (
          <FormField
            key={field}
            name={field}
            value={mobxFormStore.values[field]}
            error={mobxFormStore.localErrors[field] || undefined}
            onChange={(v)=> mobxFormStore.setField(field as any, v)}
          />
        ))}
      </div>
      <div style={{marginBottom:8, fontSize:12}}>Всего полей: {progress.total}, заполнено: {progress.filled} ({progress.percent}%), задержка: {mobxFormStore.debounceMs}ms</div>
      {mobxFormStore.globalError && <div style={{color:'orange'}}>{mobxFormStore.globalError}</div>}
    </div>
  );
});
export default MobxForm;
