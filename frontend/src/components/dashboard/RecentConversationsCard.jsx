import { useState } from 'react';

export default function RecentConversationsCard({ onSelectConversation, onViewAll, isDark = true }) {
  const [conversations] = useState([
    {
      id: 1,
      name: 'Rahul',
      message: 'Hey, are you free tomorrow?',
      time: '10:42 PM',
      unread: 1,
      avatar: '/images/dashboard/user_rahul.png',
      online: true,
    },
    {
      id: 2,
      name: 'Priya',
      message: 'See you at the meetup! 😃',
      time: '09:30 PM',
      unread: 0,
      avatar: '/images/dashboard/priya_avatar.png',
      online: true,
    },
    {
      id: 3,
      name: 'Arjun',
      message: '📷 Sent an image',
      time: 'Yesterday',
      unread: 0,
      avatar: '/images/dashboard/arjun_avatar.png',
      online: true,
    },
    {
      id: 4,
      name: 'Neha',
      message: "That's awesome! 🎉",
      time: 'Yesterday',
      unread: 0,
      avatar: '/images/dashboard/user_neha.png',
      online: true,
    },
    {
      id: 5,
      name: 'Karthik',
      message: "Let's catch up soon.",
      time: 'Mon',
      unread: 0,
      avatar: '/images/dashboard/user_kiran.png',
      online: false,
    },
  ]);

  return (
    <div className={`rounded-3xl p-5 border shadow-xl transition-colors ${
      isDark ? 'bg-[#0B0D19]/90 border-white/[0.08]' : 'bg-white border-slate-200/80 shadow-xs'
    }`}>
      <div className={`flex items-center justify-between mb-4 pb-2 border-b ${
        isDark ? 'border-white/5' : 'border-slate-100'
      }`}>
        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Conversations</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="space-y-2.5">
        {conversations.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectConversation && onSelectConversation(item)}
            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group ${
              isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className={`w-10 h-10 rounded-full object-cover border ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}
                  onError={(e) => {
                    e.target.src = '/images/dashboard/user_avatar.jpg';
                  }}
                />
                {item.online && (
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ${
                    isDark ? 'ring-[#0B0D19]' : 'ring-white'
                  }`} />
                )}
              </div>

              <div className="min-w-0">
                <h4 className={`text-xs font-bold truncate group-hover:text-blue-500 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.name}
                </h4>
                <p className={`text-[11px] truncate max-w-[170px] sm:max-w-[210px] mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {item.message}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
              <span className={`text-[10px] font-medium whitespace-nowrap ${
                isDark ? 'text-slate-400' : 'text-slate-400'
              }`}>
                {item.time}
              </span>
              {item.unread > 0 ? (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {item.unread}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
