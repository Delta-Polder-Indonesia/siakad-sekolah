/**
 * Badge — gaya hitam-putih (design system terpadu).
 * Variant sukses/peringatan/danger/info tetap memakai warna untuk
 * menyampaikan makna status (informasi, bukan dekorasi).
 */
import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
  className?: string;
}

const variants: Record<string, string> = {
  default: 'border-black bg-white text-black',
  success: 'border-green-600 bg-green-50 text-green-700',
  warning: 'border-amber-600 bg-amber-50 text-amber-700',
  danger: 'border-red-600 bg-red-50 text-red-700',
  info: 'border-blue-600 bg-blue-50 text-blue-700',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
