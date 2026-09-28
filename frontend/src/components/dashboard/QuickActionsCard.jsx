import { MessageSquare, Users, PhoneCall, Video } from 'lucide-react';

export default function QuickActionsCard({ onActionClick }) {
  const actions = [
    {
      id: 'start-call',
      title: 'Start a Call',
      icon: MessageSquare,
      bgColor: 'bg-blue-50 hover:bg-blue-100/70 dark:bg-blue-500/10 dark:hover:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'join-rooms',
      title: 'Join Rooms',
      icon: Users,
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/70 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'schedule-meeting',
      title: 'Schedule Call',
      icon: PhoneCall,
      bgColor: 'bg-rose-50 hover:bg-rose-100/70 dark:bg-rose-500/10 dark:hover:bg-rose-500/20',
      iconColor: 'text-rose-500 dark:text-rose-400',
    },
    {
      id: 'new-group',
      title: 'New Group',
      icon: Video,
      bgColor: 'bg-purple-50 hover:bg-purple-100/70 dark:bg-purple-500/10 dark:hover:bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="rounded-3xl p-5 bg-white dark:bg-[#0E1330] border border-slate-200/80 dark:border-white/10 shadow-xs">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick && onActionClick(act.id)}
              className={`p-3 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer ${act.bgColor}`}
            >
              <div className={`p-1.5 rounded-xl bg-white dark:bg-white/10 ${act.iconColor} shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {act.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
