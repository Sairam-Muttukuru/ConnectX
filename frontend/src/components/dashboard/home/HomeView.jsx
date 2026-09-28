import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  UserPlus,
  Bell,
  ArrowRight,
  MoreVertical,
  Video,
  Phone,
  Zap,
  Calendar,
  Heart,
  Star,
  Edit3,
  CheckCircle2,
  X,
  PhoneCall,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  UserCheck,
  ShieldAlert,
  Send,
  ExternalLink,
  Loader2,
  PhoneMissed,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { getAccentTheme } from '../../../utils/themeHelper';
import dashboardService from '../../../services/dashboardService';
import { authStorage } from '../../../utils/authStorage';
import { useToast } from '../../../context/ToastContext';

export default function HomeView({ user, isDark = true, onNavigateTab, accentColor = 'purple', onMetricsChange }) {
  const { showToast } = useToast();
  const theme = getAccentTheme(accentColor);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [activeRequestMenu, setActiveRequestMenu] = useState(null);
  const [selectedFriendModal, setSelectedFriendModal] = useState(null);
  const [activeCallSession, setActiveCallSession] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCopyHandle = (e) => {
    e?.stopPropagation();
    const handle = `@${user?.username || 'sairam_developer'}`;
    navigator.clipboard?.writeText(handle);
    setCopiedHandle(true);
    showToast(`Handle ${handle} copied to clipboard! Share it with friends.`);
    setTimeout(() => setCopiedHandle(false), 2500);
  };

  // Pure Database State (Initialized to zero/empty, populated exclusively from backend DB)
  const [metrics, setMetrics] = useState({
    unreadMessagesCount: 0,
    friendsCount: 0,
    friendRequestsCount: 0,
    notificationsCount: 0,
    friendAvatars: [],
    extraFriendsText: '',
    requestAvatars: [],
    extraRequestsText: '',
  });

  const [recentConversations, setRecentConversations] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activityItems, setActivityItems] = useState([]);
  
  // Real Call History (from persistent database & local session)
  const currentUserId = user?.id || authStorage.getUser()?.id || 'default';
  const [callHistory, setCallHistory] = useState(() => {
    try {
      const uId = user?.id || authStorage.getUser()?.id || 'default';
      const saved = localStorage.getItem(`connectx_call_history_${uId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    const syncCallHistory = () => {
      try {
        const uId = user?.id || authStorage.getUser()?.id || 'default';
        const saved = localStorage.getItem(`connectx_call_history_${uId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setCallHistory(parsed);
        }
      } catch (e) {
        console.warn('Call history sync error:', e);
      }
    };

    syncCallHistory();
    window.addEventListener('storage', syncCallHistory);
    window.addEventListener('connectx_call_logged', syncCallHistory);
    return () => {
      window.removeEventListener('storage', syncCallHistory);
      window.removeEventListener('connectx_call_logged', syncCallHistory);
    };
  }, [user?.id]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'FRIEND_ACCEPTED':
        return Users;
      case 'FRIEND_REQUEST':
        return UserPlus;
      case 'ONLINE':
        return CheckCircle2;
      case 'LIKE':
        return Heart;
      case 'MESSAGE':
        return MessageSquare;
      case 'PROFILE':
        return Edit3;
      default:
        return Zap;
    }
  };

  const getActivityTab = (type) => {
    switch (type) {
      case 'FRIEND_ACCEPTED':
      case 'ONLINE':
        return 'Contacts';
      case 'FRIEND_REQUEST':
        return 'Requests';
      case 'MESSAGE':
        return 'Messages';
      case 'PROFILE':
        return 'Profile';
      default:
        return 'Notifications';
    }
  };

  // Fetch real data exclusively from the database via backend API
  const loadDashboardData = async () => {
    try {
      const res = await dashboardService.getDashboardHome();
      const data = res?.data || res;

      if (data) {
        if (data.metrics) {
          setMetrics({
            unreadMessagesCount: data.metrics.unreadMessagesCount ?? 0,
            friendsCount: data.metrics.friendsCount ?? 0,
            friendRequestsCount: data.metrics.friendRequestsCount ?? 0,
            notificationsCount: data.metrics.notificationsCount ?? 0,
            friendAvatars: Array.isArray(data.metrics.friendAvatars) ? data.metrics.friendAvatars : [],
            extraFriendsText: data.metrics.extraFriendsText || '',
            requestAvatars: Array.isArray(data.metrics.requestAvatars) ? data.metrics.requestAvatars : [],
            extraRequestsText: data.metrics.extraRequestsText || '',
          });
        }

        setRecentConversations(Array.isArray(data.recentConversations) ? data.recentConversations : []);
        setOnlineFriends(Array.isArray(data.onlineFriends) ? data.onlineFriends : []);
        setRequests(Array.isArray(data.friendRequests) ? data.friendRequests : []);

        if (Array.isArray(data.recentActivity)) {
          const mapped = data.recentActivity.map((a) => ({
            ...a,
            icon: getActivityIcon(a.activityType),
            actionTab: getActivityTab(a.activityType),
          }));
          setActivityItems(mapped);
        } else {
          setActivityItems([]);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard home data from DB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Live real-time clock and calendar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setDateStr(
        now.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Call duration timer
  useEffect(() => {
    let timer = null;
    if (activeCallSession) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCallSession]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayName = user?.displayName || user?.username || 'sairam_developer';

  const hour = new Date().getHours();
  const greetingText =
    hour < 12 ? 'Good Morning,' : hour < 17 ? 'Good Afternoon,' : 'Good Evening,';

  // Real Accept Friend Request Interaction (Persisted to PostgreSQL)
  const handleAcceptRequest = async (id, name) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setMetrics((prev) => ({
      ...prev,
      friendsCount: prev.friendsCount + 1,
      friendRequestsCount: Math.max(0, prev.friendRequestsCount - 1),
    }));
    setActiveRequestMenu(null);
    showToast(`Accepted friend request from ${name}! Added to your Friends list.`);

    try {
      await dashboardService.acceptFriendRequest(id);
      loadDashboardData();
      if (onMetricsChange) onMetricsChange();
    } catch (err) {
      console.error('Accept friend request error:', err);
    }
  };

  // Real Decline Friend Request Interaction (Persisted to PostgreSQL)
  const handleDeclineRequest = async (id, name) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setMetrics((prev) => ({
      ...prev,
      friendRequestsCount: Math.max(0, prev.friendRequestsCount - 1),
    }));
    setActiveRequestMenu(null);
    showToast(`Declined request from ${name}`, 'info');

    try {
      await dashboardService.declineFriendRequest(id);
      loadDashboardData();
      if (onMetricsChange) onMetricsChange();
    } catch (err) {
      console.error('Decline friend request error:', err);
    }
  };

  // Start Call Simulation
  const handleStartCall = (name, avatar, type = 'video') => {
    setActiveCallSession({ name, avatar, type });
    setSelectedFriendModal(null);
    setIsMicMuted(false);
    setIsVideoOff(false);
  };

  const handleEndCall = () => {
    if (activeCallSession) {
      showToast(`Call with ${activeCallSession.name} ended (${formatDuration(callDuration)})`);
      try {
        const uId = user?.id || authStorage.getUser()?.id || 'default';
        const newRecord = {
          id: 'call_' + Date.now(),
          name: activeCallSession.name,
          username: activeCallSession.name.toLowerCase().replace(/\s+/g, '_'),
          avatar: activeCallSession.avatar || '/images/boy_1.jpg',
          type: activeCallSession.type || 'video',
          direction: 'outgoing',
          isMissed: false,
          timestamp: 'Just now',
          duration: formatDuration(callDuration),
        };
        const updated = [newRecord, ...callHistory];
        setCallHistory(updated);
        localStorage.setItem(`connectx_call_history_${uId}`, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('connectx_call_logged'));
      } catch (e) {
        console.warn('Call log save error:', e);
      }
    }
    setActiveCallSession(null);
  };

  return (
    <main className="p-4 sm:p-7 max-w-[1520px] w-full mx-auto space-y-6">
      {/* 1. Header Greeting Area */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden backdrop-blur-xl ${
        isDark
          ? 'bg-gradient-to-br from-[#0B0F24]/95 via-[#0D1230]/90 to-[#070A18]/95 border-white/[0.08] shadow-2xl'
          : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-slate-200/90 shadow-lg'
      }`}>
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live on ConnectX
              </span>
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                • {greetingText}
              </span>
            </div>

            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-3 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span>{displayName}</span>
                <span className="text-3xl sm:text-4xl">👋</span>
              </h1>
              <p className={`text-sm sm:text-base mt-1.5 font-medium max-w-2xl leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Private, phone-free messaging and high-definition calls. Share your handle to start chatting!
              </p>
            </div>

            {/* Quick Identity Pill & Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyHandle}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border transition-all cursor-pointer shadow-sm active:scale-95 ${
                  copiedHandle
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : isDark
                    ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/10 hover:border-white/20'
                    : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-200 shadow-sm'
                }`}
                title="Click to copy your ConnectX handle"
              >
                {copiedHandle ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Handle Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-blue-400" />
                    <span>@{user?.username || 'sairam_developer'}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${
                      isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Copy
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('Messages')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start New Chat</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('Calls')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border transition-all cursor-pointer active:scale-95 ${
                  isDark
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Call Logs</span>
              </button>
            </div>
          </div>

          {/* Right: Modern Clock & Hub Status */}
          <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md shrink-0 flex flex-col justify-center items-start lg:items-end ${
            isDark
              ? 'bg-white/[0.04] border-white/10 text-white'
              : 'bg-white/80 border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <span className={`text-xs sm:text-sm font-semibold tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {dateStr || 'Today'}
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5 font-mono">
              {timeStr || '--:--'}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Encrypted P2P Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Home Content: Recent Conversations & Online Friends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= SECTION 1: Recent Conversations (Col Span 7 on LG, 8 on XL) ================= */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between ${
            isDark ? 'bg-[#0A0D22]/90 border-white/[0.08]' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl ${theme.badge} flex items-center justify-center shadow-inner`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base sm:text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Recent Conversations
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {recentConversations.length > 0 ? `${recentConversations.length} Active Chats` : 'Direct Messages'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('Messages')}
                  className={`text-sm ${theme.text} ${theme.textHover} font-bold flex items-center gap-1.5 cursor-pointer hover:underline group`}
                >
                  <span>Open Messages</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Conversations List */}
              {recentConversations.length === 0 ? (
                <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 rounded-3xl ${theme.badge} flex items-center justify-center shadow-inner`}>
                      <MessageSquare className="w-8 h-8 opacity-80" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      +
                    </span>
                  </div>
                  <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    No conversations yet
                  </h3>
                  <p className={`text-sm mt-2 max-w-[280px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Find friends with their username or share your handle to start chatting in real time.
                  </p>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('Messages')}
                    className="mt-6 px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Start a Chat</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06] mt-2">
                  {recentConversations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onNavigateTab && onNavigateTab('Messages')}
                      className={`py-4 px-3 sm:px-4 flex items-center justify-between gap-4 group transition-all cursor-pointer rounded-2xl ${
                        isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className={`w-12 h-12 rounded-full object-cover border-2 ${theme.borderLight}`}
                            onError={(e) => {
                              e.target.src = '/images/dashboard/user_avatar.jpg';
                            }}
                          />
                          {c.online && (
                            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ${
                              isDark ? 'ring-[#0A0D22]' : 'ring-white'
                            }`} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className={`text-sm sm:text-base font-bold truncate group-hover:${theme.text} transition-colors ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {c.name}
                          </h4>
                          <p className={`text-xs sm:text-sm truncate mt-0.5 ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {c.lastMessage}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {c.time}
                        </span>
                        {c.unread > 0 ? (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                            {c.unread}
                          </span>
                        ) : (
                          <span className="w-5 h-5 opacity-0"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: Online Friends (Col Span 5 on LG, 4 on XL) ================= */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between ${
            isDark ? 'bg-[#0A0D22]/90 border-white/[0.08]' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h2 className={`text-base sm:text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Online Friends
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {onlineFriends.length > 0 ? `${onlineFriends.length} Active Now` : 'No friends active'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('Contacts')}
                  className={`text-sm ${theme.text} ${theme.textHover} font-bold flex items-center gap-1.5 cursor-pointer hover:underline group`}
                >
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Online Friends List / Empty State */}
              {onlineFriends.length === 0 ? (
                <div className="py-14 px-4 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    No friends online right now
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1.5 max-w-[260px] mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Connect with friends to see their live status and start instant audio or video calls!
                  </p>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('Contacts')}
                    className="mt-5 px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all cursor-pointer shadow-lg shadow-emerald-600/30 active:scale-95 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Find Friends</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06] mt-2">
                  {onlineFriends.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFriendModal(f)}
                      className={`py-3.5 px-3 flex items-center justify-between gap-3 group transition-all cursor-pointer rounded-2xl ${
                        isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={f.avatar}
                            alt={f.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 group-hover:scale-105 transition-all shadow-md shadow-emerald-500/20"
                            onError={(e) => {
                              e.target.src = '/images/dashboard/user_avatar.jpg';
                            }}
                          />
                          <span className={`absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ${
                            isDark ? 'ring-[#0A0D22]' : 'ring-white'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-bold truncate group-hover:${theme.text} transition-colors ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {f.name}
                          </h4>
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active now
                          </span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateTab && onNavigateTab('Messages');
                          }}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isDark ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                          title={`Message ${f.name}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartCall(f.name, f.avatar, 'video')}
                          className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 transition-all cursor-pointer"
                          title={`Video call ${f.name}`}
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* ================= MODAL: Online Friend Action Popover ================= */}
      {selectedFriendModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 border shadow-2xl backdrop-blur-2xl relative ${
            isDark ? 'bg-[#0B0F22]/95 border-white/10 text-white' : 'bg-white border-slate-200 text-black'
          }`}>
            <button
              onClick={() => setSelectedFriendModal(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-full cursor-pointer ${
                isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={selectedFriendModal.avatar}
                  alt={selectedFriendModal.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
                  onError={(e) => {
                    e.target.src = '/images/dashboard/user_avatar.jpg';
                  }}
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-black" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">{selectedFriendModal.name}</h3>
              <p className="text-sm text-emerald-400 font-semibold flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                Active now on ConnectX
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <button
                  onClick={() => {
                    setSelectedFriendModal(null);
                    onNavigateTab && onNavigateTab('Messages');
                  }}
                  className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/30 transition-transform active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
                <button
                  onClick={() => handleStartCall(selectedFriendModal.name, selectedFriendModal.avatar, 'video')}
                  className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Video Call</span>
                </button>
                <button
                  onClick={() => handleStartCall(selectedFriendModal.name, selectedFriendModal.avatar, 'audio')}
                  className={`py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-transform active:scale-95 cursor-pointer ${
                    isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-slate-100 hover:bg-slate-200 text-black'
                  }`}
                >
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>Audio Call</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedFriendModal(null);
                    onNavigateTab && onNavigateTab('Contacts');
                  }}
                  className={`py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-transform active:scale-95 cursor-pointer ${
                    isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-slate-100 hover:bg-slate-200 text-black'
                  }`}
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Profile Info</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HD Call Simulation ================= */}
      {activeCallSession && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#090C1A] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Ambient Aura */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />

            {/* Top Bar */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {activeCallSession.type === 'video' ? 'HD Video Call' : 'Encrypted Audio Call'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full">
                {formatDuration(callDuration)}
              </span>
            </div>

            {/* Call Centerpiece */}
            <div className="py-10 flex flex-col items-center text-center z-10">
              <div className="relative mb-5">
                <img
                  src={activeCallSession.avatar}
                  alt={activeCallSession.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                  onError={(e) => {
                    e.target.src = '/images/dashboard/user_avatar.jpg';
                  }}
                />
                <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                  <PhoneCall className="w-3 h-3 text-white" />
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">{activeCallSession.name}</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Connected • Real-time Peer-to-Peer</p>
            </div>

            {/* Call Controls */}
            <div className="flex items-center gap-4 sm:gap-6 z-10 mt-2">
              <button
                type="button"
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-4 rounded-full transition-all cursor-pointer ${
                  isMicMuted ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-4 rounded-full transition-all cursor-pointer ${
                  isVideoOff ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={handleEndCall}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/50 transition-all cursor-pointer active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
