import { BarChart3 } from 'lucide-react';

export default function YourStatsCard({ isDark }) {
  const stats = [
    { label: 'Profile views', change: '+28%' },
    { label: 'New connections', change: '+12' },
    { label: 'Post interactions', change: '+56' },
    { label: 'Messages', change: '+18' },
  ];

  return (
    <div
      className={`rounded-2xl p-4 transition-colors ${
        isDark ? 'bg-[#0f1322] border border-white/10' : 'bg-white border border-slate-200/80 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Your Stats
        </h3>
        <BarChart3 className="w-4 h-4 text-indigo-500" />
      </div>

      <div className="space-y-2.5">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {s.label}
            </span>
            <span className="font-bold text-emerald-500 dark:text-emerald-400">
              {s.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
