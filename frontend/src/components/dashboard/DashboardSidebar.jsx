import { useState, useEffect } from 'react';
import { authStorage } from '../../utils/authStorage';
import {
  Home,
  MessageSquare,
  PhoneCall,
  Users,
  UserPlus,
  Star,
  Bell,
  User,
  Settings,
  MoreHorizontal,
  LogOut,
} from 'lucide-react';

const SIDEBAR_ACCENT_MAP = {
  purple: {
    active: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold',
    heart: '💙',
    logoText: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
    border: 'border-purple-500/30',
    avatarBorder: 'border-purple-400',
  },
  blue: {
    active: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold',
    heart: '💙',
    logoText: 'bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400',
    border: 'border-blue-500/30',
    avatarBorder: 'border-blue-400',
  },
  emerald: {
    active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold',
    heart: '💚',
    logoText: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400',
    border: 'border-emerald-500/30',
    avatarBorder: 'border-emerald-400',
  },
  rose: {
    active: 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold',
    heart: '💖',
    logoText: 'bg-gradient-to-r from-rose-400 via-pink-400 to-red-400',
    border: 'border-rose-500/30',
    avatarBorder: 'border-rose-400',
  },
  amber: {
    active: 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 font-bold',
    heart: '🧡',
    logoText: 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400',
    border: 'border-amber-500/30',
    avatarBorder: 'border-amber-400',
  },
};

