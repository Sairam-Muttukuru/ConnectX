import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  KeyRound, 
  ArrowRight,
  Timer,
  Clock
} from 'lucide-react';
import authApi from '../../api/authApi';
import BackendStatusBadge from '../../components/common/BackendStatusBadge';

const OTP_VALIDITY_SECONDS = 300; // 5 minutes

export default function VerifyEmailPage({ initialOtp = '', initialToken = '', initialEmail = '', onNavigate, isDark, toggleTheme }) {
  // Parse parameters from window location hash or search query
  const getUrlParams = () => {
    if (typeof window === 'undefined') return {};
    const fullHash = window.location.hash || '';
    const searchPart = fullHash.includes('?') ? fullHash.split('?')[1] : window.location.search.replace(/^\?/, '');
    const params = new URLSearchParams(searchPart);
    return {
      otp: params.get('otp') || params.get('code') || '',
      token: params.get('token') || '',
      email: params.get('email') || '',
    };
  };

  const parsedParams = getUrlParams();
  const initialEffectiveEmail = initialEmail || parsedParams.email || '';
  const initialCode = initialOtp || parsedParams.otp || initialToken || parsedParams.token || '';

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [digits, setDigits] = useState(() => {
    const arr = ['', '', '', '', '', ''];
    if (initialCode && /^\d{1,6}$/.test(initialCode.trim())) {
      const chars = initialCode.trim().split('');
      for (let i = 0; i < 6 && i < chars.length; i++) {
        arr[i] = chars[i];
      }
    }
    return arr;
  });

  const [email, setEmail] = useState(initialEffectiveEmail);
  const [showEditEmail, setShowEditEmail] = useState(!initialEffectiveEmail);
  const [status, setStatus] = useState('idle'); // 'idle' | 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  // 5-minute countdown timer with persistent session storage
  const [cooldown, setCooldown] = useState(() => {
    try {
      const key = `connectx_otp_timer_${initialEffectiveEmail || 'active'}`;
      const stored = sessionStorage.getItem(key);
      if (stored) {
        const remaining = Math.floor((parseInt(stored, 10) - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
      }
    } catch {
      // ignore
    }
    const expiry = Date.now() + OTP_VALIDITY_SECONDS * 1000;
    try {
      sessionStorage.setItem(`connectx_otp_timer_${initialEffectiveEmail || 'active'}`, expiry.toString());
    } catch {}
    return OTP_VALIDITY_SECONDS;
  });

  const inputRefs = useRef([]);

  // Handle countdown interval
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const executeVerify = useCallback(async (codeToVerify, emailToVerify) => {
    const rawCode = (codeToVerify !== undefined ? codeToVerify : digits.join('')).trim();
    const effectiveEmail = (emailToVerify !== undefined ? emailToVerify : email).trim();

    if (!rawCode) {
      setStatus('error');
      setMessage('Please enter the 6-digit verification OTP.');
      return;
    }

    if (rawCode.length < 6 && /^\d+$/.test(rawCode)) {
      setStatus('error');
      setMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    // Check if the 5-minute window has expired
    if (cooldown <= 0) {
      setStatus('error');
      setMessage('This verification code has expired (5-minute time limit). Please click "Resend OTP Now" below to receive a new code.');
      return;
    }

    setStatus('verifying');
    setMessage('Validating your verification code...');

    try {
      await authApi.verifyEmail({
        email: effectiveEmail || undefined,
        otp: rawCode,
        token: rawCode,
      });
      setStatus('success');
      setMessage('Your email address has been successfully verified! You can now access your ConnectX account.');
      try {
        sessionStorage.removeItem(`connectx_otp_timer_${effectiveEmail || 'active'}`);
      } catch {}
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Verification failed. The OTP code may be invalid or expired.');
    }
  }, [digits, email, cooldown]);

  // Auto-verify if code was passed directly via URL
  useEffect(() => {
    if (initialCode && initialCode.trim().length === 6 && /^\d{6}$/.test(initialCode.trim())) {
      executeVerify(initialCode.trim(), initialEffectiveEmail);
    }
  }, [initialCode, initialEffectiveEmail, executeVerify]);

  const handleDigitChange = (index, e) => {
    const val = e.target.value;
    const cleaned = val.replace(/\D/g, '');

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split('');
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        if (chars[i]) newDigits[i] = chars[i];
      }
      setDigits(newDigits);
      const nextFocus = Math.min(chars.length, 5);
      inputRefs.current[nextFocus]?.focus();

      if (newDigits.every((d) => d !== '')) {
        executeVerify(newDigits.join(''), email);
      }
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (cleaned && index === 5 && newDigits.every((d) => d !== '')) {
      executeVerify(newDigits.join(''), email);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (!pasted) return;

    const chars = pasted.slice(0, 6).split('');
    const newDigits = [...digits];
    chars.forEach((char, idx) => {
      if (idx < 6) newDigits[idx] = char;
    });
    setDigits(newDigits);

    const focusIndex = Math.min(chars.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (newDigits.every((d) => d !== '')) {
      executeVerify(newDigits.join(''), email);
    }
  };

  const handleResend = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setResendStatus('Please provide your email or username to receive your OTP.');
      setShowEditEmail(true);
      return;
    }

    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setResendStatus('');
    try {
      const res = await authApi.resendVerification(email.trim().toLowerCase());
      const resolvedEmail = res?.data?.email || res?.email;
      if (resolvedEmail) {
        setEmail(resolvedEmail);
      }
      const messageText = resolvedEmail
        ? `A new 6-digit OTP code has been sent to ${resolvedEmail}! (Valid for 5 minutes)`
        : (res?.message || 'A new 6-digit OTP code has been sent to your email! (Valid for 5 minutes)');
      setResendStatus(messageText);
      setDigits(['', '', '', '', '', '']);
      setStatus('idle');
      setMessage('');
      const expiry = Date.now() + OTP_VALIDITY_SECONDS * 1000;
      try {
        sessionStorage.setItem(`connectx_otp_timer_${email.trim().toLowerCase()}`, expiry.toString());
      } catch {}
      setCooldown(OTP_VALIDITY_SECONDS);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setResendStatus(err.message || 'Failed to resend verification OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const fullOtpString = digits.join('');
  const isOtpComplete = fullOtpString.length === 6 && /^\d{6}$/.test(fullOtpString);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#06080F] text-slate-100' : 'bg-[#fcfdfe] text-slate-900'
      }`}
    >
      {/* Background Starfield */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0" />
      )}

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:text-white border-white/10 hover:border-white/20 bg-white/[0.04]'
                : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/images/connectx_logo.png"
                alt="ConnectX Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <span className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Connect<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">X</span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isDark
                  ? 'bg-white/[0.06] border-white/15 text-yellow-300 hover:bg-white/15'
                  : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Moon className="w-4 h-4 fill-current text-slate-200" />
              ) : (
                <Sun className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[480px]">
          <div
            className={`rounded-[28px] p-6 sm:p-8 border backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.18)] transition-all ${
              isDark ? 'bg-[#0b0e1b]/85 border-white/10' : 'bg-white/95 border-slate-200/90 shadow-xl'
            }`}
          >
            {/* Header Icon */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                <KeyRound className="w-7 h-7" />
              </div>
              <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Email Verification
              </h1>
              <p className={`text-xs sm:text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter the 6-digit verification OTP sent to your registered email.
              </p>

              {/* Target Email Info pill */}
              {email && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>Account: <strong className="font-semibold text-white">{email}</strong></span>
                  <button
                    onClick={() => setShowEditEmail(!showEditEmail)}
                    className="ml-1 text-[10px] text-purple-400 hover:text-purple-200 underline cursor-pointer"
                  >
                    {showEditEmail ? 'hide' : 'change'}
                  </button>
                </div>
              )}

              {/* 5-Minute OTP Timer Indicator */}
              <div className="mt-3.5 flex items-center justify-center">
                {cooldown > 0 ? (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Timer className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span>OTP valid for: <strong className="font-mono font-bold text-white tracking-wider ml-1 text-sm">{formatTimer(cooldown)}</strong></span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-xs text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>OTP has expired (5 min over). Click <strong>Resend OTP Now</strong> below.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Verifying Spinner */}
            {status === 'verifying' && (
              <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center text-purple-300 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
                <p className="font-semibold text-sm">Verifying OTP code...</p>
                <p className="mt-1 opacity-80">Connecting with ConnectX authentication server</p>
              </div>
            )}

            {/* Success State */}
            {status === 'success' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Account Verified!</p>
                    <p className="mt-1 text-emerald-300/90 leading-relaxed">{message}</p>
                  </div>
                </div>

                <button
                  id="go-to-login-btn"
                  onClick={() => onNavigate && onNavigate('login')}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(124,58,237,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error or Input State */}
            {status !== 'success' && (
              <div className="space-y-6">
                {status === 'error' && (
                  <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{message}</span>
                  </div>
                )}

                {/* 6-Digit OTP Boxes */}
                <div className="space-y-3">
                  <label className={`block text-xs font-semibold text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Verification OTP Code
                  </label>

                  <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                    {digits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (inputRefs.current[idx] = el)}
                        id={`otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        disabled={status === 'verifying'}
                        className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-2xl border transition-all duration-200 focus:outline-none ${
                          digit
                            ? 'border-purple-500 bg-purple-500/10 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                            : isDark
                            ? 'bg-white/[0.04] border-white/10 text-white hover:border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
                            : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                        }`}
                      />
                    ))}
                  </div>

                  <p className={`text-[11px] text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Type or paste your 6-digit code. Digits will advance automatically.
                  </p>
                </div>

                {/* Optional Email/Username input if user needs to specify or update it */}
                {showEditEmail && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <label className={`block text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Associated Email Address or Username
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your-email@example.com or @username"
                        className={`w-full pl-8 pr-3 py-2 rounded-lg text-xs border transition-colors focus:outline-none focus:border-purple-500 ${
                          isDark
                            ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Verify OTP Button */}
                <button
                  id="verify-otp-btn"
                  type="button"
                  onClick={() => executeVerify()}
                  disabled={status === 'verifying' || !isOtpComplete}
                  className={`w-full py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isOtpComplete && status !== 'verifying'
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_25px_rgba(124,58,237,0.4)]'
                      : 'bg-white/[0.06] border border-white/10 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP</span>
                </button>

                {/* Separator */}
                <div className="relative flex items-center justify-center pt-1">
                  <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                  <span
                    className={`absolute px-3 text-[10px] uppercase font-bold tracking-wider ${
                      isDark ? 'bg-[#0b0e1b] text-slate-500' : 'bg-white text-slate-400'
                    }`}
                  >
                    Didn't receive the OTP?
                  </span>
                </div>

                {/* Resend OTP Section with 5-min timer */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between text-xs gap-2">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {cooldown > 0 ? (
                        <span>Resend available after 5 min timer:</span>
                      ) : (
                        <span className="text-amber-300 font-medium">Timer ended. You can request a new OTP:</span>
                      )}
                    </span>
                    <button
                      id="resend-otp-btn"
                      type="button"
                      onClick={handleResend}
                      disabled={isResending || cooldown > 0}
                      className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                        cooldown > 0 || isResending
                          ? 'bg-white/[0.04] text-slate-500 border border-white/5 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:brightness-110 active:scale-95'
                      }`}
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending OTP...</span>
                        </>
                      ) : cooldown > 0 ? (
                        <>
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Resend in {formatTimer(cooldown)}</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Resend OTP Now</span>
                        </>
                      )}
                    </button>
                  </div>

                  {resendStatus && (
                    <p
                      className={`text-[11px] text-center mt-2 font-medium ${
                        resendStatus.includes('sent') ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {resendStatus}
                    </p>
                  )}
                </div>

                {/* Return to Login */}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => onNavigate && onNavigate('login')}
                    className="text-xs text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 text-center text-[11px] text-slate-500">
        © 2026 ConnectX. All rights reserved.
      </footer>
    </div>
  );
}
