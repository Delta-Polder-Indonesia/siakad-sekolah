/**
 * SectionTitle — judul seksi (pola border-b + uppercase hitam).
 *
 * Menyeragamkan pola yang muncul 300+ kali di seluruh halaman role dengan
 * variasi kecil (10px vs xs, tracking-wider vs tracking-wide):
 *   <div className="border-b-2 border-black pb-1">
 *     <p className="text-[10px] font-bold tracking-wider text-black uppercase">...
 */
import type { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export default function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <div className={`border-b-2 border-black pb-1 ${className}`}>
      <p className="text-[10px] font-bold tracking-wider text-black uppercase">{children}</p>
    </div>
  );
}
