import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Users,
  Search,
  X,
  SlidersHorizontal,
  MoreVertical,
  Lightbulb,
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  Share2,
  ChevronRight,
  CheckCircle2,
  UserPlus,
  UserMinus,
  Check,
  MessageSquare,
  Phone,
  Video,
  Star,
  UserCheck,
  ShieldAlert,
  Copy,
  ExternalLink,
  Sparkles,
  Heart,
  Globe,
  Camera,
  Music,
  Palette,
  Dumbbell,
  Film,
  Compass,
  Smile,
  RefreshCw,
  Loader2,
  UserX,
  Mail,
  Send,
} from 'lucide-react';
import { getAccentTheme } from '../../../utils/themeHelper';
import dashboardService from '../../../services/dashboardService';
import chatSocket from '../../../services/chatSocket';
import { useToast } from '../../../context/ToastContext';

export default function ContactsView({
  isDark = true,
  onSelectContact,
  onNavigateTab,
  accentColor = 'blue',
}) {
  const theme = getAccentTheme(accentColor);

  // Main navigation tab inside Contacts: 'find' (Find People) or 'friends' (My Friends)
  const [activeMainSection, setActiveMainSection] = useState('find'); // 'find' | 'friends'

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All'); // 'All' | 'Users' | 'Groups' | 'Posts'
  const [sortBy, setSortBy] = useState('Newest first');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Modals & Popups
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Advanced Filters
  const [filterOnlineOnly, setFilterOnlineOnly] = useState(false);
  const [filterMinMutual, setFilterMinMutual] = useState(0);
  const [selectedTagFilter, setSelectedTagFilter] = useState('All');

  // Friends Section Search & Filter
  const [friendsSearch, setFriendsSearch] = useState('');
  const [friendsFilter, setFriendsFilter] = useState('All'); // 'All' | 'Online' | 'Favorites'

  // Invite by email state in modal
  const [inviteEmail, setInviteEmail] = useState('');
  const { showToast } = useToast();

  // Real data states from database
  const [searchResults, setSearchResults] = useState([]);
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Online Users WebSocket tracking
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  useEffect(() => {
    chatSocket.connect();
    chatSocket.requestOnlineUsers();

    const unsubOnlineList = chatSocket.on('online_users', (ids) => {
      if (Array.isArray(ids)) {
        setOnlineUserIds(new Set(ids.map((id) => String(id).toLowerCase())));
      }
    });

    const unsubStatus = chatSocket.on('status', ({ userId, status }) => {
      if (!userId) return;
      const uId = String(userId).toLowerCase();
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (status === 'ONLINE') {
          next.add(uId);
        } else {
          next.delete(uId);
        }
        return next;
      });
    });

    return () => {
      unsubOnlineList();
      unsubStatus();
    };
  }, []);

  const isUserOnline = (id, fallback = false) => {
    if (!id) return false;
    const uId = String(id).toLowerCase();
    if (onlineUserIds.size > 0) {
      return onlineUserIds.has(uId);
    }
    return Boolean(fallback);
  };

  // Helper mapping from backend UserSearchResultDto
  const mapSearchUser = (u) => {
    const displayName = u.displayName || u.username || 'User';
    const isOnline = isUserOnline(u.id, u.online);
    return {
      id: u.id,
      name: displayName,
      username: u.username || 'user',
      avatar: u.avatarUrl || '/images/dashboard/user_avatar.jpg',
      online: isOnline,
      status: isOnline ? 'Online' : 'Offline',
      statusColor: isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-400',
      bio: u.bio || 'ConnectX Explorer 🌐',
      tags: u.bio
        ? u.bio
            .split(/[|,\s]+/)
            .filter((w) => w.length > 2 && w.length < 12)
            .slice(0, 3)
        : ['Member', 'ConnectX'],
      mutualFriends: 0,
      requested: !!u.isPending,
      isFriend: !!u.isFriend,
      isFavorite: false,
      joinDate: 'ConnectX Member',
      location: 'India',
    };
  };

  const mapFriendUser = (u) => {
    const displayName = u.displayName || u.username || 'Friend';
    const isOnline = isUserOnline(u.id, u.online);
    return {
      id: u.id,
      name: displayName,
      username: u.username || 'friend',
      avatar: u.avatarUrl || '/images/dashboard/user_avatar.jpg',
      online: isOnline,
      status: isOnline ? 'Online' : 'Offline',
      statusColor: isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-400',
      bio: u.bio || 'Connected Friend 💬',
      tags: ['Friend', 'ConnectX'],
      mutualFriends: 0,
      isFavorite: false,
      lastSeen: isOnline ? 'Active now' : 'Offline',
    };
  };

  const mapSuggestionUser = (u) => {
    const displayName = u.displayName || u.username || 'ConnectX User';
    return {
      id: u.id,
      name: displayName,
      username: u.username || 'user',
      avatar: u.avatarUrl || '/images/boy_3.jpg',
      mutual: 'Suggested connection',
      mutualCount: 0,
      added: !!u.isPending,
      bio: u.bio || 'New ConnectX Member ✨',
      tags: ['ConnectX'],
    };
  };

  // Fetch functions from real DB
  const loadFriends = async () => {
    setLoadingFriends(true);
    try {
      const data = await dashboardService.getFriends();
      if (Array.isArray(data)) {
        setMyFriends(data.map(mapFriendUser));
      }
    } catch (err) {
      console.warn('Error fetching friends:', err);
    } finally {
      setLoadingFriends(false);
    }
  };

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const data = await dashboardService.getSuggestions();
      if (Array.isArray(data)) {
        setPeopleYouMayKnow(data.map(mapSuggestionUser));
      }
    } catch (err) {
      console.warn('Error fetching suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const executeSearch = async (term) => {
    setLoadingSearch(true);
    try {
      const data = await dashboardService.searchUsers(term || '');
      if (Array.isArray(data)) {
        setSearchResults(data.map(mapSearchUser));
      }
    } catch (err) {
      console.warn('Error searching users:', err);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadFriends();
    loadSuggestions();
    executeSearch('');
  }, []);

  // Debounced search on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setShowSortDropdown(false);
        setActiveMenuId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Handle Send Request in Find People
  const handleSendRequest = async (id, name) => {
    setSearchResults((prev) =>
      prev.map((u) => (u.id === id ? { ...u, requested: true } : u))
    );
    showToast(`Friend request sent to ${name}!`);
    try {
      await dashboardService.sendFriendRequest(id);
      loadSuggestions();
    } catch (err) {
      console.warn('Error sending friend request:', err);
    }
  };

  // Handle Add Friend in People You May Know
  const handleAddSuggested = async (id, name) => {
    setPeopleYouMayKnow((prev) =>
      prev.map((p) => (p.id === id ? { ...p, added: true } : p))
    );
    showToast(`Friend request sent to ${name}!`);
    try {
      await dashboardService.sendFriendRequest(id);
      executeSearch(searchQuery);
    } catch (err) {
      console.warn('Error adding friend:', err);
    }
  };

  // Remove Friend
  const handleRemoveFriend = async (friendId, friendName) => {
    setMyFriends((prev) => prev.filter((f) => f.id !== friendId));
    setActiveMenuId(null);
    showToast(`Removed ${friendName} from friends`);
    try {
      await dashboardService.removeFriend(friendId);
      loadFriends();
      loadSuggestions();
      executeSearch(searchQuery);
    } catch (err) {
      console.warn('Error removing friend:', err);
    }
  };

  // Toggle Favorite
  const toggleFavorite = (user) => {
    setSearchResults((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isFavorite: !u.isFavorite } : u))
    );
    setMyFriends((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isFavorite: !u.isFavorite } : u))
    );
    showToast(
      user.isFavorite
        ? `Removed ${user.name} from Favorites`
        : `Added ${user.name} to Favorites! ⭐`
    );
  };

  // Navigation to other sections with contact data
  const handleStartMessage = (user) => {
    showToast(`Opening chat with ${user.name}...`);
    if (onSelectContact) {
      onSelectContact(user);
    } else if (onNavigateTab) {
      onNavigateTab('Messages');
    }
  };

  const handleStartCall = (user, isVideo = false) => {
    showToast(`Starting ${isVideo ? 'video' : 'voice'} call with ${user.name}...`);
    if (onNavigateTab) {
      onNavigateTab('Calls');
    }
  };

  const handleCopyProfileLink = (username) => {
    const url = `${window.location.origin}/#profile/${username}`;
    navigator.clipboard?.writeText(url);
    showToast('Profile link copied to clipboard!');
  };

  const handleBlockUser = (userId, name) => {
    setSearchResults((prev) => prev.filter((u) => u.id !== userId));
    setMyFriends((prev) => prev.filter((u) => u.id !== userId));
    showToast(`Blocked ${name}. You won't see them in recommendations.`);
  };

  // Filtered & Sorted Search Results for Find People
  const filteredResults = useMemo(() => {
    let list = [...searchResults];

    // Sub-tab filter (Groups / Posts)
    if (activeFilterTab === 'Groups' || activeFilterTab === 'Posts') {
      return [];
    }

    // Advanced filters
    if (filterOnlineOnly) {
      list = list.filter((u) => isUserOnline(u.id, u.online));
    }
    if (filterMinMutual > 0) {
      list = list.filter((u) => (u.mutualFriends || 0) >= filterMinMutual);
    }
    if (selectedTagFilter !== 'All') {
      list = list.filter((u) =>
        u.tags.some((t) => t.toLowerCase() === selectedTagFilter.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'Alphabetical (A-Z)') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Most Mutual Friends') {
      list.sort((a, b) => (b.mutualFriends || 0) - (a.mutualFriends || 0));
    } else if (sortBy === 'Online first') {
      list.sort((a, b) => (isUserOnline(a.id, a.online) ? -1 : 1));
    }

    return list;
  }, [
    searchResults,
    activeFilterTab,
    sortBy,
    filterOnlineOnly,
    filterMinMutual,
    selectedTagFilter,
    onlineUserIds,
  ]);

  // Filtered Friends in My Friends tab
  const filteredFriends = useMemo(() => {
    let list = [...myFriends];
    if (friendsSearch.trim()) {
      const q = friendsSearch.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (friendsFilter === 'Online') {
      list = list.filter((u) => isUserOnline(u.id, u.online));
    } else if (friendsFilter === 'Favorites') {
      list = list.filter((u) => u.isFavorite);
    }
    return list;
  }, [myFriends, friendsSearch, friendsFilter, onlineUserIds]);

  return (
    <div className="p-4 sm:p-7 max-w-[1520px] w-full mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Grid Layout: Left Column (Col Span 8) + Right Column (Col Span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT MAIN AREA (Col Span 8): Find People / My Friends ================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* Header Title + Navigation Toggle + Filters Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl ${theme.badge} flex items-center justify-center shadow-lg shadow-blue-500/10`}
              >
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {activeMainSection === 'find' ? 'Find People' : 'My Friends'}
                </h1>
                <p
                  className={`text-xs sm:text-sm mt-0.5 font-normal ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {activeMainSection === 'find'
                    ? 'Search registered users by username and send friend requests.'
                    : 'Manage your connected friends, start chats, or place instant calls.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Tab Selector between Find People & My Friends */}
              <div
                className={`p-1 rounded-2xl border flex items-center gap-1 ${
                  isDark
                    ? 'bg-[#0A0D1F] border-white/[0.08]'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                <button
                  onClick={() => setActiveMainSection('find')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMainSection === 'find'
                      ? `${theme.btnSolid} text-white`
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  Find People
                </button>
                <button
                  onClick={() => {
                    setActiveMainSection('friends');
                    loadFriends();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMainSection === 'friends'
                      ? `${theme.btnSolid} text-white`
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  <span>My Friends</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      activeMainSection === 'friends'
                        ? 'bg-white/20 text-white'
                        : isDark
                        ? 'bg-white/10 text-slate-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {myFriends.length}
                  </span>
                </button>
              </div>

              {/* Advanced Filters Button */}
              {activeMainSection === 'find' && (
                <button
                  onClick={() => setShowFilterModal(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                    filterOnlineOnly || filterMinMutual > 0 || selectedTagFilter !== 'All'
                      ? `${theme.badge} font-bold`
                      : isDark
                      ? 'bg-[#0E1225] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {(filterOnlineOnly || filterMinMutual > 0 || selectedTagFilter !== 'All') && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </button>
              )}
            </div>
          </div>

          {activeMainSection === 'find' ? (
            <>
              {/* Search Input Bar with Clear & Search Button */}
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') executeSearch(searchQuery);
                  }}
                  placeholder="Search people by username..."
                  className={`w-full pl-11 pr-28 py-3 rounded-2xl text-xs sm:text-sm border focus:outline-none transition-all ${
                    isDark
                      ? `bg-[#0A0D1F] border-white/[0.08] text-white placeholder-slate-400 ${theme.ring}`
                      : `bg-white border-slate-200 text-slate-900 placeholder-slate-400 ${theme.ring} shadow-xs`
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      executeSearch('');
                    }}
                    className="absolute right-24 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => executeSearch(searchQuery)}
                  disabled={loadingSearch}
                  className={`absolute right-2 px-5 py-2 rounded-xl ${theme.btn} text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-500/25 flex items-center gap-1.5`}
                >
                  {loadingSearch ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : null}
                  <span>Search</span>
                </button>
              </div>

              {/* Filter Tabs + Sort By Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                  {[
                    { id: 'All', label: `All (${searchResults.length})` },
                    { id: 'Users', label: `Users (${searchResults.length})` },
                    { id: 'Groups', label: 'Groups (0)' },
                    { id: 'Posts', label: 'Posts (0)' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilterTab(tab.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                        activeFilterTab === tab.id
                          ? `${theme.btnSolid} font-bold shadow-md shadow-blue-500/20`
                          : isDark
                          ? 'bg-[#0E1225] text-slate-300 hover:text-white border border-white/[0.08]'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="relative shrink-0 dropdown-container">
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
                    <span
                      className={`font-semibold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {sortBy}
                    </span>
                    <span className="text-slate-400 text-[10px]">▼</span>
                  </button>

                  {showSortDropdown && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-48 rounded-2xl border py-1.5 shadow-2xl z-40 backdrop-blur-xl ${
                        isDark
                          ? 'bg-[#0E1229]/95 border-white/10 text-slate-200 shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
                          : 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.12)]'
                      }`}
                    >
                      {[
                        'Newest first',
                        'Alphabetical (A-Z)',
                        'Online first',
                      ].map((opt) => (
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
                          {sortBy === opt && (
                            <Check className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filter Chips */}
              {(filterOnlineOnly || filterMinMutual > 0 || selectedTagFilter !== 'All') && (
                <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                  <span className="text-slate-400 text-[11px] font-semibold">Active filters:</span>
                  {filterOnlineOnly && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online Only
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-white"
                        onClick={() => setFilterOnlineOnly(false)}
                      />
                    </span>
                  )}
                  {filterMinMutual > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                      {filterMinMutual}+ Mutuals
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-white"
                        onClick={() => setFilterMinMutual(0)}
                      />
                    </span>
                  )}
                  {selectedTagFilter !== 'All' && (
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
                      #{selectedTagFilter}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-white"
                        onClick={() => setSelectedTagFilter('All')}
                      />
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setFilterOnlineOnly(false);
                      setFilterMinMutual(0);
                      setSelectedTagFilter('All');
                    }}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer ml-1"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Search Results List */}
              <div className="space-y-3 pt-1">
                {loadingSearch ? (
                  <div
                    className={`p-12 text-center rounded-3xl border space-y-3 ${
                      isDark
                        ? 'bg-[#0A0D1F]/90 border-white/[0.08]'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                    <p className="text-xs text-slate-400">Searching ConnectX database...</p>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div
                    className={`p-12 text-center rounded-3xl border space-y-3 ${
                      isDark
                        ? 'bg-[#0A0D1F]/90 border-white/[0.08]'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3
                      className={`text-base font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {searchQuery ? `No results for "${searchQuery}"` : 'No people found'}
                    </h3>
                    <p
                      className={`text-xs max-w-sm mx-auto ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {searchQuery
                        ? 'Check your spelling or search using another username or name.'
                        : 'Invite your friends to register and join you on ConnectX!'}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveFilterTab('All');
                          setFilterOnlineOnly(false);
                          setFilterMinMutual(0);
                          setSelectedTagFilter('All');
                          executeSearch('');
                        }}
                        className={`px-4 py-2 rounded-xl ${theme.btnSolid} text-white text-xs font-bold transition-all cursor-pointer`}
                      >
                        Reset Search
                      </button>
                    )}
                  </div>
                ) : (
                  filteredResults.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                        isDark
                          ? `bg-[#0A0D1F]/90 border-white/[0.08] ${theme.borderHover}`
                          : `bg-white border-slate-200 ${theme.borderHover} shadow-xs`
                      }`}
                    >
                      {/* Left: Avatar + Details + Tags */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="relative shrink-0 cursor-pointer"
                          onClick={() => setPreviewUser(user)}
                          title="Click to view profile"
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className={`w-14 h-14 rounded-full object-cover border-2 ${theme.borderLight} transition-transform group-hover:scale-105`}
                            onError={(e) => {
                              e.target.src = '/images/dashboard/user_avatar.jpg';
                            }}
                          />
                          <span
                            className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full ring-2 ${
                              isDark ? 'ring-[#0A0D1F]' : 'ring-white'
                            } ${isUserOnline(user.id, user.online) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-400'}`}
                          />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              onClick={() => setPreviewUser(user)}
                              className={`text-sm sm:text-base font-extrabold truncate cursor-pointer hover:underline transition-colors ${
                                isDark ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {user.name}
                            </h3>
                            <span
                              className={`text-xs ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              @{user.username}
                            </span>
                            {user.isFavorite && (
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                            )}
                          </div>

                          {/* Status line */}
                          <div className="flex items-center gap-2 text-xs truncate">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isUserOnline(user.id, user.online)
                                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                                  : 'bg-slate-400'
                              }`}
                            />
                            <span
                              className={`font-semibold shrink-0 ${
                                isUserOnline(user.id, user.online)
                                  ? 'text-emerald-400'
                                  : isDark
                                  ? 'text-slate-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              {isUserOnline(user.id, user.online) ? 'Online' : 'Offline'}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span
                              className={`truncate ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {user.bio}
                            </span>
                          </div>

                          {/* Tags Pills */}
                          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            {user.tags.map((t) => (
                              <span
                                key={t}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTagFilter(t);
                                }}
                                className={`text-[10px] font-semibold px-2.5 py-0.8 rounded-full border transition-colors cursor-pointer ${
                                  selectedTagFilter.toLowerCase() === t.toLowerCase()
                                    ? `${theme.badge} font-bold`
                                    : isDark
                                    ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08]'
                                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: + Send Request / Friends Button + Options Dropdown */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {user.isFriend ? (
                          <div className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Friends</span>
                          </div>
                        ) : user.requested ? (
                          <div className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>Request Sent</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSendRequest(user.id, user.name)}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${theme.btn} text-white active:scale-95 shadow-lg shadow-blue-500/25`}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Send Request</span>
                          </button>
                        )}

                        {/* Options Dropdown Menu */}
                        <div className="relative dropdown-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === user.id ? null : user.id);
                            }}
                            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                              activeMenuId === user.id
                                ? isDark
                                  ? 'bg-white/10 text-white'
                                  : 'bg-slate-200 text-slate-900'
                                : isDark
                                ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === user.id && (
                            <div
                              className={`absolute right-0 top-full mt-2 w-48 rounded-2xl border py-1.5 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 ${
                                isDark
                                  ? 'bg-[#0E1229]/95 border-white/10 text-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.6)]'
                                  : 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.15)]'
                              }`}
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setPreviewUser(user);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 cursor-pointer ${
                                  isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-slate-100'
                                }`}
                              >
                                <Users className="w-3.5 h-3.5 text-blue-400" />
                                <span>View Profile</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleStartMessage(user);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 cursor-pointer ${
                                  isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-slate-100'
                                }`}
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Direct Message</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleStartCall(user, false);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 cursor-pointer ${
                                  isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-slate-100'
                                }`}
                              >
                                <Phone className="w-3.5 h-3.5 text-purple-400" />
                                <span>Audio Call</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  toggleFavorite(user);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 cursor-pointer ${
                                  isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-slate-100'
                                }`}
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    user.isFavorite
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-amber-400'
                                  }`}
                                />
                                <span>
                                  {user.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleCopyProfileLink(user.username);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 cursor-pointer ${
                                  isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-slate-100'
                                }`}
                              >
                                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Copy Profile Link</span>
                              </button>

                              <div className="my-1 border-t border-white/[0.06]" />

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleBlockUser(user.id, user.name);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 text-rose-400 cursor-pointer ${
                                  isDark ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'
                                }`}
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>Block User</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* ================= MY FRIENDS VIEW (Loaded from PostgreSQL) ================= */
            <div className="space-y-4">
              {/* Friends search & sub-filter bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={friendsSearch}
                    onChange={(e) => setFriendsSearch(e.target.value)}
                    placeholder="Search connected friends by name, @username..."
                    className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs sm:text-sm border focus:outline-none transition-all ${
                      isDark
                        ? `bg-[#0A0D1F] border-white/[0.08] text-white placeholder-slate-400 ${theme.ring}`
                        : `bg-white border-slate-200 text-slate-900 placeholder-slate-400 ${theme.ring}`
                    }`}
                  />
                  {friendsSearch && (
                    <button
                      onClick={() => setFriendsSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {['All', 'Online', 'Favorites'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFriendsFilter(f)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        friendsFilter === f
                          ? `${theme.btnSolid} text-white shadow-md`
                          : isDark
                          ? 'bg-[#0E1225] text-slate-400 hover:text-white border border-white/[0.06]'
                          : 'bg-white text-slate-600 hover:text-black border border-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Friends Grid */}
              {loadingFriends ? (
                <div
                  className={`p-12 text-center rounded-3xl border space-y-3 ${
                    isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                  }`}
                >
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Loading your friends list...</p>
                </div>
              ) : filteredFriends.length === 0 ? (
                <div
                  className={`p-12 text-center rounded-3xl border space-y-4 ${
                    isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
                    <Users className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3
                      className={`text-base font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {friendsSearch ? `No friends match "${friendsSearch}"` : 'No friends yet'}
                    </h3>
                    <p
                      className={`text-xs max-w-sm mx-auto ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {friendsSearch
                        ? 'Try searching with a different name or clear the search bar.'
                        : 'Connect with people by sending friend requests in the Find People tab!'}
                    </p>
                  </div>
                  {!friendsSearch && (
                    <button
                      onClick={() => setActiveMainSection('find')}
                      className={`px-5 py-2.5 rounded-2xl ${theme.btnSolid} text-white font-bold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Find People</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className={`p-4 rounded-3xl border transition-all flex flex-col justify-between gap-3 group ${
                        isDark
                          ? `bg-[#0A0D1F]/90 border-white/[0.08] ${theme.borderHover}`
                          : `bg-white border-slate-200 ${theme.borderHover} shadow-xs`
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="relative shrink-0 cursor-pointer"
                            onClick={() => setPreviewUser(friend)}
                          >
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className={`w-12 h-12 rounded-full object-cover border-2 ${theme.borderLight}`}
                              onError={(e) => {
                                e.target.src = '/images/dashboard/user_avatar.jpg';
                              }}
                            />
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ${
                                isDark ? 'ring-[#0A0D1F]' : 'ring-white'
                              } ${isUserOnline(friend.id, friend.online) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-400'}`}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4
                                onClick={() => setPreviewUser(friend)}
                                className={`text-xs sm:text-sm font-extrabold truncate cursor-pointer hover:underline ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {friend.name}
                              </h4>
                              {friend.isFavorite && (
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                              )}
                            </div>
                            <p
                              className={`text-[11px] truncate ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              @{friend.username}
                            </p>
                            <p
                              className={`text-[10px] mt-0.5 font-medium ${
                                isUserOnline(friend.id, friend.online)
                                  ? 'text-emerald-400'
                                  : isDark
                                  ? 'text-slate-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              {isUserOnline(friend.id, friend.online) ? 'Active now' : 'Offline'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleFavorite(friend)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              friend.isFavorite
                                ? 'text-amber-400'
                                : isDark
                                ? 'text-slate-500 hover:text-white'
                                : 'text-slate-400 hover:text-black'
                            }`}
                            title={friend.isFavorite ? 'Remove Favorite' : 'Add to Favorite'}
                          >
                            <Star
                              className={`w-4 h-4 ${friend.isFavorite ? 'fill-amber-400' : ''}`}
                            />
                          </button>

                          <button
                            onClick={() => handleRemoveFriend(friend.id, friend.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove Friend"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p
                        className={`text-xs line-clamp-1 ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {friend.bio}
                      </p>

                      {/* Quick Relations Actions: Message + Voice Call + Video Call */}
                      <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
                        <button
                          onClick={() => handleStartMessage(friend)}
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
                          onClick={() => handleStartCall(friend, false)}
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
                          onClick={() => handleStartCall(friend, true)}
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
          )}
        </div>

        {/* ================= RIGHT COLUMN (Col Span 4): Search Tips + People You May Know + Quick Actions ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Search Tips matching design */}
          <div
            className={`p-5 rounded-3xl border shadow-sm space-y-2.5 ${
              isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-amber-400">
              <Lightbulb className="w-4 h-4 fill-amber-400/20" />
              <h3 className="text-sm font-bold">Search Tips</h3>
            </div>
            <ul
              className={`text-xs space-y-1.5 leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Search using exact username (e.g. @priya_s)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`${theme.text} font-bold`}>•</span>
                <span>You can also search by name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`${theme.text} font-bold`}>•</span>
                <span>No phone numbers needed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`${theme.text} font-bold`}>•</span>
                <span>Real people, real connections</span>
              </li>
            </ul>
          </div>

          {/* Card 2: People You May Know (Connected to real DB suggestions) */}
          <div
            className={`p-5 rounded-3xl border shadow-sm ${
              isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h3
                className={`text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                People You May Know
              </h3>
              <button
                onClick={() => {
                  if (onNavigateTab) {
                    onNavigateTab('Requests');
                  } else {
                    showToast('Navigating to Friend Requests...');
                  }
                }}
                className={`text-xs ${theme.text} ${theme.textHover} font-semibold flex items-center gap-1 cursor-pointer hover:underline`}
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-white/[0.04] pt-1">
              {loadingSuggestions ? (
                <div className="py-6 text-center">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin mx-auto mb-1" />
                  <p className="text-[11px] text-slate-400">Finding suggestions...</p>
                </div>
              ) : peopleYouMayKnow.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  <UserCheck className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                  <p>All registered users are already in your network!</p>
                </div>
              ) : (
                peopleYouMayKnow.map((person) => (
                  <div
                    key={person.id}
                    className="py-3 flex items-center justify-between gap-3 group"
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 cursor-pointer"
                      onClick={() => setPreviewUser(person)}
                    >
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className={`w-10 h-10 rounded-full object-cover border ${theme.borderLight} shrink-0 transition-transform group-hover:scale-105`}
                        onError={(e) => {
                          e.target.src = '/images/dashboard/user_avatar.jpg';
                        }}
                      />
                      <div className="min-w-0">
                        <h4
                          className={`text-xs font-bold truncate transition-colors ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {person.name}
                        </h4>
                        <p
                          className={`text-[10px] truncate ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          @{person.username}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {person.mutual}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAddSuggested(person.id, person.name)}
                        disabled={person.added}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          person.added
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : `${theme.btnSolid} shadow-md shadow-blue-500/20`
                        }`}
                      >
                        {person.added ? 'Sent ✓' : 'Add Friend'}
                      </button>

                      <button
                        onClick={() => setPreviewUser(person)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isDark
                            ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="More details"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div
            className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
              isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
            }`}
          >
            <h3
              className={`text-base font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Quick Actions
            </h3>

            <div className="space-y-2">
              {/* Contacts Sync */}
              <div
                onClick={() => setShowSyncModal(true)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isDark
                    ? `bg-[#0E1225] border-white/[0.06] hover:bg-white/[0.05] ${theme.borderHover}`
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl ${theme.badge} flex items-center justify-center shrink-0`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`text-xs font-bold truncate transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Contacts Sync
                    </h4>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Find people from your contacts
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Invite Friends */}
              <div
                onClick={() => {
                  const inviteUrl = `${window.location.origin}/#register?ref=connectx`;
                  navigator.clipboard?.writeText(inviteUrl);
                  showToast('Invite link copied! Share with your friends 🚀');
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isDark
                    ? `bg-[#0E1225] border-white/[0.06] hover:bg-white/[0.05] ${theme.borderHover}`
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`text-xs font-bold truncate transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Invite Friends
                    </h4>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Share your profile and invite others
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: ADVANCED FILTERS MODAL ================= */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 space-y-5 shadow-2xl ${
              isDark
                ? 'bg-[#0E1229] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-extrabold">Filter Results</h3>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Online status toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Online Status</p>
                  <p className="text-[11px] text-slate-400">Only show active users</p>
                </div>
                <button
                  onClick={() => setFilterOnlineOnly(!filterOnlineOnly)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    filterOnlineOnly ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      filterOnlineOnly ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Minimum Mutual Friends */}
              <div className="space-y-1.5">
                <p className="font-bold">Minimum Mutual Friends</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 10, 15].map((val) => (
                    <button
                      key={val}
                      onClick={() => setFilterMinMutual(val)}
                      className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                        filterMinMutual === val
                          ? 'bg-blue-600 text-white border-blue-500'
                          : isDark
                          ? 'bg-white/[0.04] border-white/[0.08] text-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {val === 0 ? 'Any' : `${val}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest / Tag filter */}
              <div className="space-y-1.5">
                <p className="font-bold">Filter by Interest Tag</p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {[
                    'All',
                    'Tech',
                    'Travel',
                    'Music',
                    'Photography',
                    'Design',
                    'Art',
                    'Fitness',
                    'Food',
                    'Books',
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTagFilter(tag)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                        selectedTagFilter.toLowerCase() === tag.toLowerCase()
                          ? 'bg-blue-600 text-white border-blue-500'
                          : isDark
                          ? 'bg-white/[0.04] border-white/[0.08] text-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  setFilterOnlineOnly(false);
                  setFilterMinMutual(0);
                  setSelectedTagFilter('All');
                }}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                  isDark
                    ? 'border-white/10 text-slate-400 hover:text-white'
                    : 'border-slate-200 text-slate-600 hover:text-black'
                }`}
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setShowFilterModal(false);
                  showToast('Filters applied!');
                }}
                className={`flex-1 py-2.5 rounded-xl ${theme.btnSolid} text-white text-xs font-bold shadow-lg shadow-blue-500/25 cursor-pointer`}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: USER PROFILE PREVIEW MODAL ================= */}
      {previewUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl border overflow-hidden shadow-2xl relative ${
              isDark
                ? 'bg-[#0E1229] border-white/10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
                : 'bg-white border-slate-200 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.18)]'
            }`}
          >
            {/* Cover Banner */}
            <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative p-4 flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                ConnectX Profile
              </span>
              <button
                onClick={() => setPreviewUser(null)}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar & Info */}
            <div className="p-6 pt-0 relative space-y-4">
              <div className="flex items-end justify-between -mt-12 mb-2">
                <div className="relative">
                  <img
                    src={previewUser.avatar}
                    alt={previewUser.name}
                    className={`w-20 h-20 rounded-full object-cover border-4 ${
                      isDark ? 'border-[#0E1229]' : 'border-white'
                    } shadow-xl`}
                    onError={(e) => {
                      e.target.src = '/images/dashboard/user_avatar.jpg';
                    }}
                  />
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ${
                      isDark ? 'ring-[#0E1229]' : 'ring-white'
                    } ${isUserOnline(previewUser.id, previewUser.online) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-400'}`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(previewUser)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      previewUser.isFavorite
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : isDark
                        ? 'bg-white/[0.06] border-white/10 text-slate-300 hover:text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${previewUser.isFavorite ? 'fill-amber-400' : ''}`}
                    />
                  </button>

                  <button
                    onClick={() => {
                      handleCopyProfileLink(previewUser.username);
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isDark
                        ? 'bg-white/[0.06] border-white/10 text-slate-300 hover:text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                    title="Copy Profile Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold">{previewUser.name}</h2>
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                </div>
                <p className="text-xs text-blue-400 font-semibold">@{previewUser.username}</p>
                <p
                  className={`text-xs mt-2 leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {previewUser.bio}
                </p>
              </div>

              {/* Tags */}
              {previewUser.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {previewUser.tags.map((t) => (
                    <span
                      key={t}
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        isDark
                          ? 'bg-white/[0.04] border-white/10 text-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons: Message, Call, and Add Friend */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => {
                    setPreviewUser(null);
                    handleStartMessage(previewUser);
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold ${theme.btnSolid} text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => {
                    setPreviewUser(null);
                    handleStartCall(previewUser, false);
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'bg-white/[0.06] border-white/10 text-slate-200 hover:bg-white/10'
                      : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>

                {previewUser.isFriend ? (
                  <div className="py-2.5 px-3 rounded-2xl text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Friends</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleSendRequest(previewUser.id, previewUser.name);
                    }}
                    disabled={previewUser.requested || previewUser.added}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      previewUser.requested || previewUser.added
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                    }`}
                  >
                    {previewUser.requested || previewUser.added ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Sent ✓</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Request</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CONTACTS SYNC & INVITE MODAL ================= */}
      {showSyncModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 space-y-4 shadow-2xl ${
              isDark
                ? 'bg-[#0E1229] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold">Device Contacts & Invites</h3>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="p-1 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              ConnectX allows you to invite friends directly or sync registered peers without publishing private phone numbers.
            </p>

            {/* Invite by Email / Username input */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-300">Invite a friend by email</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDark
                        ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <button
                  onClick={() => {
                    if (!inviteEmail || !inviteEmail.includes('@')) {
                      showToast('Please enter a valid email address');
                      return;
                    }
                    showToast(`Invitation sent to ${inviteEmail}!`);
                    setInviteEmail('');
                  }}
                  className={`px-4 py-2 rounded-xl ${theme.btnSolid} text-white text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* Quick Share Link */}
            <div
              className={`p-3.5 rounded-2xl border space-y-2 ${
                isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Your Personal Invite Link</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={`${window.location.origin}/#register?ref=connectx`}
                  className={`flex-1 text-[11px] px-3 py-1.5 rounded-xl border bg-black/20 border-white/10 text-slate-400 select-all focus:outline-none`}
                />
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `${window.location.origin}/#register?ref=connectx`
                    );
                    showToast('Invite link copied to clipboard!');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${theme.btnSolid} text-white cursor-pointer`}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center gap-2">
              <button
                onClick={() => {
                  setShowSyncModal(false);
                  loadFriends();
                  loadSuggestions();
                  showToast('Contacts synced with real ConnectX network!');
                }}
                className={`w-full py-2.5 rounded-xl ${theme.btnSolid} text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Contacts with Network</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
