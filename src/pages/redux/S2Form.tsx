import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fieldChanged, localErrorsUpdated, globalErrorUpdated, presetApplied } from "@/entities/form/redux/formSlice";
import { validateLocal, validateGlobal, formProgress } from "@/shared/lib/validation";
import { PresetSelector } from "@/shared/ui/presets/PresetSelector";
import { formPresets, FormPreset } from "@/shared/config/presets";
import { FormField } from "@/shared/ui/form/FormField";
import { RootState } from "@/app/providers/store";
import { usePerf } from "@/shared/lib/usePerf";

export default function ReduxForm() {
  const dispatch = useDispatch();
  const { values, localErrors, globalError, fieldCount, debounceMs } = useSelector((s: RootState) => s.form as any);
  const [timer, setTimer] = useState<number | null>(null);
  const [presetName, setPresetName] = useState<string | undefined>();

  useEffect(() => {
    const perf = usePerf(presetName ? `redux:form:${presetName}` : 'redux:form');
    perf.measureBlock('local', () => {
      const local = validateLocal(values);
      dispatch(localErrorsUpdated(local));
    });
    if (timer) clearTimeout(timer);
    const t = window.setTimeout(() => {
      perf.measureBlock('global', () => {
        const g = validateGlobal(values);
        dispatch(globalErrorUpdated(g));
      });
    }, debounceMs);
    setTimer(t);
  }, [values, dispatch, debounceMs, presetName]);

  const applyPreset = (p: FormPreset) => {
    setPresetName(p.name);
    dispatch(presetApplied({ fieldsCount: p.fieldsCount, debounceMs: p.debounceMs }));
    performance.clearMarks();
    performance.clearMeasures();
  };

  const progress = formProgress(values);

  return (
    <div>
      <h2>Redux S2 Форма {presetName ? `(${presetName})` : ''}</h2>
      <PresetSelector presets={formPresets} current={presetName} onApply={applyPreset} label="Форма" />
      <div style={{display:'flex', flexWrap:'wrap'}}>
        {Object.keys(values).map((field) => (
          <FormField
            key={field}
            name={field}
            value={values[field]}
            error={localErrors[field] || undefined}
            onChange={(v) => dispatch(fieldChanged({ field, value: v }))}
          />
        ))}
      </div>
      <div style={{marginBottom:8, fontSize:12}}>Всего полей: {progress.total}, заполнено: {progress.filled} ({progress.percent}%), задержка: {debounceMs}ms</div>
      {globalError && <div style={{ color: "orange" }}>{globalError}</div>}
    </div>
  );
}
