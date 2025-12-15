import React from 'react';

export interface FormFieldProps {
  name: string;
  value: string | number;
  error?: string;
  type?: string;
  onChange: (value: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({ name, value, error, type='text', onChange }) => {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:4, marginBottom:8, minWidth:220}}>
      <input
        placeholder={name}
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        style={{padding:'6px 8px', border:'1px solid #ccc', borderRadius:4}}
      />
      {error && <span style={{color:'red', fontSize:12}}>{error}</span>}
    </div>
  );
};

export default FormField;
