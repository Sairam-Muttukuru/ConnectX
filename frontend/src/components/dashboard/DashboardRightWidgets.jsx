import { useState } from 'react';
import { MoreVertical, ArrowRight } from 'lucide-react';

export default function DashboardRightWidgets({ onNavigateTab, isDark = true }) {
  // Online friends list
  const onlineFriends = [
    { id: 1, name: 'Rahul', handle: '@rahul123', avatar: '/images/dashboard/user_rahul.png' },
    { id: 2, name: 'Priya', handle: '@priya_s', avatar: '/images/dashboard/priya_avatar.png' },
    { id: 3, name: 'Arjun', handle: '@arjun_dev', avatar: '/images/dashboard/arjun_avatar.png' },
    { id: 4, name: 'Neha', handle: '@neha_k', avatar: '/images/dashboard/user_neha.png' },
    { id: 5, name: 'Vikram', handle: '@vikram_21', avatar: '/images/dashboard/user_aditya.png' },
  ];

  // Friend requests list with accept/reject state
  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: 'Ananya', handle: '@ananya_', avatar: '/images/dashboard/user_anjali.png' },
    { id: 2, name: 'Rohan', handle: '@rohan_fit', avatar: '/images/dashboard/user_rohit.png' },
    { id: 3, name: 'Isha', handle: '@isha_artist', avatar: '/images/dashboard/user_sneha.png' },
  ]);

  const handleAction = (id) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <aside className="w-full space-y-4">
      {/* 1. Online Friends Widget */}
      <div className={`rounded-3xl p-5 border shadow-xl transition-colors ${
        isDark ? 'bg-[#0B0D19]/90 border-white/[0.08]' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className={`flex items-center justify-between mb-3.5 pb-2 border-b ${
          isDark ? 'border-white/5' : 'border-slate-100'
        }`}>
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Online Friends</h3>
          <button
            onClick={() => onNavigateTab && onNavigateTab('Contacts')}
            className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="space-y-2">
          {onlineFriends.map((f) => (
            <div
              key={f.id}
              onClick={() => onNavigateTab && onNavigateTab('Messages')}
              className={`flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer group ${
                isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className={`w-9 h-9 rounded-full object-cover border ${
                      isDark ? 'border-white/10' : 'border-slate-200'
                    }`}
                    onError={(e) => {
                      e.target.src = '/images/dashboard/user_avatar.jpg';
                    }}
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ${
                    isDark ? 'ring-[#0B0D19]' : 'ring-white'
                  }`} />
                </div>

                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate group-hover:text-blue-400 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {f.name}
                  </h4>
                  <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {f.handle}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => e.stopPropagation()}
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

      {/* 2. Friend Requests Widget */}
      <div className={`rounded-3xl p-5 border shadow-xl transition-colors ${
        isDark ? 'bg-[#0B0D19]/90 border-white/[0.08]' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className={`flex items-center justify-between mb-3.5 pb-2 border-b ${
          isDark ? 'border-white/5' : 'border-slate-100'
        }`}>
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Friend Requests</h3>
          <button
            onClick={() => onNavigateTab && onNavigateTab('Requests')}
            className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="space-y-2.5">
          {friendRequests.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-2">No pending requests</p>
          ) : (
            friendRequests.map((r) => (
              <div
                key={r.id}
                className={`flex items-center justify-between p-2 rounded-2xl transition-all ${
                  isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className={`w-9 h-9 rounded-full object-cover border shrink-0 ${
                      isDark ? 'border-white/10' : 'border-slate-200'
                    }`}
                    onError={(e) => {
                      e.target.src = '/images/dashboard/user_avatar.jpg';
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{r.name}</h4>
                    <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{r.handle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button
                    onClick={() => handleAction(r.id)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(r.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-[11px] cursor-pointer transition-colors ${
                      isDark ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Stay Connected Everywhere Promo Card */}
      <div className={`rounded-3xl p-5 border shadow-xl relative overflow-hidden transition-all ${
        isDark
          ? 'bg-gradient-to-br from-[#120E2E] via-[#0E0C22] to-[#070814] border-purple-500/20 text-white shadow-purple-950/30'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border-blue-100 text-slate-900 shadow-xs'
      }`}>
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Stay Connected<br />Everywhere
          </h4>
          <p className={`text-[11px] leading-relaxed max-w-[200px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Chat, call, share and build real relationships.
          </p>

          <div className="py-2 flex justify-center">
            <img
              src="/images/dashboard/grow_network.png"
              alt="Stay Connected"
              className="w-24 h-24 object-contain filter drop-shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('Contacts')}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-lg shadow-purple-600/25'
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-xs'
            }`}
          >
            <span>Explore More</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </aside>
  );
}
