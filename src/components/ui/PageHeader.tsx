/**
 * PageHeader — header halaman role (guru/murid/orang tua/admin).
 *
 * Menyeragamkan pola yang sebelumnya ditulis manual di setiap dashboard:
 *   <div className="mb-3 flex flex-col justify-between gap-2 border-b-2
 *        border-black pb-3 sm:flex-row sm:items-end">
 *     <h1 className="text-lg leading-none font-bold tracking-tight text-black">
 */
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="mb-3 flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <h1 className="text-lg leading-none font-bold tracking-tight text-black">{title}</h1>
        {subtitle && <div className="mt-1.5 text-xs leading-none font-bold text-black">{subtitle}</div>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2 self-start sm:self-end">{actions}</div>}
    </header>
  );
}
