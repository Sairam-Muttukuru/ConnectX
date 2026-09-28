import { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Star,
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  LayoutGrid,
  List,
  Search,
  Users,
  Clock,
  ArrowUpDown,
  CheckCircle2,
  Check,
  X,
  UserPlus,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { getAccentTheme } from '../../../utils/themeHelper';
import dashboardService from '../../../services/dashboardService';
import { useToast } from '../../../context/ToastContext';

export default function FavoritesView({ isDark = true, onNavigateTab, accentColor = 'purple' }) {
  const { showToast } = useToast();
  const theme = getAccentTheme(accentColor);
  const [filter, setFilter] = useState('all'); // 'all' | 'online' | 'offline'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recently Added');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allFriends, setAllFriends] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('connectx_favorite_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load real friends from backend
  const loadFriends = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getFriends();
      if (Array.isArray(data)) {
        setAllFriends(data);
      }
    } catch (err) {
      console.warn('Failed to load friends for favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  // Listen for favorite updates across the app
  useEffect(() => {
    const handleFavoritesUpdated = (e) => {
      if (Array.isArray(e.detail)) {
        setFavoriteIds(e.detail);
      }
    };
    window.addEventListener('connectx_favorites_updated', handleFavoritesUpdated);
    return () => window.removeEventListener('connectx_favorites_updated', handleFavoritesUpdated);
  }, []);

  const toggleFavorite = (friend) => {
    let nextIds;
    const isFav = favoriteIds.includes(friend.id);
    if (isFav) {
      nextIds = favoriteIds.filter((id) => id !== friend.id);
      showToast(`Removed ${friend.displayName || friend.username} from Favorites`);
    } else {
      nextIds = [...favoriteIds, friend.id];
      showToast(`Added ${friend.displayName || friend.username} to Favorites! ⭐`);
    }
    setFavoriteIds(nextIds);
    localStorage.setItem('connectx_favorite_ids', JSON.stringify(nextIds));
    window.dispatchEvent(new CustomEvent('connectx_favorites_updated', { detail: nextIds }));
  };

  // Filter friends who are favorited
  const favorites = useMemo(() => {
    return allFriends.filter((f) => favoriteIds.includes(f.id)).map((f) => ({
      id: f.id,
      name: f.displayName || f.username,
      username: f.username,
      avatar: f.avatarUrl || '/images/boy_1.jpg',
      status: 'Online',
      statusColor: 'bg-emerald-500',
      bio: f.bio || 'Connected ConnectX Friend 💫',
      tags: ['Friend', 'ConnectX'],
    }));
  }, [allFriends, favoriteIds]);

  const filteredFavorites = useMemo(() => {
    return favorites
      .filter((fav) => {
        const matchesFilter =
          filter === 'all' ||
          (filter === 'online' && (fav.status === 'Online' || fav.status === 'Away')) ||
          (filter === 'offline' && fav.status === 'Offline');

        const matchesSearch =
          fav.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fav.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fav.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'Name A-Z') return a.name.localeCompare(b.name);
        if (sortBy === 'Online First') {
          const order = { Online: 1, Away: 2, Offline: 3 };
          return order[a.status] - order[b.status];
        }
        return 0;
      });
  }, [favorites, filter, searchQuery, sortBy]);

  const onlineCount = favorites.filter((f) => f.status === 'Online').length;
  const offlineCount = favorites.filter((f) => f.status === 'Offline').length;

  return (
    <div className="p-4 sm:p-7 max-w-[1520px] w-full mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl ${theme.badge} flex items-center justify-center shadow-lg shadow-purple-500/10`}
          >
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Favorites
            </h1>
            <p
              className={`text-xs sm:text-sm mt-0.5 font-normal ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Keep the people who matter most close — no phone numbers, just real connections.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-1">
        {/* Left Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {[
            { id: 'all', label: `All (${favorites.length})` },
            { id: 'online', label: `Online (${onlineCount})` },
            { id: 'offline', label: `Offline (${offlineCount})` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                filter === item.id
                  ? `${theme.btnSolid} font-bold shadow-md shadow-purple-500/20 text-white`
                  : isDark
                  ? 'bg-[#0E1225] text-slate-300 hover:text-white border border-white/[0.08]'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Center Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in favorites..."
            className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs sm:text-sm border focus:outline-none transition-all ${
              isDark
                ? `bg-[#0A0D1F] border-white/[0.08] text-white placeholder-slate-400 ${theme.ring}`
                : `bg-white border-slate-200 text-slate-900 placeholder-slate-400 ${theme.ring} shadow-xs`
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Sort & View Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#0E1225] border-white/[0.08] text-slate-300 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort by</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {sortBy}
              </span>
              <span className="text-slate-400 text-[10px]">▼</span>
            </button>

            {showSortDropdown && (
              <div
                className={`absolute right-0 top-full mt-2 w-44 rounded-2xl border py-1.5 shadow-2xl z-40 backdrop-blur-xl ${
                  isDark
                    ? 'bg-[#0E1229]/95 border-white/10 text-slate-200'
                    : 'bg-white/95 border-slate-200 text-slate-800'
                }`}
              >
                {['Recently Added', 'Name A-Z', 'Online First'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      sortBy === opt
                        ? 'text-blue-400 font-bold bg-blue-500/10'
                        : isDark
                        ? 'hover:bg-white/[0.06] text-slate-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {sortBy === opt && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className={`p-1 rounded-xl border flex items-center gap-1 ${
              isDark ? 'bg-[#0E1225] border-white/[0.08]' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Cards Grid */}
      {loading ? (
        <div
          className={`p-12 text-center rounded-3xl border space-y-3 ${
            isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
          }`}
        >
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading your favorites...</p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div
          className={`p-14 text-center rounded-3xl border space-y-4 ${
            isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
            <Star className="w-7 h-7 fill-amber-400/20" />
          </div>
          <div className="space-y-1">
            <h3
              className={`text-base font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {searchQuery ? `No favorites matching "${searchQuery}"` : 'No favorite people yet'}
            </h3>
            <p
              className={`text-xs max-w-sm mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {searchQuery
                ? 'Try a different search term or clear the search input.'
                : 'Click the star icon ⭐ on any friend in Contacts / Friends to keep them at your fingertips here!'}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={() => onNavigateTab && onNavigateTab('Contacts')}
              className={`px-5 py-2.5 rounded-2xl ${theme.btnSolid} text-white font-bold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2`}
            >
              <Users className="w-4 h-4" />
              <span>Browse Friends</span>
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
          }
        >
          {filteredFavorites.map((fav) => (
            <div
              key={fav.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 group ${
                isDark
                  ? `bg-[#0A0D1F]/90 border-white/[0.08] ${theme.borderHover}`
                  : `bg-white border-slate-200 ${theme.borderHover} shadow-xs`
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={fav.avatar}
                      alt={fav.name}
                      className={`w-13 h-13 rounded-full object-cover border-2 ${theme.borderLight}`}
                      onError={(e) => {
                        e.target.src = '/images/boy_1.jpg';
                      }}
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ${
                        isDark ? 'ring-[#0A0D1F]' : 'ring-white'
                      } ${fav.statusColor}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-extrabold truncate ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {fav.name}
                    </h4>
                    <p
                      className={`text-xs truncate ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      @{fav.username}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                      {fav.status}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(fav)}
                  className="p-1.5 rounded-lg text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  title="Remove from favorites"
                >
                  <Star className="w-4 h-4 fill-amber-400" />
                </button>
              </div>

              <p
                className={`text-xs line-clamp-2 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {fav.bio}
              </p>

              {/* Action Buttons: Message + Voice Call + Video Call */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                <button
                  onClick={() => onNavigateTab && onNavigateTab('Messages')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => onNavigateTab && onNavigateTab('Calls')}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/10'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Start voice call"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigateTab && onNavigateTab('Calls')}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/10'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Start video call"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
