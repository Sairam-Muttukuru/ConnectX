import { MessageSquare, Search, UserPlus, PhoneCall, Users } from 'lucide-react';

export default function QuickActionsBar({ onAction, isDark = true }) {
  const actions = [
    { id: 'new-message', label: 'New Message', icon: MessageSquare },
    { id: 'find-people', label: 'Find People', icon: Search },
    { id: 'add-friend', label: 'Add Friend', icon: UserPlus },
    { id: 'start-call', label: 'Start Call', icon: PhoneCall },
    { id: 'create-group', label: 'Create Group', icon: Users },
  ];

  return (
    <div className={`rounded-3xl p-5 border shadow-xl transition-colors ${
      isDark ? 'bg-[#0B0D19]/90 border-white/[0.08]' : 'bg-white border-slate-200/80 shadow-xs'
    }`}>
      <h3 className={`text-sm font-bold mb-3.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h3>

      <div className="grid grid-cols-5 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onAction && onAction(act.id)}
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group ${
                isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all ${
                isDark ? 'text-slate-300 group-hover:text-purple-400' : 'text-slate-600 group-hover:text-blue-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-semibold text-center truncate w-full transition-colors ${
                isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
              }`}>
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
