import type { TabKontenDef } from './tugasKonten';

interface TabBarTugasProps {
  tabs: TabKontenDef[];
  activeTab: string;
  onSelect: (id: string) => void;
}

export default function TabBarTugas({ tabs, activeTab, onSelect }: TabBarTugasProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border-2 bg-white px-4 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100 focus:outline-none ${
              isActive ? 'border-black bg-black text-white' : 'border-black'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-black" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
