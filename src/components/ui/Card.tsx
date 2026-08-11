/**
 * Card — gaya hitam-putih (design system terpadu).
 */
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  actions?: ReactNode;
}

export default function Card({
  children,
  title,
  subtitle,
  className = '',
  actions,
}: CardProps) {
  return (
    <div className={`rounded-md border-2 border-black bg-white ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b-2 border-black px-4 py-2.5">
          <div className="min-w-0">
            {title && (
              <h3 className="truncate text-[11px] font-bold tracking-wider text-black uppercase">
                {title}
              </h3>
            )}
            {subtitle && <p className="mt-0.5 truncate text-[11px] text-black/50">{subtitle}</p>}
          </div>
          {actions && <div className="ml-3 flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-3">{children}</div>
    </div>
  );
}
