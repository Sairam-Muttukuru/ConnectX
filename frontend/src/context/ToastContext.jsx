import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Check,
  CheckCircle2,
  UserPlus,
  Users,
  MessageSquare,
  PhoneMissed,
  Heart,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';

const ToastContext = createContext(null);

// Global trigger helper accessible outside React tree if needed
export const triggerGlobalToast = (message, type = 'info', options = {}) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('connectx_show_toast', {
        detail: typeof message === 'string' ? { message, type, ...options } : message,
      })
    );
  }
};

// Formats relative time string matching design (e.g., "Just now", "2s ago", "5s ago")
function getRelativeTime(timestamp) {
  if (!timestamp) return 'Just now';
  const diff = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diff < 3) return 'Just now';
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

// Smart parser to automatically map toast calls to the ultra-premium notification styles
function parseToastConfig(toast) {
  const rawMsg = typeof toast.message === 'string' ? toast.message : '';
  const lowerMsg = rawMsg.toLowerCase();
  let explicitType = toast.type;
  let title = toast.title;
  let message = rawMsg;

  // Keyword-based classification if type is generic or missing
  if (!explicitType || explicitType === 'info' || explicitType === 'success') {
    if (
      lowerMsg.includes('profile') ||
      lowerMsg.includes('photo') ||
      lowerMsg.includes('avatar') ||
      lowerMsg.includes('saved')
    ) {
      explicitType = 'profile';
      if (!title) title = 'Profile Updated';
    } else if (lowerMsg.includes('cover') || lowerMsg.includes('banner')) {
      explicitType = 'profile';
      if (!title) title = 'Cover Updated';
    } else if (lowerMsg.includes('friend request') || lowerMsg.includes('request sent')) {
      explicitType = 'request_sent';
      if (!title) title = 'Friend Request Sent';
    } else if (lowerMsg.includes('message') || lowerMsg.includes('chat')) {
      explicitType = 'message';
      if (!title) title = 'New Message';
    } else if (lowerMsg.includes('call') || lowerMsg.includes('missed')) {
      explicitType = 'call';
      if (!title) title = 'Missed Call';
    } else if (lowerMsg.includes('favorite') || lowerMsg.includes('favourite')) {
      explicitType = 'favorite';
      if (!title) title = 'Added to Favorites';
    } else if (
      lowerMsg.includes('sending') ||
      lowerMsg.includes('loading') ||
      lowerMsg.includes('please wait')
    ) {
      explicitType = 'loading';
      if (!title) title = 'Sending Friend Request...';
    } else if (
      lowerMsg.includes('error') ||
      lowerMsg.includes('failed') ||
      lowerMsg.includes('unable') ||
      lowerMsg.includes('wrong')
    ) {
      explicitType = 'error';
      if (!title) title = 'Something Went Wrong';
    } else if (lowerMsg.includes('request received') || toast.onAccept) {
      explicitType = 'request';
      if (!title) title = 'Request Received';
    } else if (lowerMsg.includes('copied') || lowerMsg.includes('clipboard')) {
      explicitType = 'request_sent';
      if (!title) title = 'Copied to Clipboard';
    } else if (explicitType === 'success') {
      if (!title) title = 'Success';
    } else {
      explicitType = 'profile';
      if (!title) title = 'Notice';
    }
  }

  switch (explicitType) {
    case 'profile':
    case 'success':
      return {
        type: 'profile',
        title: title || 'Profile Updated',
        message: message || 'Your profile has been updated successfully.',
        glowBorder: 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/20',
        badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
        badgeIcon: <Check className="w-5 h-5 stroke-[2.5]" />,
        avatar: toast.avatar,
      };

    case 'request_sent':
    case 'friend_request':
    case 'user':
      return {
        type: 'request_sent',
        title: title || 'Friend Request Sent',
        message: message || 'Your friend request has been sent.',
        glowBorder: 'border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/20',
        badgeBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
        badgeIcon: <UserPlus className="w-5 h-5 stroke-[2.5]" />,
        avatar: toast.avatar,
      };

    case 'message':
      return {
        type: 'message',
        title: title || 'New Message',
        message: message,
        glowBorder: 'border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/20',
        badgeBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
        badgeIcon: <MessageSquare className="w-5 h-5 stroke-[2.5]" />,
        avatar: toast.avatar,
      };

    case 'call':
    case 'missed_call':
      return {
        type: 'call',
        title: title || 'Missed Call',
        message: message || 'You missed a call.',
        glowBorder: 'border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/20',
        badgeBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
        badgeIcon: <PhoneMissed className="w-5 h-5 stroke-[2.5]" />,
        avatar: toast.avatar,
      };

    case 'favorite':
      return {
        type: 'favorite',
        title: title || 'Added to Favorites',
        message: message || 'Added to your favorites.',
        glowBorder: 'border-violet-500/50 shadow-[0_0_25px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/20',
        badgeBg: 'bg-violet-500/20 text-violet-400 border border-violet-500/40',
        badgeIcon: <Heart className="w-5 h-5 fill-violet-400/40 stroke-[2.5]" />,
        avatar: toast.avatar,
      };

    case 'loading':
      return {
        type: 'loading',
        title: title || 'Sending Friend Request...',
        message: message || 'Please wait a moment.',
        glowBorder: 'border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/20',
        badgeBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40',
        badgeIcon: <Loader2 className="w-5 h-5 animate-spin" />,
        avatar: toast.avatar,
      };

    case 'error':
      return {
        type: 'error',
        title: title || 'Something Went Wrong',
        message: message || 'Unable to complete request. Please try again.',
        glowBorder: 'border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.25)] ring-1 ring-red-500/20',
        badgeBg: 'bg-red-500/20 text-red-400 border border-red-500/40',
        badgeIcon: <AlertCircle className="w-5 h-5 stroke-[2.5]" />,
        avatar: toast.avatar,
      };

    case 'request':
    default:
      return {
        type: 'request',
        title: title || 'Request Received',
        message: message || 'Someone wants to connect with you.',
        glowBorder: 'border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/20',
        badgeBg: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40',
        badgeIcon: <Users className="w-5 h-5 stroke-[2.5]" />,
        avatar: toast.avatar,
        onAccept: toast.onAccept,
        onReject: toast.onReject,
      };
  }
}

