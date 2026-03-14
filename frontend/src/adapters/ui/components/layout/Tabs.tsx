interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
      {tabs.map((tab) => {
        const active = tab === activeTab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              active
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
