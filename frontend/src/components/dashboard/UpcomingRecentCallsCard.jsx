import { PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';

export default function UpcomingRecentCallsCard({ onViewAll, onSelectCall, isDark = true }) {
  const calls = [
    {
      id: 1,
      name: 'Priya',
      status: 'Incoming call',
      time: 'Today, 07:15 PM',
      type: 'incoming',
      avatar: '/images/dashboard/priya_avatar.png',
    },
    {
      id: 2,
      name: 'Rahul',
      status: 'Outgoing call',
      time: 'Today, 05:42 PM',
      type: 'outgoing',
      avatar: '/images/dashboard/user_rahul.png',
    },
    {
      id: 3,
      name: 'Arjun',
      status: 'Missed call',
      time: 'Yesterday, 09:12 PM',
      type: 'missed',
      avatar: '/images/dashboard/arjun_avatar.png',
    },
    {
      id: 4,
      name: 'Neha',
      status: 'Outgoing call',
      time: 'Yesterday, 04:30 PM',
      type: 'outgoing',
      avatar: '/images/dashboard/user_neha.png',
    },
    {
      id: 5,
      name: 'Karthik',
      status: 'Incoming call',
      time: 'Mon, 11:20 AM',
      type: 'incoming',
      avatar: '/images/dashboard/user_kiran.png',
    },
  ];

  return (
    <div className={`rounded-3xl p-5 border shadow-xl transition-colors ${
      isDark ? 'bg-[#0B0D19]/90 border-white/[0.08]' : 'bg-white border-slate-200/80 shadow-xs'
    }`}>
      <div className={`flex items-center justify-between mb-4 pb-2 border-b ${
        isDark ? 'border-white/5' : 'border-slate-100'
      }`}>
        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Upcoming / Recent Calls</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="space-y-2.5">
        {calls.map((call) => {
          const isMissed = call.type === 'missed';
          const isIncoming = call.type === 'incoming';

          return (
            <div
              key={call.id}
              onClick={() => onSelectCall && onSelectCall(call)}
              className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group ${
                isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={call.avatar}
                  alt={call.name}
                  className={`w-10 h-10 rounded-full object-cover border ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}
                  onError={(e) => {
                    e.target.src = '/images/dashboard/user_avatar.jpg';
                  }}
                />

                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate group-hover:text-blue-500 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {call.name}
                  </h4>
                  <p
                    className={`text-[11px] truncate flex items-center gap-1.5 mt-0.5 ${
                      isMissed
                        ? 'text-rose-500 font-semibold'
                        : isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {isIncoming && <PhoneIncoming className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    {call.type === 'outgoing' && <PhoneOutgoing className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                    {isMissed && <PhoneMissed className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    <span>{call.status}</span>
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                {call.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
