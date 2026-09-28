import { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Video,
  ArrowUpRight,
  ArrowDownLeft,
  PhoneMissed,
  MoreVertical,
  Search,
  ArrowRight,
  CheckCircle2,
  X,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  UserPlus,
  Loader2,
  Volume2,
  VolumeX,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { getAccentTheme } from '../../../utils/themeHelper';
import useAuth from '../../../hooks/useAuth';
import dashboardService from '../../../services/dashboardService';
import { useToast } from '../../../context/ToastContext';

export default function CallsView({ isDark = true, onNavigateTab, accentColor = 'purple' }) {
  const { showToast } = useToast();
  const theme = getAccentTheme(accentColor);
  const { user } = useAuth();
  const userId = user?.id || 'user_default';

  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'missed' | 'favorites'
  const [startCallSearch, setStartCallSearch] = useState('');
  const [loadingFriends, setLoadingFriends] = useState(true);

  // Real Database Friends
  const [friends, setFriends] = useState([]);

  // Real Persistent Call History
  const [calls, setCalls] = useState(() => {
    try {
      const saved = localStorage.getItem(`connectx_call_history_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Active Call State (Interactive Calling Modal)
  const [activeCall, setActiveCall] = useState(null); // { contact, mode: 'audio' | 'video', status: 'calling' | 'connected', duration: 0, isMuted: false, isVideoOff: false }
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const localVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const ringtoneOscRef = useRef(null);
  const callTimerRef = useRef(null);

  // Load friends from PostgreSQL
  useEffect(() => {
    let isMounted = true;
    const loadFriends = async () => {
      setLoadingFriends(true);
      try {
        const res = await dashboardService.getFriends();
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (isMounted) {
          setFriends(list);
        }
      } catch (err) {
        console.warn('Failed to load friends:', err);
      } finally {
        if (isMounted) setLoadingFriends(false);
      }
    };
    loadFriends();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save call history to localStorage
  const saveCallHistory = (updatedCalls) => {
    setCalls(updatedCalls);
    try {
      localStorage.setItem(`connectx_call_history_${userId}`, JSON.stringify(updatedCalls));
      window.dispatchEvent(new CustomEvent('connectx_call_logged'));
    } catch (e) {
      console.warn('Could not save call history:', e);
    }
  };

  // Web Audio Ringtone Generator during "Calling..."
  const startRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      ringtoneOscRef.current = { osc, ctx, gain };
    } catch {
      // Audio autoplay may be muted by browser
    }
  };

  const stopRingtone = () => {
    try {
      if (ringtoneOscRef.current) {
        ringtoneOscRef.current.osc?.stop();
        ringtoneOscRef.current.ctx?.close();
        ringtoneOscRef.current = null;
      }
    } catch {
      // ignore
    }
  };

  // Start Call Handler
  const handleStartCall = async (contact, mode = 'video') => {
    if (!contact) return;
    const targetName = contact.displayName || contact.name || contact.username || 'Friend';
    const targetAvatar = contact.avatarUrl || contact.avatar || '/images/boy_1.jpg';

    const newCallSession = {
      contact: {
        id: contact.id,
        name: targetName,
        username: contact.username || targetName.toLowerCase().replace(/\s+/g, '_'),
        avatar: targetAvatar,
      },
      mode,
      status: 'calling', // 'calling' -> 'connected'
      startTime: Date.now(),
    };

    setActiveCall(newCallSession);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);

    // Start ringtone
    startRingtone();

    // If video, attempt camera access
    if (mode === 'video') {
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (camErr) {
        console.warn('Camera access not granted or unavailable:', camErr.message);
      }
    }

    // Connect call after 2 seconds
    setTimeout(() => {
      stopRingtone();
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));

      // Start duration counter
      callTimerRef.current = setInterval(() => {
        setCallDuration((sec) => sec + 1);
      }, 1000);
    }, 2200);
  };

  // End Call Handler
  const handleEndCall = () => {
    stopRingtone();
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (activeCall) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const durationStr =
        callDuration > 0
          ? `${Math.floor(callDuration / 60)} min ${String(callDuration % 60).padStart(2, '0')} sec`
          : '32 sec';

      const newRecord = {
        id: `call_${Date.now()}`,
        contactId: activeCall.contact.id,
        name: activeCall.contact.name,
        handle: `@${activeCall.contact.username}`,
        avatar: activeCall.contact.avatar,
        type: 'outgoing',
        mode: activeCall.mode,
        label: `Outgoing ${activeCall.mode === 'video' ? 'Video' : 'Audio'} Call`,
        duration: durationStr,
        time: timeStr,
        date: 'Today',
        timestamp: Date.now(),
        isMissed: false,
      };

      saveCallHistory([newRecord, ...calls]);
      showToast(`Call ended with ${activeCall.contact.name} (${durationStr})`);
    }

    setActiveCall(null);
    setCallDuration(0);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Format seconds to mm:ss
  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Delete Call Log
  const handleDeleteCall = (callId, e) => {
    e?.stopPropagation();
    const updated = calls.filter((c) => c.id !== callId);
    saveCallHistory(updated);
    showToast('Call log removed');
  };

  // Clear All Call History
  const handleClearAllHistory = () => {
    saveCallHistory([]);
    showToast('All call history cleared');
  };

  // Filtered Friends for "Start a Call" search
  const filteredFriends = friends.filter((f) => {
    const query = startCallSearch.toLowerCase().trim();
    if (!query) return true;
    const name = (f.displayName || f.name || '').toLowerCase();
    const username = (f.username || '').toLowerCase();
    return name.includes(query) || username.includes(query);
  });

  // Filter calls by tab
  const displayCalls = calls.filter((c) => {
    if (activeTab === 'missed') return c.isMissed;
    if (activeTab === 'favorites') return c.isFavorite;
    return true;
  });

  // Group calls by date
  const groupedCalls = displayCalls.reduce((acc, call) => {
    const group = call.date || 'Recent';
    if (!acc[group]) acc[group] = [];
    acc[group].push(call);
    return acc;
  }, {});

  return (
    <div className="p-4 sm:p-7 max-w-[1520px] w-full mx-auto space-y-6">
      {/* 1. Header Area with Start Call Button */}

      {/* ================= ACTIVE CALL MODAL (Audio / Video Call Overlay) ================= */}
      {activeCall && (
        <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#090D1F] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center p-6 sm:p-8 text-center">
            {/* Ambient background glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${theme.badge} rounded-full blur-[100px] pointer-events-none opacity-40`} />

            {/* Mode Tag */}
            <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white mb-6">
              {activeCall.mode === 'video' ? <Video className="w-3.5 h-3.5 text-purple-400" /> : <Phone className="w-3.5 h-3.5 text-blue-400" />}
              <span className="uppercase tracking-wider">ConnectX {activeCall.mode} call</span>
            </div>

            {/* Video preview feed or Avatar ring */}
            {activeCall.mode === 'video' && !isVideoOff ? (
              <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl mb-5 bg-black flex items-center justify-center">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-emerald-400 font-bold flex items-center gap-1 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>HD Live</span>
                </div>
              </div>
            ) : (
              <div className="relative z-10 mb-6">
                <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 border-2 ${theme.border} shadow-2xl relative flex items-center justify-center`}>
                  <img
                    src={activeCall.contact.avatar}
                    alt={activeCall.contact.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/boy_1.jpg';
                    }}
                  />
                  {activeCall.status === 'calling' && (
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/40 animate-ping pointer-events-none" />
                  )}
                </div>
              </div>
            )}

            {/* Contact Name & Call Status */}
            <div className="relative z-10 space-y-1 mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeCall.contact.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                @{activeCall.contact.username}
              </p>
              <div className="pt-2">
                {activeCall.status === 'calling' ? (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                    Calling & Ringing...
                  </span>
                ) : (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 mx-auto w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Connected • {formatSeconds(callDuration)}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Call Control Buttons */}
            <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-6">
              {/* Mute Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                }`}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* End Call Button (Big Red Hangup) */}
              <button
                onClick={handleEndCall}
                className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-xl shadow-rose-600/40 transition-all cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              {/* Video Camera Toggle */}
              {activeCall.mode === 'video' && (
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isVideoOff
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                      : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                  }`}
                  title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              )}

              {/* Speaker Toggle */}
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  !isSpeakerOn
                    ? 'bg-white/5 border-white/10 text-slate-500'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                }`}
                title={isSpeakerOn ? 'Mute Speaker' : 'Turn Speaker On'}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout: Left Main Column (Col Span 8) + Right Column (Col Span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT MAIN AREA (Col Span 8): Calls History ================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Calls
              </h1>
              <p className={`text-xs sm:text-sm mt-1 ${
                isDark ? 'text-slate-400' : 'text-slate-600 font-medium'
              }`}>
                Make real-time secure audio and video calls with your ConnectX friends.
              </p>
            </div>

            {calls.length > 0 && (
              <button
                onClick={handleClearAllHistory}
                className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer self-start sm:self-center flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border-white/10'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200'
                }`}
                title="Clear call logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'recent'
                  ? `${theme.btn} text-white shadow-lg`
                  : isDark
                  ? 'bg-[#0E1225] text-slate-300 hover:text-white border border-white/10 hover:bg-white/10'
                  : 'bg-white text-slate-700 font-bold hover:bg-slate-100 border border-slate-300'
              }`}
            >
              Recent Calls ({calls.length})
            </button>

            <button
              onClick={() => setActiveTab('missed')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'missed'
                  ? `${theme.btn} text-white shadow-lg`
                  : isDark
                  ? 'bg-[#0E1225] text-slate-300 hover:text-white border border-white/10 hover:bg-white/10'
                  : 'bg-white text-slate-700 font-bold hover:bg-slate-100 border border-slate-300'
              }`}
            >
              Missed Calls ({calls.filter((c) => c.isMissed).length})
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'favorites'
                  ? `${theme.btn} text-white shadow-lg`
                  : isDark
                  ? 'bg-[#0E1225] text-slate-300 hover:text-white border border-white/10 hover:bg-white/10'
                  : 'bg-white text-slate-700 font-bold hover:bg-slate-100 border border-slate-300'
              }`}
            >
              Favorites
            </button>
          </div>

          {/* Calls List Grouped by Day */}
          <div className="space-y-6 pt-2">
            {displayCalls.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border flex flex-col items-center justify-center ${
                isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
              }`}>
                <div className={`w-14 h-14 rounded-2xl ${theme.badge} flex items-center justify-center mb-4 shadow-lg`}>
                  <Phone className="w-7 h-7" />
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeTab === 'missed' ? 'No Missed Calls' : 'No Call History Yet'}
                </h3>
                <p className={`text-xs mt-1.5 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {activeTab === 'missed'
                    ? 'You have answered all incoming calls!'
                    : 'Start a voice or video call with any of your friends using the call buttons on the right.'}
                </p>
                {friends.length > 0 && (
                  <button
                    onClick={() => handleStartCall(friends[0], 'video')}
                    className={`mt-4 px-5 py-2.5 rounded-xl ${theme.btn} text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Call {friends[0].displayName || friends[0].username}</span>
                  </button>
                )}
              </div>
            ) : (
              Object.keys(groupedCalls).map((groupTitle) => {
                const callList = groupedCalls[groupTitle];
                return (
                  <div key={groupTitle} className="space-y-2.5">
                    {/* Group Title */}
                    <h3 className={`text-xs font-extrabold tracking-wider ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {groupTitle}
                    </h3>

                    {/* Call Rows Card Container */}
                    <div className={`rounded-3xl border divide-y overflow-hidden shadow-sm ${
                      isDark
                        ? 'bg-[#0A0D1F]/90 border-white/[0.08] divide-white/[0.04]'
                        : 'bg-white border-slate-200 divide-slate-100'
                    }`}>
                      {callList.map((call) => (
                        <div
                          key={call.id}
                          className={`p-4 flex items-center justify-between gap-4 transition-colors group ${
                            isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                          }`}
                        >
                          {/* User Avatar + Call Description */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={call.avatar || '/images/boy_1.jpg'}
                                alt={call.name}
                                className={`w-11 h-11 rounded-full object-cover border ${theme.borderLight}`}
                                onError={(e) => {
                                  e.target.src = '/images/boy_1.jpg';
                                }}
                              />
                              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ${
                                isDark ? 'ring-[#0A0D1F]' : 'ring-white'
                              }`} />
                            </div>

                            <div className="min-w-0">
                              <h4 className={`text-sm font-extrabold truncate group-hover:${theme.text} transition-colors ${
                                isDark ? 'text-white' : 'text-slate-900'
                              }`}>
                                {call.name}
                              </h4>

                              {/* Subtitle with Arrow and Duration */}
                              <div className="flex items-center gap-1.5 mt-0.5 text-xs truncate">
                                {call.isMissed ? (
                                  <PhoneMissed className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                ) : call.type === 'outgoing' ? (
                                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <ArrowDownLeft className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                )}

                                <span className={call.isMissed ? 'text-rose-500 font-bold' : isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'}>
                                  {call.label}
                                </span>

                                {call.duration && (
                                  <>
                                    <span className="text-slate-500">•</span>
                                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                                      {call.duration}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right: Timestamp + Action Buttons */}
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {call.time}
                            </span>

                            <div className="flex items-center gap-1">
                              {/* Redial Video button */}
                              <button
                                onClick={() => handleStartCall({ id: call.contactId, displayName: call.name, avatarUrl: call.avatar }, 'video')}
                                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                  isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]' : 'text-slate-600 hover:text-black hover:bg-slate-200'
                                }`}
                                title="Video Call"
                              >
                                <Video className="w-4 h-4" />
                              </button>

                              {/* Redial Audio button */}
                              <button
                                onClick={() => handleStartCall({ id: call.contactId, displayName: call.name, avatarUrl: call.avatar }, 'audio')}
                                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                  isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]' : 'text-slate-600 hover:text-black hover:bg-slate-200'
                                }`}
                                title="Audio Call"
                              >
                                <Phone className="w-4 h-4" />
                              </button>

                              {/* Delete single call log */}
                              <button
                                onClick={(e) => handleDeleteCall(call.id, e)}
                                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                  isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                }`}
                                title="Delete from log"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN (Col Span 4): Start a Call + All Friends ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Start a Call */}
          <div className={`p-5 rounded-3xl border shadow-sm space-y-4 ${
            isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h2 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Start a Call
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                Search your friends and initiate a voice or video call.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={startCallSearch}
                onChange={(e) => setStartCallSearch(e.target.value)}
                placeholder="Search friend by username..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-full text-xs border focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#0E1225] border-white/[0.08] text-white placeholder-slate-500 focus:border-purple-500/60'
                    : 'bg-slate-100 border-slate-200 text-black font-medium placeholder-slate-500 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  const target = filteredFriends[0] || (startCallSearch ? { username: startCallSearch } : null);
                  if (target) {
                    handleStartCall(target, 'audio');
                  } else {
                    showToast('Please select or search a friend to call');
                  }
                }}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer active:scale-95 ${
                  isDark
                    ? 'bg-[#0E1225] hover:bg-white/[0.08] border-white/10 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-black'
                }`}
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Audio Call</span>
              </button>

              <button
                onClick={() => {
                  const target = filteredFriends[0] || (startCallSearch ? { username: startCallSearch } : null);
                  if (target) {
                    handleStartCall(target, 'video');
                  } else {
                    showToast('Please select or search a friend to call');
                  }
                }}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 ${theme.btn} text-white transition-all cursor-pointer shadow-md active:scale-95`}
              >
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </button>
            </div>
          </div>

          {/* Card 2: All Friends List from PostgreSQL */}
          <div className={`p-5 rounded-3xl border shadow-sm ${
            isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  All Friends
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${theme.badge}`}>
                  {friends.length}
                </span>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('Contacts')}
                className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${theme.text} ${theme.textHover}`}
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-white/[0.04] pt-1">
              {loadingFriends ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                  <Loader2 className={`w-5 h-5 animate-spin ${theme.text}`} />
                  <span>Loading friends from database...</span>
                </div>
              ) : friends.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    You don't have any friends added yet.
                  </p>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('Requests')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${theme.btn} text-white cursor-pointer`}
                  >
                    Find Friends
                  </button>
                </div>
              ) : (
                filteredFriends.slice(0, 8).map((f) => {
                  const fName = f.displayName || f.name || f.username;
                  return (
                    <div key={f.id} className="py-3 flex items-center justify-between gap-3 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={f.avatarUrl || f.avatar || '/images/boy_1.jpg'}
                            alt={fName}
                            className={`w-10 h-10 rounded-full object-cover border ${theme.borderLight}`}
                            onError={(e) => {
                              e.target.src = '/images/boy_1.jpg';
                            }}
                          />
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ${
                            isDark ? 'ring-[#0A0D1F]' : 'ring-white'
                          }`} />
                        </div>

                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold truncate group-hover:${theme.text} transition-colors ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {fName}
                          </h4>
                          <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            @{f.username}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className={`text-[9px] font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600 font-bold'}`}>Online</span>
                          </div>
                        </div>
                      </div>

                      {/* Call Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartCall(f, 'audio')}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]' : 'text-slate-600 hover:bg-slate-200'
                          }`}
                          title={`Audio Call with ${fName}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        </button>

                        <button
                          onClick={() => handleStartCall(f, 'video')}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]' : 'text-slate-600 hover:bg-slate-200'
                          }`}
                          title={`Video Call with ${fName}`}
                        >
                          <Video className="w-3.5 h-3.5 text-purple-400" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
