/**
 * Button — gaya hitam-putih (design system terpadu, tanpa animasi/emoji).
 * Sebelumnya bergaya slate/blue sehingga tidak pernah dipakai halaman
 * (halaman menulis markup sendiri). Kini disamakan dengan gaya aplikasi.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-bold disabled:opacity-40 disabled:pointer-events-none';

const variants: Record<string, string> = {
  primary: 'border-2 border-black bg-black text-white hover:bg-neutral-800',
  secondary: 'border-2 border-black bg-white text-black hover:bg-neutral-100',
  ghost: 'border-2 border-transparent text-black hover:bg-neutral-100',
  danger: 'border-2 border-red-600 bg-red-600 text-white hover:bg-red-700',
};

const sizes: Record<string, string> = {
  sm: 'px-2.5 py-1 text-[11px] rounded-md',
  md: 'px-4 py-2 text-xs rounded-md',
  lg: 'px-6 py-2.5 text-sm rounded-md',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
