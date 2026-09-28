import { MoreVertical } from 'lucide-react';

export default function DashboardNotificationsCard({ onViewAll, isDark = true }) {
  const notifications = [
    {
      id: 1,
      name: 'Rahul',
      action: 'sent you a friend request',
      time: '2 minutes ago',
      avatar: '/images/dashboard/user_rahul.png',
      unread: true,
    },
    {
      id: 2,
      name: 'Priya',
      action: 'accepted your friend request',
      time: '20 minutes ago',
      avatar: '/images/dashboard/priya_avatar.png',
      unread: true,
    },
    {
      id: 3,
      name: 'Arjun',
      action: 'is now online',
      time: '1 hour ago',
      avatar: '/images/dashboard/arjun_avatar.png',
      unread: true,
    },
  ];

  return (
    <div className={`rounded-3xl p-5 border shadow-xl transition-colors ${
      isDark ? 'bg-[#0B0D19]/90 border-white/[0.08]' : 'bg-white border-slate-200/80 shadow-xs'
    }`}>
      <div className={`flex items-center justify-between mb-3 pb-2 border-b ${
        isDark ? 'border-white/5' : 'border-slate-100'
      }`}>
        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer group ${
              isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.unread && (
                <span className="w-2 h-2 rounded-full bg-[#2E5BFF] shrink-0" />
              )}
              <img
                src={item.avatar}
                alt={item.name}
                className={`w-9 h-9 rounded-full object-cover border shrink-0 ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
                onError={(e) => {
                  e.target.src = '/images/dashboard/user_avatar.jpg';
                }}
              />
              <div className="min-w-0">
                <p className={`text-xs truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.name}</span>{' '}
                  <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.action}</span>
                </p>
                <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.time}
                </span>
              </div>
            </div>

            <button
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
