import { useState, useRef, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';
import authApi from '../../api/authApi';

export default function ResetPasswordForm({
  initialToken = '',
  initialOtp = '',
  initialEmail = '',
  onNavigate,
  isDark = true,
}) {
  const [email, setEmail] = useState(initialEmail || '');

  // Pre-fill digits if 6-digit code was provided
  const getInitialDigits = () => {
    const code = (initialOtp || initialToken || '').trim();
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      return code.split('');
    }
    return ['', '', '', '', '', ''];
  };

  const [digits, setDigits] = useState(getInitialDigits);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendStatus, setResendStatus] = useState(''); // 'sending', 'sent', ''
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index, e) => {
    const val = e.target.value;
    const cleaned = val.replace(/\D/g, '');

    if (cleaned.length > 1) {
      // Multi-char paste or fast typing
      const chars = cleaned.slice(0, 6).split('');
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        if (chars[i]) newDigits[i] = chars[i];
      }
      setDigits(newDigits);
      const nextFocus = Math.min(chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
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
  };

  const handleResend = async () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter your account email to resend the code');
      return;
    }
    setResendStatus('sending');
    setErrorMessage('');
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setResendStatus('sent');
      setCountdown(60);
      setTimeout(() => setResendStatus(''), 4000);
    } catch (err) {
      setResendStatus('');
      setErrorMessage(err.message || 'Failed to resend code. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const otpCode = digits.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your verification code');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setErrorMessage('Password must include uppercase, lowercase, and a number');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email: email.trim().toLowerCase() || undefined,
        token: otpCode,
        newPassword,
        confirmPassword,
      });
      setIsSuccess(true);
      setTimeout(() => {
        if (onNavigate) onNavigate('login');
      }, 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Password reset failed. The code may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Alert */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3 text-emerald-400 text-xs animate-in fade-in zoom-in-95 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Password Reset Successful!</p>
            <p className="mt-1 text-emerald-300/90 leading-relaxed">
              Your password has been updated and all existing sessions were secured. Redirecting you to login...
            </p>
          </div>
        </div>
      )}

      {/* Resend success notice */}
      {resendStatus === 'sent' && (
        <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center gap-2 text-purple-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>A fresh 6-digit reset code has been sent to your email!</span>
        </div>
      )}

      {/* Email input */}
      <div>
        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Account Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            disabled={isLoading || isSuccess}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* 6-Digit OTP Code Slots */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            6-Digit Verification Code
          </label>
          <span className="text-[10px] text-purple-400 font-medium">Expires in 5 mins</span>
        </div>
        <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              disabled={isLoading || isSuccess}
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-extrabold rounded-xl border transition-all duration-200 focus:outline-none focus:scale-105 ${
                digit
                  ? 'border-purple-500 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : isDark
                  ? 'border-white/10 bg-white/[0.04] text-white focus:border-purple-500/60'
                  : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-purple-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Resend Code Link */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || resendStatus === 'sending' || isLoading || isSuccess}
          className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
        >
          {resendStatus === 'sending' ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Resending...</span>
            </>
          ) : countdown > 0 ? (
            <span>Resend code in {countdown}s</span>
          ) : (
            <>
              <RefreshCw className="w-3 h-3" />
              <span>Resend reset code</span>
            </>
          )}
        </button>
      </div>

      {/* New Password */}
      <div>
        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="reset-new-password"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 8 chars (Uppercase, Lowercase, Number)"
            disabled={isLoading || isSuccess}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="reset-confirm-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            disabled={isLoading || isSuccess}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        id="reset-submit-btn"
        type="submit"
        disabled={isLoading || isSuccess}
        className="w-full mt-2 group relative inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] transition-all duration-300 disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Updating Password...
          </span>
        ) : (
          <>
            <span>Reset Password</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to login</span>
        </button>
      </div>
    </form>
  );
}
