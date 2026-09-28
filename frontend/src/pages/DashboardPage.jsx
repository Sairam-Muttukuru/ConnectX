import { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardGreetingBanner from '../components/dashboard/DashboardGreetingBanner';
import DashboardMetricsRow from '../components/dashboard/DashboardMetricsRow';
import RecentConversationsCard from '../components/dashboard/RecentConversationsCard';
import UpcomingRecentCallsCard from '../components/dashboard/UpcomingRecentCallsCard';
import QuickActionsBar from '../components/dashboard/QuickActionsBar';
import DashboardNotificationsCard from '../components/dashboard/DashboardNotificationsCard';
import DashboardRightWidgets from '../components/dashboard/DashboardRightWidgets';

// Dedicated section views
import HomeView from '../components/dashboard/home/HomeView';
import MessagesView from '../components/dashboard/messages/MessagesView';
import ContactsView from '../components/dashboard/contacts/ContactsView';
import FriendRequestsView from '../components/dashboard/requests/FriendRequestsView';
import FavoritesView from '../components/dashboard/favorites/FavoritesView';
import CallsView from '../components/dashboard/calls/CallsView';
import NotificationsView from '../components/dashboard/notifications/NotificationsView';
import ProfileView from '../components/dashboard/profile/ProfileView';
import SettingsView from '../components/dashboard/settings/SettingsView';
import dashboardService from '../services/dashboardService';
import { authStorage } from '../utils/authStorage';
import { useToast } from '../context/ToastContext';

import { Search, Bell, MessageSquare, Sun, Moon, LogOut, ChevronDown, CheckCircle2, AlertCircle, X, UserPlus, Send, ExternalLink } from 'lucide-react';

const TAB_TO_HASH = {
  Home: '#dashboard/home',
  Messages: '#dashboard/messages',
  Calls: '#dashboard/calls',
  Contacts: '#dashboard/contacts',
  Requests: '#dashboard/requests',
  Favorites: '#dashboard/favorites',
  Notifications: '#dashboard/notifications',
  Profile: '#dashboard/profile',
  Settings: '#dashboard/settings',
};

const getTabFromHash = (hash) => {
  const clean = (hash || window.location.hash || '').toLowerCase();
  if (clean.includes('/settings')) return 'Settings';
  if (clean.includes('/profile')) return 'Profile';
  if (clean.includes('/favorites') || clean.includes('/fav')) return 'Favorites';
  if (clean.includes('/requests') || clean.includes('/friend-requests')) return 'Requests';
  if (clean.includes('/contacts') || clean.includes('/friends')) return 'Contacts';
  if (clean.includes('/calls')) return 'Calls';
  if (clean.includes('/messages') || clean.includes('/chat')) return 'Messages';
  if (clean.includes('/notifications')) return 'Notifications';
  return 'Home';
};

export default function DashboardPage({ onNavigate, isDark = true, toggleTheme }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTabState] = useState(() => getTabFromHash(window.location.hash));

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const targetHash = TAB_TO_HASH[tab] || '#dashboard/home';
    if (window.location.hash.toLowerCase() !== targetHash.toLowerCase()) {
      window.location.hash = targetHash;
    }
  };

  useEffect(() => {
    const currentHash = window.location.hash.toLowerCase();
    if (!currentHash || currentHash === '#dashboard' || currentHash === '#dashboard/') {
      window.location.hash = TAB_TO_HASH[activeTab] || '#dashboard/home';
    }

    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#dashboard')) {
        const tab = getTabFromHash(hash);
        setActiveTabState(tab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Clear navbar search whenever switching tabs or mounting
  const searchInputRef = useRef(null);

  useEffect(() => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    // Safeguard against delayed browser autofill when opening settings
    const timer1 = setTimeout(() => {
      if (searchInputRef.current && (document.activeElement !== searchInputRef.current || (user?.email && searchInputRef.current.value.toLowerCase() === user.email.toLowerCase()))) {
        searchInputRef.current.value = '';
        setSearchQuery('');
        setShowSearchDropdown(false);
      }
    }, 80);
    const timer2 = setTimeout(() => {
      if (searchInputRef.current && (document.activeElement !== searchInputRef.current || (user?.email && searchInputRef.current.value.toLowerCase() === user.email.toLowerCase()))) {
        searchInputRef.current.value = '';
        setSearchQuery('');
        setShowSearchDropdown(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeTab, user?.email]);

  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('connectx_accent') || 'purple');
  const [metrics, setMetrics] = useState({
    unreadMessagesCount: 0,
    friendsCount: 0,
    friendRequestsCount: 0,
    notificationsCount: 0,
  });
  const mainContentRef = useRef(null);
  const searchContainerRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadMetrics = async () => {
    try {
      const res = await dashboardService.getDashboardMetrics();
      const data = res?.data || res;
      if (data) {
        setMetrics({
          unreadMessagesCount: data.unreadMessagesCount ?? 0,
          friendsCount: data.friendsCount ?? 0,
          friendRequestsCount: data.friendRequestsCount ?? 0,
          notificationsCount: data.notificationsCount ?? 0,
        });
      }
    } catch (err) {
      console.warn('Failed to load metrics:', err);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [activeTab]);

  useEffect(() => {
    const handleRefresh = () => loadMetrics();
    window.addEventListener('connectx_refresh_metrics', handleRefresh);
    return () => window.removeEventListener('connectx_refresh_metrics', handleRefresh);
  }, []);

  // Handle Search Input - queries PostgreSQL directly
  const handleSearchChange = async (val) => {
    // If the change came from browser autofill (not actively focused by user) or matches logged-in user email, discard it
    const isUserFocused = document.activeElement === searchInputRef.current;
    const isAutofilledEmail = user?.email && val.toLowerCase().trim() === user.email.toLowerCase().trim();

    if (!isUserFocused || isAutofilledEmail) {
      setSearchQuery('');
      setShowSearchDropdown(false);
      setSearchResults([]);
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
      return;
    }

    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setShowSearchDropdown(true);
    setIsSearching(true);

    try {
      const res = await dashboardService.searchUsers(val);
      const list = res?.data || res || [];
      setSearchResults(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('User search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendFriendRequest = async (targetUser) => {
    showToast(`Friend request sent to @${targetUser.username}!`);
    setShowSearchDropdown(false);
    setSearchQuery('');
    try {
      await dashboardService.sendFriendRequest(targetUser.id);
      loadMetrics();
    } catch (err) {
      console.error('Send friend request error:', err);
    }
  };

  const handleAccentChange = (newAccent) => {
    setAccentColor(newAccent);
    localStorage.setItem('connectx_accent', newAccent);
  };

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('login');
  };

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
  const avatarImage = currentAvatar;

  return (
    <div className={`h-screen w-full flex transition-colors duration-200 relative overflow-hidden ${
      isDark ? 'bg-[#06080F] text-white dark-theme' : 'bg-[#F2F5FB] text-black light-theme'
    }`}>
      {/* Ambient Lighting Gradients matching active accent */}
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-[150px] rounded-full transition-all duration-500 ${
            accentColor === 'emerald' ? 'bg-gradient-to-tr from-emerald-700/15 via-teal-600/10 to-green-500/10' :
            accentColor === 'amber' ? 'bg-gradient-to-tr from-amber-700/15 via-orange-600/10 to-yellow-500/10' :
            accentColor === 'rose' ? 'bg-gradient-to-tr from-rose-700/15 via-pink-600/10 to-red-500/10' :
            accentColor === 'blue' ? 'bg-gradient-to-tr from-blue-700/15 via-cyan-600/10 to-indigo-500/10' :
            'bg-gradient-to-tr from-purple-700/15 via-indigo-600/10 to-blue-500/10'
          }`} />
          <div className={`absolute top-1/4 -right-36 w-[500px] h-[500px] blur-[130px] rounded-full transition-all duration-500 ${
            accentColor === 'emerald' ? 'bg-emerald-600/10' :
            accentColor === 'amber' ? 'bg-amber-600/10' :
            accentColor === 'rose' ? 'bg-rose-600/10' :
            accentColor === 'blue' ? 'bg-blue-600/10' : 'bg-purple-600/10'
          }`} />
        </div>
      )}

      {/* 1. Left Sidebar (Completely fixed to viewport, never scrolls) */}
      <div className="hidden lg:block shrink-0 h-screen z-40">
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigate={onNavigate}
          user={user}
          onLogout={handleLogout}
          isDark={isDark}
          accentColor={accentColor}
          metrics={metrics}
        />
      </div>

      {/* 2. Main Content Area (Only this container scrolls!) */}
      <div ref={mainContentRef} className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden">
        {/* Top Navbar (hidden on Messages view to give chat full height matching Image 1) */}
        {activeTab !== 'Messages' && (
        <header className={`w-full px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 border-b backdrop-blur-xl sticky top-0 z-30 transition-colors duration-200 ${
          isDark
            ? 'border-white/[0.08] bg-[#080A14]/85 text-white'
            : 'border-slate-200/90 bg-white/95 text-black shadow-xs'
        }`}>
          {/* Mobile Brand Logo */}
          <div
            onClick={() => setActiveTab('Home')}
            className="flex items-center gap-2 lg:hidden shrink-0 cursor-pointer"
          >
            <img
              src="/images/connectx_logo.png"
              alt="ConnectX"
              className="w-7 h-7 object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
            />
            <span className="font-extrabold text-sm tracking-tight text-black dark:text-white">
              Connect<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">X</span>
            </span>
          </div>

          {/* Search Bar matching screenshot */}
          <form role="search" onSubmit={(e) => e.preventDefault()} autoComplete="off" ref={searchContainerRef} className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: isDark ? '#ffffff' : '#000000' }}
              />
              <input
                ref={searchInputRef}
                id="connectx-navbar-search"
                name="connectx-search-filter"
                type="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                aria-autocomplete="none"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                placeholder="Search people by username..."
                style={{ color: isDark ? '#ffffff' : '#000000' }}
                className={`w-full pl-11 pr-10 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all focus:outline-none ${
                  isDark
                    ? `bg-white/[0.06] border border-white/10 text-white placeholder-white/60 focus:bg-white/[0.08] ${
                        accentColor === 'emerald' ? 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' :
                        accentColor === 'amber' ? 'focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20' :
                        accentColor === 'rose' ? 'focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' :
                        accentColor === 'blue' ? 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' :
                        'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                      }`
                    : `bg-white border border-slate-300 text-black placeholder:text-slate-600 focus:bg-white shadow-xs ${
                        accentColor === 'emerald' ? 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' :
                        accentColor === 'amber' ? 'focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20' :
                        accentColor === 'rose' ? 'focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' :
                        accentColor === 'blue' ? 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' :
                        'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                      }`
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Floating Search Results Dropdown */}
            {showSearchDropdown && searchQuery.trim() && (
              <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl p-2 border shadow-2xl z-50 text-xs backdrop-blur-2xl max-h-80 overflow-y-auto ${
                isDark ? 'bg-[#0B0F22]/95 border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]' : 'bg-white border-slate-200 text-black shadow-2xl'
              }`}>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 font-semibold">
                    No users found matching "{searchQuery}"
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.06]">
                    {searchResults.map((usr) => (
                      <div key={usr.id} className="p-2.5 flex items-center justify-between gap-3 hover:bg-white/5 rounded-xl transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={usr.avatarUrl || '/images/dashboard/user_avatar.jpg'}
                            alt={usr.displayName}
                            className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                            onError={(e) => {
                              e.target.src = '/images/dashboard/user_avatar.jpg';
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs truncate">{usr.displayName}</h4>
                            <p className="text-[10px] text-slate-400 truncate">@{usr.username}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                              setActiveTab('Messages');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Message</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendFriendRequest(usr)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isDark ? 'border-white/10 hover:bg-white/10 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-black'
                            }`}
                            title="Add Friend"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Right Icons & User Chip */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Theme Toggle Button */}
            {toggleTheme && (
              <button
                id="dashboard-theme-toggle"
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all cursor-pointer group ${
                  isDark
                    ? 'text-white hover:text-white hover:bg-white/[0.08]'
                    : 'text-black hover:text-black hover:bg-slate-100'
                }`}
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600 group-hover:-rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                )}
              </button>
            )}

            {/* Notification Bell with Dynamic Real Badge */}
            <button
              onClick={() => setActiveTab('Notifications')}
              className={`relative p-2.5 rounded-2xl transition-colors cursor-pointer ${
                activeTab === 'Notifications'
                  ? 'bg-rose-500/20 text-rose-500'
                  : isDark
                  ? 'bg-white/[0.06] text-white hover:bg-white/10 border border-white/10'
                  : 'bg-white text-black hover:bg-slate-100 border border-slate-300 shadow-xs'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" style={{ color: isDark ? '#ffffff' : '#000000' }} />
              {metrics.notificationsCount > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#FF3868] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ${
                  isDark ? 'ring-[#080A14]' : 'ring-white'
                }`}>
                  {metrics.notificationsCount}
                </span>
              )}
            </button>

            {/* Chat Bubble with Dynamic Real Badge */}
            <button
              onClick={() => setActiveTab('Messages')}
              className={`relative p-2.5 rounded-2xl transition-colors cursor-pointer ${
                activeTab === 'Messages'
                  ? accentColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                    accentColor === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                    accentColor === 'rose' ? 'bg-rose-500/20 text-rose-400' :
                    accentColor === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  : isDark
                  ? 'bg-white/[0.06] text-white hover:bg-white/10 border border-white/10'
                  : 'bg-white text-black hover:bg-slate-100 border border-slate-300 shadow-xs'
              }`}
              title="Messages"
            >
              <MessageSquare className="w-4 h-4" style={{ color: isDark ? '#ffffff' : '#000000' }} />
              {metrics.unreadMessagesCount > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#FF3868] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ${
                  isDark ? 'ring-[#080A14]' : 'ring-white'
                }`}>
                  {metrics.unreadMessagesCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar (Prominent circle, no username text) */}
            <div ref={userDropdownRef} className="relative">
              <button
                type="button"
                id="navbar-profile-avatar-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`relative rounded-full p-0.5 transition-all duration-200 cursor-pointer select-none hover:scale-105 active:scale-95 focus:outline-none flex items-center justify-center ${
                  showUserDropdown
                    ? 'ring-2 ring-offset-2 ' + (
                        accentColor === 'emerald' ? 'ring-emerald-400 ring-offset-[#080A14]' :
                        accentColor === 'amber' ? 'ring-amber-400 ring-offset-[#080A14]' :
                        accentColor === 'rose' ? 'ring-rose-400 ring-offset-[#080A14]' :
                        accentColor === 'blue' ? 'ring-blue-400 ring-offset-[#080A14]' :
                        'ring-purple-400 ring-offset-[#080A14]'
                      )
                    : ''
                }`}
                title={`Profile: @${displayName}`}
                aria-label="User profile menu"
              >
                <img
                  src={avatarImage}
                  alt={displayName}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 shadow-lg transition-transform ${
                    accentColor === 'emerald' ? 'border-emerald-400 shadow-emerald-500/25' :
                    accentColor === 'amber' ? 'border-amber-400 shadow-amber-500/25' :
                    accentColor === 'rose' ? 'border-rose-400 shadow-rose-500/25' :
                    accentColor === 'blue' ? 'border-blue-400 shadow-blue-500/25' :
                    'border-purple-400 shadow-purple-500/25'
                  }`}
                  onError={(e) => {
                    e.target.src = '/images/boy_1.jpg';
                  }}
                />
                {/* Active Online Status Indicator */}
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 ${
                  isDark ? 'border-[#080A14]' : 'border-white'
                }`} />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-2xl p-2 border shadow-2xl z-40 text-xs backdrop-blur-xl ${
                  isDark
                    ? 'bg-[#0B0D19]/95 border-white/10 text-white'
                    : 'bg-white border-slate-200 text-black shadow-2xl'
                }`}>
                  <div className={`px-3 py-2 border-b mb-1 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <p
                      className="font-black truncate text-sm"
                      style={{ color: isDark ? '#ffffff' : '#000000' }}
                    >
                      {displayName}
                    </p>
                    <p
                      className="text-[10px] truncate font-semibold"
                      style={{ color: isDark ? '#94a3b8' : '#000000' }}
                    >
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setActiveTab('Profile');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      isDark ? 'text-slate-300 hover:bg-white/5' : 'text-black font-bold hover:bg-slate-100'
                    }`}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setActiveTab('Settings');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      isDark ? 'text-slate-300 hover:bg-white/5' : 'text-black font-bold hover:bg-slate-100'
                    }`}
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 font-black mt-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        )}

        {/* 3. Conditional Page Render based on active sidebar tab */}
        {activeTab === 'Messages' ? (
          <MessagesView isDark={isDark} accentColor={accentColor} />
        ) : activeTab === 'Contacts' ? (
          <ContactsView
            isDark={isDark}
            accentColor={accentColor}
            onSelectContact={() => setActiveTab('Messages')}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        ) : activeTab === 'Requests' ? (
          <FriendRequestsView
            isDark={isDark}
            accentColor={accentColor}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        ) : activeTab === 'Favorites' ? (
          <FavoritesView
            isDark={isDark}
            accentColor={accentColor}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        ) : activeTab === 'Calls' ? (
          <CallsView
            isDark={isDark}
            accentColor={accentColor}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        ) : activeTab === 'Notifications' ? (
          <NotificationsView isDark={isDark} accentColor={accentColor} />
        ) : activeTab === 'Profile' ? (
          <ProfileView
            user={user}
            isDark={isDark}
            onNavigateTab={(tab) => setActiveTab(tab)}
            accentColor={accentColor}
          />
        ) : activeTab === 'Settings' ? (
          <SettingsView
            user={user}
            isDark={isDark}
            toggleTheme={toggleTheme}
            onLogout={handleLogout}
            accentColor={accentColor}
            onAccentChange={handleAccentChange}
          />
        ) : (
          /* Home Section matching Image 3 */
          <HomeView
            user={user}
            isDark={isDark}
            onNavigateTab={(tab) => setActiveTab(tab)}
            accentColor={accentColor}
            onMetricsChange={loadMetrics}
          />
        )}
      </div>
    </div>
  );
}
