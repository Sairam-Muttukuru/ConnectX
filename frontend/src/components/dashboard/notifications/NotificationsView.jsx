import { useState, useEffect } from 'react';
import {
  Bell,
  MessageSquare,
  PhoneMissed,
  AtSign,
  UserPlus,
  Users,
  Heart,
  Settings,
  FileText,
  Check,
  MoreVertical,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  X,
  Loader2,
  UserCheck,
  ShieldCheck,
  Phone,
  Sparkles,
} from 'lucide-react';
import { getAccentTheme } from '../../../utils/themeHelper';
import dashboardService from '../../../services/dashboardService';
import { useToast } from '../../../context/ToastContext';

export default function NotificationsView({ isDark = true, onNavigateTab, accentColor = 'purple' }) {
  const { showToast } = useToast();
  const theme = getAccentTheme(accentColor);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Load real notifications from backend database
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getNotifications();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.warn('Failed to load real notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read!');
  };

  const handleAcceptRequest = async (item) => {
    setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    showToast(`Accepted friend request!`);
    try {
      if (item.requestId) {
        await dashboardService.acceptFriendRequest(item.requestId);
      }
    } catch (err) {
      console.warn('Error accepting request:', err);
    }
  };

  const handleRejectRequest = async (item) => {
    setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    showToast(`Declined friend request`);
    try {
      if (item.requestId) {
        await dashboardService.declineFriendRequest(item.requestId);
      }
    } catch (err) {
      console.warn('Error declining request:', err);
    }
  };

  const friendRequestsCount = notifications.filter((n) => n.category === 'Friend Requests').length;
  const messagesCount = notifications.filter((n) => n.category === 'Messages').length;
  const callsCount = notifications.filter((n) => n.category === 'Calls').length;
  const systemCount = notifications.filter((n) => n.category === 'System').length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'Messages') return n.category === 'Messages';
    if (activeFilter === 'Calls') return n.category === 'Calls';
    if (activeFilter === 'Friend Requests') return n.category === 'Friend Requests';
    if (activeFilter === 'System') return n.category === 'System';
    return true;
  });

  return (
    <div className="p-4 sm:p-7 max-w-[1520px] w-full mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Grid Layout: Left Column (Col Span 8) + Right Column (Col Span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Notifications Column (Col Span 8) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Header Title + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl ${theme.badge} flex items-center justify-center shadow-lg shadow-purple-500/10`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h1
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Notifications
                </h1>
                <p
                  className={`text-xs sm:text-sm mt-0.5 font-normal ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Stay updated with your messages, calls, and friend requests.
                </p>
              </div>
            </div>

            <button
              onClick={handleMarkAllRead}
              className={`self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#0E1225] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-blue-400" />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Sub-tabs Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'All', label: `All (${notifications.length})` },
              { id: 'Friend Requests', label: `Friend Requests (${friendRequestsCount})` },
              { id: 'Messages', label: `Messages (${messagesCount})` },
              { id: 'Calls', label: `Calls (${callsCount})` },
              { id: 'System', label: `System (${systemCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeFilter === tab.id
                    ? `${theme.btnSolid} font-bold shadow-md shadow-purple-500/20 text-white`
                    : isDark
                    ? 'bg-[#0E1225] text-slate-300 hover:text-white border border-white/[0.08]'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications Feed */}
          <div className="space-y-3 pt-1">
            {loading ? (
              <div
                className={`p-12 text-center rounded-3xl border space-y-3 ${
                  isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                }`}
              >
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Loading notifications from database...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div
                className={`p-12 text-center rounded-3xl border space-y-3 ${
                  isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center">
                  <Bell className="w-6 h-6" />
                </div>
                <h3
                  className={`text-base font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  No notifications
                </h3>
                <p
                  className={`text-xs max-w-sm mx-auto ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  You're all caught up! When you receive new friend requests or messages, they will appear here.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                    isDark
                      ? `bg-[#0A0D1F]/90 border-white/[0.08] ${theme.borderHover}`
                      : `bg-white border-slate-200 ${theme.borderHover} shadow-xs`
                  } ${item.unread ? (isDark ? 'border-l-4 border-l-purple-500' : 'border-l-4 border-l-purple-500') : ''}`}
                >
                  {/* Left: Avatar + Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={item.avatar || '/images/boy_1.jpg'}
                        alt={item.title}
                        className={`w-12 h-12 rounded-full object-cover border ${theme.borderLight}`}
                        onError={(e) => {
                          e.target.src = '/images/boy_1.jpg';
                        }}
                      />
                      {item.unread && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-[#0A0D1F]" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-sm font-extrabold truncate ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {item.title}
                        </h4>
                        {item.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                        )}
                      </div>
                      <p
                        className={`text-xs truncate ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {item.desc}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {item.time}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {item.isRequest ? (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(item)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer transition-all active:scale-95"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(item)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isDark
                              ? 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Reject
                        </button>
                      </>
                    ) : item.category === 'Messages' ? (
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('Messages')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isDark
                            ? 'bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/10'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="View message"
                      >
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                      </button>
                    ) : item.category === 'Calls' ? (
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('Calls')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isDark
                            ? 'bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/10'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Call back"
                      >
                        <Phone className="w-4 h-4 text-emerald-400" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar Column (Col Span 4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Notification Filters Summary Card */}
          <div
            className={`p-5 rounded-3xl border shadow-sm ${
              isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
            }`}
          >
            <h3
              className={`text-base font-bold pb-3 border-b border-white/[0.06] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Notification Filters
            </h3>

            <div className="divide-y divide-white/[0.04] pt-2 space-y-1">
              {[
                { label: 'All Notifications', count: notifications.length, key: 'All' },
                { label: 'Friend Requests', count: friendRequestsCount, key: 'Friend Requests' },
                { label: 'Messages', count: messagesCount, key: 'Messages' },
                { label: 'Calls', count: callsCount, key: 'Calls' },
                { label: 'System Updates', count: systemCount, key: 'System' },
              ].map((f) => (
                <div
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`py-2.5 px-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    activeFilter === f.key
                      ? `${theme.btnSolid} text-white font-bold shadow-md`
                      : isDark
                      ? 'hover:bg-white/[0.04] text-slate-300'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs">{f.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeFilter === f.key
                        ? 'bg-white/20 text-white'
                        : isDark
                        ? 'bg-white/10 text-slate-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {f.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
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
              <div
                onClick={handleMarkAllRead}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isDark
                    ? `bg-[#0E1225] border-white/[0.06] hover:bg-white/[0.05] ${theme.borderHover}`
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Mark all as read
                  </span>
                </div>
              </div>

              <div
                onClick={() => onNavigateTab && onNavigateTab('Settings')}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isDark
                    ? `bg-[#0E1225] border-white/[0.06] hover:bg-white/[0.05] ${theme.borderHover}`
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${theme.badge} flex items-center justify-center`}>
                    <Settings className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Notification settings
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Stay in the Loop Card */}
          <div
            className={`p-5 rounded-3xl border shadow-sm space-y-2.5 ${
              isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-bold">Stay in the Loop</h3>
            </div>
            <p
              className={`text-xs leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Enable notifications to never miss important messages, calls, or friend requests on ConnectX.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
