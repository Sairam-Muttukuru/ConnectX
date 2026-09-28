import { useState } from 'react';
import { MoreHorizontal, X, UserPlus, Check, ArrowRight } from 'lucide-react';

export default function DashboardRightSidebar({ isDark, onFindPeople }) {
  // Suggested connections state
  const [suggested, setSuggested] = useState([
    {
      id: 1,
      name: 'Rohit Singh',
      handle: '@rohit_singh',
      headline: 'Java | Spring Boot',
      avatar: '/images/dashboard/user_rohit.png',
      connected: false,
    },
    {
      id: 2,
      name: 'Anjali Verma',
      handle: '@anjali_verma',
      headline: 'Cloud | AWS',
      avatar: '/images/dashboard/user_anjali.png',
      connected: false,
    },
  ]);

  const onlineUsers = [
    {
      name: 'Rahul Kumar',
      role: 'Software Developer',
      avatar: '/images/dashboard/user_rahul.png',
      status: 'online',
    },
    {
      name: 'Neha Iyer',
      role: 'Product Designer',
      avatar: '/images/dashboard/user_neha.png',
      status: 'online',
    },
    {
      name: 'Vishal Reddy',
      role: 'DevOps Engineer',
      avatar: '/images/dashboard/user_vishal.png',
      status: 'online',
    },
    {
      name: 'Kavya S',
      role: 'UI/UX Designer',
      avatar: '/images/dashboard/user_kavya.png',
      status: 'online',
    },
    {
      name: 'Kiran Varma',
      role: 'Backend Developer',
      avatar: '/images/dashboard/user_kiran.png',
      status: 'online',
    },
    {
      name: 'Sneha Reddy',
      role: 'Data Analyst',
      avatar: '/images/dashboard/user_sneha.png',
      status: 'online',
    },
    {
      name: 'Aditya Rao',
      role: 'ML Engineer',
      avatar: '/images/dashboard/user_aditya.png',
      status: 'meeting',
      statusText: 'In a meeting',
    },
    {
      name: 'Meera Nair',
      role: 'Software Engineer',
      avatar: '/images/dashboard/user_meera.png',
      status: 'online',
    },
  ];

  const handleToggleConnect = (id) => {
    setSuggested((prev) =>
      prev.map((u) => (u.id === id ? { ...u, connected: !u.connected } : u))
    );
  };

  const handleDismissSuggested = (id) => {
    setSuggested((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <aside className="w-full space-y-5">
      {/* 1. Featured Promo Card */}
      <div className="rounded-2xl overflow-hidden relative shadow-xs border border-indigo-900/30 group">
        <div className="relative h-44 w-full">
          <img
            src="/images/dashboard/meaningful_banner.jpg"
            alt="Meaningful Conversations"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />

          {/* Banner content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="max-w-[150px]">
                <h3 className="text-sm font-extrabold leading-snug tracking-tight drop-shadow-sm">
                  Meaningful Conversations
                </h3>
                <p className="text-xs font-semibold text-purple-200 mt-0.5 leading-tight">
                  Brighter Opportunities
                </p>
              </div>

              <div className="text-[10px] font-bold text-pink-300 text-right italic font-serif leading-tight">
                Same Interests<br />New Friends<br />Better You
              </div>
            </div>

            <div>
              <button
                onClick={() => onFindPeople && onFindPeople()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-all cursor-pointer hover:gap-2"
              >
                <span>Find People</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Online Now (12) Card */}
      <div
        className={`rounded-2xl p-4 transition-colors ${
          isDark ? 'bg-[#0f1322] border border-white/10' : 'bg-white border border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Online Now (12)
          </h3>
          <button className="text-xs text-purple-500 dark:text-purple-400 hover:underline font-semibold cursor-pointer">
            See all
          </button>
        </div>

        <div className="space-y-2.5">
          {onlineUsers.map((user) => (
            <div
              key={user.name}
              className="flex items-center justify-between group py-0.5 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/dashboard/sai_avatar.png';
                    }}
                  />
                  {user.status === 'meeting' ? (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-[#0f1322]" />
                  ) : (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0f1322]" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate leading-tight group-hover:text-purple-500 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate leading-tight flex items-center gap-1">
                    {user.status === 'meeting' ? (
                      <span className="text-amber-500 font-medium">&bull; In a meeting</span>
                    ) : (
                      <span>{user.role}</span>
                    )}
                  </p>
                </div>
              </div>

              <button
                className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Suggested for you Card */}
      <div
        className={`rounded-2xl p-4 transition-colors ${
          isDark ? 'bg-[#0f1322] border border-white/10' : 'bg-white border border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Suggested for you
          </h3>
          <button className="text-xs text-purple-500 dark:text-purple-400 hover:underline font-semibold cursor-pointer">
            See all
          </button>
        </div>

        <div className="space-y-3">
          {suggested.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-2 py-1"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                  onError={(e) => {
                    e.target.src = '/images/dashboard/sai_avatar.png';
                  }}
                />

                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {user.name}
                  </p>
                  <p className="text-[10px] text-purple-400 font-medium truncate">
                    {user.handle}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user.headline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleConnect(user.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    user.connected
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : 'bg-indigo-50 dark:bg-white/[0.06] text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-white/10 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {user.connected ? 'Pending' : 'Connect'}
                </button>

                <button
                  onClick={() => handleDismissSuggested(user.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {suggested.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">
              No new recommendations right now.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
