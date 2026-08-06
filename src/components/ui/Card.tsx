import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  actions?: ReactNode;
  hover?: boolean;
}

export default function Card({
  children,
  title,
  subtitle,
  className = '',
  actions,
  hover = false,
}: CardProps) {
  return (
    <div
      className={`rounded-md border border-slate-200 bg-white shadow-sm transition-all duration-200 ${
        hover ? 'cursor-pointer hover:border-slate-300 hover:shadow-md' : ''
      } ${className}`}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            {title && <h3 className="truncate text-sm font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p>}
          </div>
          {actions && <div className="ml-3 flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