// Single Toast Notification Card styled to match the requested design
function ToastCardItem({ toast, onRemove }) {
  const [timeAgo, setTimeAgo] = useState(() => getRelativeTime(toast.createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getRelativeTime(toast.createdAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [toast.createdAt]);

  const config = parseToastConfig(toast);

  return (
    <div
      className={`pointer-events-auto relative w-full sm:w-[380px] max-w-sm rounded-2xl p-4 bg-[#090D1E]/95 backdrop-blur-2xl border ${config.glowBorder} text-white transition-all duration-300 animate-in fade-in slide-in-from-right-8`}
    >
      <div className="flex items-start gap-3.5">
        {/* Left Badge: Circular Avatar or Icon */}
        {config.avatar ? (
          <img
            src={config.avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/50 shrink-0 mt-0.5"
            onError={(e) => {
              e.target.src = '/images/dashboard/user_avatar.jpg';
            }}
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${config.badgeBg}`}
          >
            {config.badgeIcon}
          </div>
        )}

        {/* Content Middle */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-white tracking-tight leading-tight truncate">
              {config.title}
            </h4>

            {/* Top Right: Time ago + Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">
                {timeAgo}
              </span>
              <button
                onClick={() => onRemove(toast.id)}
                className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
            {config.message}
          </p>

          {/* Action buttons if available (Accept / Reject) */}
          {(config.onAccept || config.onReject || toast.action) && (
            <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/5">
              {config.onAccept && (
                <button
                  onClick={() => {
                    config.onAccept();
                    onRemove(toast.id);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Accept
                </button>
              )}
              {config.onReject && (
                <button
                  onClick={() => {
                    config.onReject();
                    onRemove(toast.id);
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Reject
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (messageOrConfig, type = 'info', duration = 4000) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      let newToast = { id, createdAt: Date.now() };

      if (typeof messageOrConfig === 'string') {
        newToast.message = messageOrConfig;
        newToast.type = type;
      } else if (messageOrConfig && typeof messageOrConfig === 'object') {
        newToast = {
          ...newToast,
          ...messageOrConfig,
          type: messageOrConfig.type || type,
        };
      }

      setToasts((prev) => [...prev, newToast]);

      const effectiveDuration =
        typeof messageOrConfig === 'object' && messageOrConfig.duration !== undefined
          ? messageOrConfig.duration
          : duration;

      if (effectiveDuration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, effectiveDuration);
      }
    },
    [removeToast]
  );

  const showSuccess = useCallback((msg, duration) => showToast(msg, 'success', duration), [showToast]);
  const showError = useCallback((msg, duration) => showToast(msg, 'error', duration || 5000), [showToast]);
  const showInfo = useCallback((msg, duration) => showToast(msg, 'info', duration), [showToast]);
  const showWarning = useCallback((msg, duration) => showToast(msg, 'warning', duration), [showToast]);

  // Listen for global custom events so any script/callback can fire toasts easily
  useEffect(() => {
    const handleGlobalToast = (e) => {
      if (e.detail) {
        if (typeof e.detail === 'string') {
          showToast(e.detail);
        } else {
          showToast(e.detail, e.detail.type || 'info');
        }
      }
    };
    window.addEventListener('connectx_show_toast', handleGlobalToast);
    return () => window.removeEventListener('connectx_show_toast', handleGlobalToast);
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        removeToast,
      }}
    >
      {children}

      {/* Floating Toast Notification Stack in Top-Right */}
      <div className="fixed top-6 right-6 z-[999999] flex flex-col gap-3 pointer-events-none items-end max-w-sm sm:max-w-md w-full">
        {toasts.map((toast) => (
          <ToastCardItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
