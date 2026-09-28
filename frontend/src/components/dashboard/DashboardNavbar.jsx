import { useState, useRef, useEffect } from 'react';
import { Search, Home, MessageSquare, ChevronDown, User, Settings, Bookmark, LogOut, Sun, Moon } from 'lucide-react';

export default function DashboardNavbar({ user, onNavigate, onLogout, isDark, toggleTheme }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const displayName = user?.displayName || user?.username || 'Sai Ram';
  const handle = user?.username ? `@${user.username}` : '@sai_dev';
  const avatarUrl = user?.avatarUrl || '/images/dashboard/sai_avatar.png';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isDark ? 'bg-[#0b0e1b]/95 border-b border-white/10' : 'bg-white border-b border-slate-200/80 shadow-xs'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: ConnectX Logo */}
        <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center">
            <img
              src="https://files.catbox.moe/pmml9g.png"
              alt="ConnectX Logo"
              className="w-auto h-8 object-contain"
              onError={(e) => {
                e.target.src = '/images/connectx_logo.png';
              }}
            />
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6">
          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, posts, or skills..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                isDark
                  ? 'bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:border-purple-500'
                  : 'bg-[#F4F6FB] border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-purple-500'
              }`}
            />
          </div>
        </div>

        {/* Right Actions: Icons & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Home Icon with Red Badge */}
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Home"
          >
            <Home className="w-5 h-5 fill-current" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {/* Messages Icon with Red Badge */}
          <button
            className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Messages"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              5
            </span>
          </button>

          {/* Theme Toggle Button */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/[0.05] border-white/10 text-yellow-300 hover:bg-white/10'
                  : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {isDark ? <Moon className="w-4 h-4 fill-current text-slate-200" /> : <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />}
            </button>
          )}

          {/* User Profile Pill with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full border transition-all cursor-pointer ${
                isDark
                  ? 'border-white/10 hover:bg-white/[0.06]'
                  : 'border-transparent hover:bg-slate-100'
              }`}
            >
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-9 h-9 rounded-full object-cover border border-purple-500/20 shadow-xs"
                  onError={(e) => {
                    e.target.src = '/images/dashboard/sai_avatar.png';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {handle}
                </span>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-2xl p-1.5 shadow-xl border backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isDark
                    ? 'bg-[#121626]/95 border-white/10 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-700 shadow-xl'
                }`}
              >
                <div className="px-3 py-2 border-b mb-1 border-slate-200/60 dark:border-white/10">
                  <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{handle}</p>
                </div>

                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-purple-500/10 hover:text-purple-600 transition-colors cursor-pointer text-left"
                >
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </button>

                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-purple-500/10 hover:text-purple-600 transition-colors cursor-pointer text-left"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmarks</span>
                </button>

                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-purple-500/10 hover:text-purple-600 transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings & Privacy</span>
                </button>

                <div className="my-1 border-t border-slate-200/60 dark:border-white/10" />

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