export default function DashboardSidebar({ activeTab = 'Home', setActiveTab, onNavigate, user, onLogout, isDark = true, accentColor = 'purple', metrics = {} }) {
  const currentAccent = SIDEBAR_ACCENT_MAP[accentColor] || SIDEBAR_ACCENT_MAP.purple;
  const menuItems = [
    { id: 'Home', label: 'Home', icon: Home, badge: null },
    {
      id: 'Messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: metrics?.unreadMessagesCount > 0 ? String(metrics.unreadMessagesCount) : null,
      badgeColor: 'bg-[#FF3868]'
    },
    { id: 'Calls', label: 'Calls', icon: PhoneCall, badge: null },
    { id: 'Contacts', label: 'Contacts / Friends', icon: Users, badge: null },
    {
      id: 'Requests',
      label: 'Friend Requests',
      icon: UserPlus,
      badge: metrics?.friendRequestsCount > 0 ? String(metrics.friendRequestsCount) : null,
      badgeColor: 'bg-[#FF3868]'
    },
    { id: 'Favorites', label: 'Favorites', icon: Star, badge: null },
    {
      id: 'Notifications',
      label: 'Notifications',
      icon: Bell,
      badge: metrics?.notificationsCount > 0 ? String(metrics.notificationsCount) : null,
      badgeColor: 'bg-[#FF3868]'
    },
    { id: 'Profile', label: 'Profile', icon: User, badge: null },
    { id: 'Settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const [currentAvatar, setCurrentAvatar] = useState(() => {
    return user?.avatarUrl || authStorage.getUser()?.avatarUrl || '/images/boy_1.jpg';
  });

  const [currentDisplayName, setCurrentDisplayName] = useState(() => {
    return user?.displayName || user?.username || authStorage.getUser()?.displayName || 'sairam_developer';
  });

  useEffect(() => {
    if (user?.avatarUrl) {
      setCurrentAvatar(user.avatarUrl);
    }
    if (user?.displayName || user?.username) {
      setCurrentDisplayName(user?.displayName || user?.username);
    }
  }, [user?.avatarUrl, user?.displayName, user?.username]);

  useEffect(() => {
    const handleProfileUpdated = (e) => {
      if (e?.detail?.avatarUrl) {
        setCurrentAvatar(e.detail.avatarUrl);
      }
      if (e?.detail?.displayName) {
        setCurrentDisplayName(e.detail.displayName);
      }
    };
    window.addEventListener('connectx_profile_updated', handleProfileUpdated);
    return () => window.removeEventListener('connectx_profile_updated', handleProfileUpdated);
  }, []);

  const displayName = currentDisplayName;
  const displayHandle = `@${user?.username || 'sairam_developer'}`;
  const avatarImage = currentAvatar;

  return (
    <aside
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      className={`w-64 h-full flex flex-col justify-between p-5 border-r select-none transition-colors duration-200 overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden ${
      isDark ? 'bg-[#080A14] text-white border-white/[0.08]' : 'bg-white text-slate-800 border-slate-200/80 shadow-xs'
    }`}>
      {/* Brand Header */}
      <div>
        <div
          className="flex items-center gap-3 px-2 py-2 mb-6 cursor-pointer group"
          onClick={() => setActiveTab ? setActiveTab('Home') : onNavigate && onNavigate('home')}
        >
          {/* Official Landing Page ConnectX Logo Icon */}
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/connectx_logo.png"
              alt="ConnectX Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(168,85,247,0.55)]"
            />
          </div>
          <div>
            <span className={`text-xl font-extrabold tracking-tight flex items-center ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Connect<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">X</span>
            </span>
            <p className={`text-xs tracking-wide ${isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-bold'}`}>
              People Closer, Always
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? currentAccent.active
                    : isDark
                    ? 'text-slate-200 font-semibold hover:text-white hover:bg-white/[0.08]'
                    : 'text-black font-bold hover:text-black hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : isDark ? 'text-slate-300' : 'text-black'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Promo Card + User Status Card + Dedicated Logout Button */}
      <div className="space-y-2 pt-4">
        {/* Starry Dusk Tagline Card matching Image 1 & Image 3 */}
        <div className={`relative rounded-2xl overflow-hidden p-3.5 border shadow-lg bg-[#0C0E24] ${currentAccent.border}`}>
          <img
            src="/images/dashboard/cover_clean.jpg"
            alt="Dusk Landscape"
            className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125"
            onError={(e) => {
              e.target.src = '/images/dashboard/profile_cover_banner.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E24] via-[#0C0E24]/50 to-purple-950/40" />

          <div className="relative z-10 space-y-1">
            <div
              style={{ fontFamily: "'Caveat', 'Dancing Script', cursive, sans-serif" }}
              className="text-white font-bold text-base leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] select-none pt-2"
            >
              <p className="text-lg">Real</p>
              <p className="text-lg">Connections</p>
              <p className="flex items-center gap-1 text-lg">
                <span>No Phone Numbers</span>
                <span>{currentAccent.heart}</span>
              </p>
            </div>
          </div>
        </div>

        {/* User Mini Card */}
        <div
          onClick={() => setActiveTab && setActiveTab('Profile')}
          className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer group ${
            isDark
              ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={avatarImage}
                alt={displayName}
                className={`w-10 h-10 rounded-full object-cover border ${currentAccent.avatarBorder}`}
                onError={(e) => {
                  e.target.src = '/images/boy_1.jpg';
                }}
              />
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ${
                isDark ? 'ring-[#080A14]' : 'ring-white'
              }`} />
            </div>

            <div className="min-w-0">
              <h5
                className="text-sm font-black truncate group-hover:text-blue-500 transition-colors"
                style={{ color: isDark ? '#ffffff' : '#000000' }}
              >
                {displayName}
              </h5>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-500 font-bold">Online</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab && setActiveTab('Settings');
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-white hover:text-white hover:bg-white/10' : 'text-black hover:text-black hover:bg-slate-200'
            }`}
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Dedicated Logout Button matching screenshot */}
        <button
          onClick={onLogout}
          className={`w-full py-2.5 px-4 rounded-2xl border text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isDark
              ? 'bg-white/[0.06] hover:bg-rose-500/20 text-white hover:text-rose-400 border-white/10 font-bold'
              : 'bg-slate-50 hover:bg-rose-50 text-black font-bold hover:text-rose-600 border-slate-300'
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
