import { Phone, Video, Calendar } from 'lucide-react';

export default function UpcomingCallsCard({ onJoinCall }) {
  const calls = [
    {
      id: 1,
      name: 'Rohan Deshmukh',
      time: 'Today at 11:30 AM',
      avatar: '/images/dashboard/user_aditya.png',
      isPrimary: true,
      actionText: 'Join',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      time: 'Tomorrow at 04:00 PM',
      avatar: '/images/dashboard/priya_avatar.png',
      isPrimary: false,
      actionText: 'Accept',
    },
    {
      id: 3,
      name: 'Arjun Mehta',
      time: 'Friday at 06:15 PM',
      avatar: '/images/dashboard/arjun_avatar.png',
      isPrimary: false,
      actionText: 'Accept',
    },
  ];

  return (
    <div className="rounded-3xl p-5 bg-white dark:bg-[#0E1330] border border-slate-200/80 dark:border-white/10 shadow-xs">
      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100 dark:border-white/5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Calls</h3>
        <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
          See all
        </button>
      </div>

      <div className="space-y-3">
        {calls.map((call) => (
          <div
            key={call.id}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={call.avatar}
                alt={call.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/15"
                onError={(e) => {
                  e.target.src = '/images/dashboard/user_avatar.jpg';
                }}
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {call.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                  <span>{call.time}</span>
                </p>
              </div>
            </div>

            {call.isPrimary ? (
              <button
                onClick={() => onJoinCall && onJoinCall(call)}
                className="px-4 py-1.5 rounded-xl bg-[#2E5BFF] hover:bg-blue-600 text-white font-bold text-[11px] shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
              >
                Join
              </button>
            ) : (
              <button
                onClick={() => onJoinCall && onJoinCall(call)}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                title="Call Options"
              >
                <Phone className="w-3.5 h-3.5 text-blue-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
