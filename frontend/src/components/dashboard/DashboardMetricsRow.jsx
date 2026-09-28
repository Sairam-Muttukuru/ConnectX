import { MessageSquare, Users, UserPlus, PhoneCall, ArrowRight } from 'lucide-react';

export default function DashboardMetricsRow({ onCardClick, isDark = true }) {
  const stats = [
    {
      id: 'messages',
      title: 'Unread Messages',
      value: '12',
      icon: MessageSquare,
      iconBg: 'bg-blue-600 text-white',
      cardBg: isDark
        ? 'bg-[#0B0D19]/90 border-blue-500/25 hover:border-blue-500/50 text-white shadow-xl shadow-black/40'
        : 'bg-white border-blue-100 hover:border-blue-300 text-slate-800 shadow-xs hover:shadow-md',
      arrowColor: 'text-blue-500',
    },
    {
      id: 'friends',
      title: 'Friends',
      value: '24',
      icon: Users,
      iconBg: 'bg-emerald-600 text-white',
      cardBg: isDark
        ? 'bg-[#0B0D19]/90 border-emerald-500/25 hover:border-emerald-500/50 text-white shadow-xl shadow-black/40'
        : 'bg-white border-emerald-100 hover:border-emerald-300 text-slate-800 shadow-xs hover:shadow-md',
      arrowColor: 'text-emerald-500',
    },
    {
      id: 'requests',
      title: 'Friend Requests',
      value: '3',
      icon: UserPlus,
      iconBg: 'bg-purple-600 text-white',
      cardBg: isDark
        ? 'bg-[#0B0D19]/90 border-purple-500/25 hover:border-purple-500/50 text-white shadow-xl shadow-black/40'
        : 'bg-white border-purple-100 hover:border-purple-300 text-slate-800 shadow-xs hover:shadow-md',
      arrowColor: 'text-purple-500',
    },
    {
      id: 'calls',
      title: 'Recent Calls',
      value: '5',
      icon: PhoneCall,
      iconBg: 'bg-orange-500 text-white',
      cardBg: isDark
        ? 'bg-[#0B0D19]/90 border-orange-500/25 hover:border-orange-500/50 text-white shadow-xl shadow-black/40'
        : 'bg-white border-orange-100 hover:border-orange-300 text-slate-800 shadow-xs hover:shadow-md',
      arrowColor: 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => onCardClick && onCardClick(item.id)}
            className={`rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${item.cardBg}`}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 shadow-md">
              <div className={`w-full h-full rounded-2xl flex items-center justify-center ${item.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {item.value}
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.title}
                </span>
                <ArrowRight className={`w-4 h-4 ${item.arrowColor} transition-transform group-hover:translate-x-1`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
