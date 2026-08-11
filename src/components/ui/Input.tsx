/**
 * Input — gaya hitam-putih (design system terpadu).
 */
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-md border-2 border-black bg-white px-3 py-2 text-xs text-black outline-none placeholder:text-black/40 ${
          error ? 'border-red-600' : 'focus:bg-neutral-50'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] font-bold text-red-600">{error}</p>}
    </div>
  );
}
