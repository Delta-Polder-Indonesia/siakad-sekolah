import { type LucideIcon } from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onAction: (id: string) => void;
  className?: string;
  title?: string;
}

export default function QuickActions({
  actions,
  onAction,
  className = '',
  title = 'Aksi Cepat',
}: QuickActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="mb-2 border-b-2 border-black pb-1.5 text-xs font-bold tracking-wider text-black uppercase">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onAction(action.id)}
              className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-3 py-2.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100 focus:outline-none"
            >
              <Icon className="h-4 w-4 shrink-0 text-black" />
              <span className="truncate">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
