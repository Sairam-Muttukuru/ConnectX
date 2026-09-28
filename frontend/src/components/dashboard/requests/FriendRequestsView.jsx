import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  ChevronRight,
  Share2,
  BookOpen,
  ArrowUpDown,
  UserPlus,
  Check,
  X,
  Send,
  Loader2,
  Sparkles,
  UserCheck,
  Clock,
} from 'lucide-react';
import { getAccentTheme } from '../../../utils/themeHelper';
import dashboardService from '../../../services/dashboardService';
import { useToast } from '../../../context/ToastContext';

export default function FriendRequestsView({ isDark = true, onNavigateTab, accentColor = 'purple' }) {
  const { showToast } = useToast();
  const theme = getAccentTheme(accentColor);
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent' | 'suggestions'
  const [sortBy, setSortBy] = useState('Newest first');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Real Database State
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const loadAllRequests = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes, sugRes] = await Promise.all([
        dashboardService.getReceivedRequests(),
        dashboardService.getSentRequests(),
        dashboardService.getSuggestions(),
      ]);

      const recList = Array.isArray(recRes?.data) ? recRes.data : Array.isArray(recRes) ? recRes : [];
      const sentList = Array.isArray(sentRes?.data) ? sentRes.data : Array.isArray(sentRes) ? sentRes : [];
      const sugList = Array.isArray(sugRes?.data) ? sugRes.data : Array.isArray(sugRes) ? sugRes : [];

      setReceivedRequests(recList);
      setSentRequests(sentList);
      setSuggestions(sugList);
    } catch (err) {
      console.warn('Error loading friend requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllRequests();
  }, []);

  const handleAccept = async (reqId, name) => {
    setProcessingId(reqId);
    try {
      await dashboardService.acceptFriendRequest(reqId);
      setReceivedRequests((prev) => prev.filter((r) => r.id !== reqId));
      showToast(`Accepted friend request from ${name}!`);
      window.dispatchEvent(new CustomEvent('connectx_refresh_metrics'));
    } catch (err) {
      showToast(err.message || 'Failed to accept friend request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reqId, name) => {
    setProcessingId(reqId);
    try {
      await dashboardService.declineFriendRequest(reqId);
      setReceivedRequests((prev) => prev.filter((r) => r.id !== reqId));
      showToast(`Declined friend request from ${name}`);
      window.dispatchEvent(new CustomEvent('connectx_refresh_metrics'));
    } catch (err) {
      showToast(err.message || 'Failed to decline friend request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelSent = async (reqId, name) => {
    setProcessingId(reqId);
    try {
      await dashboardService.cancelSentRequest(reqId);
      setSentRequests((prev) => prev.filter((s) => s.id !== reqId));
      showToast(`Cancelled request to ${name}`);
      window.dispatchEvent(new CustomEvent('connectx_refresh_metrics'));
    } catch (err) {
      showToast(err.message || 'Failed to cancel request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleAddFriend = async (targetUser) => {
    const targetId = targetUser.id;
    const targetName = targetUser.displayName || targetUser.username;
    setProcessingId(targetId);
    try {
      await dashboardService.sendFriendRequest(targetId);
      setSuggestions((prev) =>
        prev.map((s) => (s.id === targetId ? { ...s, isPending: true } : s))
      );
      showToast(`Friend request sent to @${targetUser.username}!`);
      window.dispatchEvent(new CustomEvent('connectx_refresh_metrics'));

      // Refresh sent requests
      const sentRes = await dashboardService.getSentRequests();
      const sentList = Array.isArray(sentRes?.data) ? sentRes.data : Array.isArray(sentRes) ? sentRes : [];
      setSentRequests(sentList);
    } catch (err) {
      showToast(err.message || 'Failed to send friend request');
    } finally {
      setProcessingId(null);
    }
  };

  // Sort logic
  const sortItems = (items) => {
    const copy = [...items];
    if (sortBy === 'Name A-Z') {
      return copy.sort((a, b) => (a.name || a.displayName || '').localeCompare(b.name || b.displayName || ''));
    }
    if (sortBy === 'Oldest first') {
      return copy.reverse();
    }
    // Default: Newest first
    return copy;
  };

  const sortedReceived = sortItems(receivedRequests);
  const sortedSent = sortItems(sentRequests);

  return (
    <div className="p-4 sm:p-7 max-w-[1520px] w-full mx-auto space-y-6">
      {/* Grid Layout: Left Main Column (Col Span 8) + Right Column (Col Span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT MAIN AREA (Col Span 8): Friend Requests ================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* Header Title & Subtitle */}
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Friend Requests
            </h1>
            <p className={`text-xs sm:text-sm mt-1 font-normal ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Manage your incoming and outgoing requests with real-time network sync.
            </p>
          </div>

          {/* Filter Tabs + Sort By Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            {/* Tabs: Received, Sent, Suggestions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('received')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'received'
                    ? `${theme.btn} text-white shadow-lg`
                    : isDark
                    ? 'bg-[#0E1225] text-slate-300 hover:text-white border border-white/[0.08]'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Received ({receivedRequests.length})
              </button>

              <button
                onClick={() => setActiveTab('sent')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'sent'
                    ? `${theme.btn} text-white shadow-lg`
                    : isDark
                    ? 'bg-[#0E1225] text-slate-300 hover:text-white border border-white/[0.08]'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Sent ({sentRequests.length})
              </button>

              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'suggestions'
                    ? `${theme.btn} text-white shadow-lg`
                    : isDark
                    ? 'bg-[#0E1225] text-slate-300 hover:text-white border border-white/[0.08]'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Suggestions ({suggestions.length})
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#0E1225] border-white/[0.08] text-slate-300 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>{sortBy}</span>
                <span className="text-slate-400 text-[10px]">▼</span>
              </button>

              {showSortDropdown && (
                <div className={`absolute right-0 top-full mt-2 w-44 rounded-2xl border py-1.5 shadow-2xl z-40 ${
                  isDark
                    ? 'bg-[#0E1229] border-white/10 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {['Newest first', 'Oldest first', 'Name A-Z'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortBy(opt);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        sortBy === opt
                          ? `${theme.badge} font-bold`
                          : isDark
                          ? 'hover:bg-white/[0.06] text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      {sortBy === opt && <Check className={`w-3.5 h-3.5 ${theme.text}`} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* List Container */}
          <div className="space-y-3 pt-2">
            {loading ? (
              <div className={`p-12 text-center rounded-3xl border flex flex-col items-center justify-center gap-3 ${
                isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
              }`}>
                <Loader2 className={`w-7 h-7 animate-spin ${theme.text}`} />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Loading requests from database...
                </p>
              </div>
            ) : (
              <>
                {/* 1. RECEIVED REQUESTS */}
                {activeTab === 'received' && (
                  <>
                    {sortedReceived.length === 0 ? (
                      <div className={`p-12 text-center rounded-3xl border flex flex-col items-center justify-center ${
                        isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                      }`}>
                        <div className={`w-14 h-14 rounded-2xl ${theme.badge} flex items-center justify-center mb-4`}>
                          <UserPlus className="w-7 h-7" />
                        </div>
                        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          No Pending Friend Requests
                        </h3>
                        <p className={`text-xs mt-1.5 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          When other ConnectX users send you a friend request, they will appear here instantly.
                        </p>
                        <button
                          onClick={() => setActiveTab('suggestions')}
                          className={`mt-4 px-5 py-2.5 rounded-xl ${theme.btn} text-white font-bold text-xs shadow-md transition-all cursor-pointer`}
                        >
                          Discover People
                        </button>
                      </div>
                    ) : (
                      sortedReceived.map((req) => (
                        <div
                          key={req.id}
                          className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                            isDark
                              ? `bg-[#0A0D1F]/90 border-white/[0.08] ${theme.borderHover}`
                              : `bg-white border-slate-200 ${theme.borderHover} shadow-xs`
                          }`}
                        >
                          {/* Avatar + Info */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={req.avatar || '/images/boy_1.jpg'}
                                alt={req.name}
                                className={`w-13 h-13 rounded-full object-cover border-2 ${theme.borderLight}`}
                                onError={(e) => {
                                  e.target.src = '/images/boy_1.jpg';
                                }}
                              />
                              {req.online && (
                                <span className={`absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ${
                                  isDark ? 'ring-[#0A0D1F]' : 'ring-white'
                                }`} />
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3 className={`text-sm sm:text-base font-bold truncate transition-colors ${
                                isDark ? 'text-white' : 'text-slate-900'
                              }`}>
                                {req.name}
                              </h3>
                              <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                @{req.username}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs truncate">
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Users className="w-3.5 h-3.5" />
                                  <span>{req.mutual || 'ConnectX member'}</span>
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                                  {req.time || 'Recently'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Accept, Reject */}
                          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => handleAccept(req.id, req.name)}
                              disabled={processingId === req.id}
                              className={`px-6 py-2.5 rounded-xl ${theme.btn} hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-1.5`}
                            >
                              {processingId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              <span>Accept</span>
                            </button>

                            <button
                              onClick={() => handleReject(req.id, req.name)}
                              disabled={processingId === req.id}
                              className={`px-6 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 disabled:opacity-50 ${
                                isDark
                                  ? 'bg-[#0E1225] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {/* 2. SENT REQUESTS */}
                {activeTab === 'sent' && (
                  <>
                    {sortedSent.length === 0 ? (
                      <div className={`p-12 text-center rounded-3xl border flex flex-col items-center justify-center ${
                        isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                      }`}>
                        <div className={`w-14 h-14 rounded-2xl ${theme.badge} flex items-center justify-center mb-4`}>
                          <Send className="w-7 h-7" />
                        </div>
                        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          No Sent Friend Requests
                        </h3>
                        <p className={`text-xs mt-1.5 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          You have no pending requests sent to other members. Find people you know and expand your network.
                        </p>
                        <button
                          onClick={() => setActiveTab('suggestions')}
                          className={`mt-4 px-5 py-2.5 rounded-xl ${theme.btn} text-white font-bold text-xs shadow-md transition-all cursor-pointer`}
                        >
                          View Suggested People
                        </button>
                      </div>
                    ) : (
                      sortedSent.map((sent) => (
                        <div
                          key={sent.id}
                          className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                            isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={sent.avatar || '/images/boy_3.jpg'}
                              alt={sent.name}
                              className={`w-12 h-12 rounded-full object-cover border ${theme.borderLight}`}
                              onError={(e) => {
                                e.target.src = '/images/boy_3.jpg';
                              }}
                            />
                            <div className="min-w-0">
                              <h3 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {sent.name}
                              </h3>
                              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                @{sent.username}
                              </p>
                              <span className={`text-[11px] ${theme.text} font-medium mt-0.5 block flex items-center gap-1`}>
                                <Clock className="w-3 h-3" />
                                <span>Request sent {sent.time || 'recently'}</span>
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleCancelSent(sent.id, sent.name)}
                            disabled={processingId === sent.id}
                            className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
                              isDark
                                ? 'bg-[#0E1225] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border-white/10'
                                : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200'
                            }`}
                          >
                            {processingId === sent.id ? 'Cancelling...' : 'Cancel Request'}
                          </button>
                        </div>
                      ))
                    )}
                  </>
                )}

                {/* 3. SUGGESTIONS */}
                {activeTab === 'suggestions' && (
                  <>
                    {suggestions.length === 0 ? (
                      <div className={`p-12 text-center rounded-3xl border flex flex-col items-center justify-center ${
                        isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                      }`}>
                        <div className={`w-14 h-14 rounded-2xl ${theme.badge} flex items-center justify-center mb-4`}>
                          <Sparkles className="w-7 h-7" />
                        </div>
                        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          No New Suggestions
                        </h3>
                        <p className={`text-xs mt-1.5 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          You are already connected or in contact with registered members on ConnectX!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {suggestions.map((sug) => {
                          const sugName = sug.displayName || sug.username;
                          return (
                            <div
                              key={sug.id}
                              className={`p-4 rounded-3xl border transition-all flex items-center justify-between gap-3 ${
                                isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200 shadow-xs'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={sug.avatarUrl || '/images/boy_2.jpg'}
                                  alt={sugName}
                                  className={`w-11 h-11 rounded-full object-cover border ${theme.borderLight} shrink-0`}
                                  onError={(e) => {
                                    e.target.src = '/images/boy_2.jpg';
                                  }}
                                />
                                <div className="min-w-0">
                                  <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {sugName}
                                  </h4>
                                  <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    @{sug.username}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                    {sug.bio || 'ConnectX member'}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddFriend(sug)}
                                disabled={sug.isPending || processingId === sug.id}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                  sug.isPending
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : `${theme.btnSolid} text-white shadow-md active:scale-95`
                                }`}
                              >
                                {sug.isPending ? 'Sent ✓' : processingId === sug.id ? 'Sending...' : 'Add Friend'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN (Col Span 4): People You May Know + Find Friends ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: People You May Know */}
          <div className={`p-5 rounded-3xl border shadow-sm ${
            isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                People You May Know
              </h2>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`text-xs ${theme.text} ${theme.textHover} font-semibold flex items-center gap-1 cursor-pointer`}
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-white/[0.04] pt-1">
              {suggestions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No new suggestions available.
                </div>
              ) : (
                suggestions.slice(0, 5).map((person) => {
                  const pName = person.displayName || person.username;
                  return (
                    <div key={person.id} className="py-3 flex items-center justify-between gap-3 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={person.avatarUrl || '/images/boy_2.jpg'}
                            alt={pName}
                            className={`w-10 h-10 rounded-full object-cover border ${theme.borderLight}`}
                            onError={(e) => {
                              e.target.src = '/images/boy_2.jpg';
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold truncate transition-colors ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {pName}
                          </h4>
                          <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            @{person.username}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400 truncate">
                            <span>{person.bio || 'ConnectX member'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleAddFriend(person)}
                          disabled={person.isPending || processingId === person.id}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            person.isPending
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : `${theme.btnSolid} text-white shadow-md active:scale-95`
                          }`}
                        >
                          {person.isPending ? 'Sent ✓' : processingId === person.id ? '...' : 'Add Friend'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card 2: Find Friends */}
          <div className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
            isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2 pb-2">
              <div className={`w-7 h-7 rounded-xl ${theme.badge} flex items-center justify-center`}>
                <Users className="w-4 h-4" />
              </div>
              <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Find Friends
              </h2>
            </div>

            <div className="space-y-2">
              {/* Option 1: Search by username */}
              <div
                onClick={() => onNavigateTab && onNavigateTab('Contacts')}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isDark
                    ? `bg-[#0E1225] border-white/[0.06] hover:bg-white/[0.05] ${theme.borderHover}`
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold truncate transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Search by username
                    </h4>
                    <p className={`text-[10px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Find and connect with people
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Option 2: Contacts Sync */}
              <div
                onClick={() => showToast('Contacts synced with your ConnectX network')}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isDark
                    ? `bg-[#0E1225] border-white/[0.06] hover:bg-white/[0.05] ${theme.borderHover}`
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${theme.badge} flex items-center justify-center shrink-0`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold truncate transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Contacts Sync
                    </h4>
                    <p className={`text-[10px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Find people from your contacts
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Option 3: Invite Friends */}
              <div
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.origin);
                  showToast('Invite link copied to clipboard!');
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
                    <h4 className={`text-xs font-bold truncate transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Invite Friends
                    </h4>
                    <p className={`text-[10px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
    </div>
  );
}
