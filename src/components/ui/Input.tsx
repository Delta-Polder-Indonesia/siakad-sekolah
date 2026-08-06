import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-slate-700">{label}</label>}
      <input
        className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 ${error ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'} focus:ring-1 focus:outline-none ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
