import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import authApi from '../../api/authApi';

export default function LoginForm({ onSuccess, onNavigate, isDark = true }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Always clean all input fields when arriving at login
  useEffect(() => {
    setIdentifier('');
    setPassword('');
    setErrorMessage('');
    setErrorCode('');
    setSuccessMessage('');

    // Ensure any browser background autofill is cleaned
    const timer = setTimeout(() => {
      const idEl = document.getElementById('login-identifier');
      const pwEl = document.getElementById('login-password');
      if (idEl) idEl.value = '';
      if (pwEl) pwEl.value = '';
      setIdentifier('');
      setPassword('');
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Resend OTP state for unverified accounts
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendNotice, setResendNotice] = useState(null); // { type: 'success' | 'error', message: string }
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [manualEmail, setManualEmail] = useState('');

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isEmailUnverified =
    errorCode === 'EMAIL_NOT_VERIFIED' ||
    Boolean(
      errorMessage &&
        (errorMessage.toLowerCase().includes('not verified') ||
          errorMessage.toLowerCase().includes('verify your email') ||
          errorMessage.toLowerCase().includes('verification'))
    );

  const handleGoToVerification = () => {
    if (onNavigate) {
      onNavigate('verify-email', { email: identifier.trim() });
    }
  };

  const handleResend = async (targetEmail) => {
    const emailToSend = (targetEmail || manualEmail || identifier).trim();
    if (!emailToSend) {
      setResendNotice({ type: 'error', message: 'Please enter your email or username.' });
      return;
    }

    if (resendCooldown > 0) return;

    setIsResending(true);
    setResendNotice(null);

    try {
      await authApi.resendVerification(emailToSend.toLowerCase());
      setResendNotice({
        type: 'success',
        message: 'Verification OTP code sent! (Valid for 5 minutes). Click Verify Email Now to enter it.',
      });
      setResendCooldown(300); // 5 minutes cooldown
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('valid email')) {
        setShowEmailInput(true);
        setResendNotice({
          type: 'error',
          message: 'Please enter your registered email address below.',
        });
      } else {
        setResendNotice({
          type: 'error',
          message: err.message || 'Failed to resend verification OTP. Please try again.',
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrorCode('');
    setSuccessMessage('');
    setResendNotice(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or username');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier.trim(), password);
      setSuccessMessage('Login successful! Redirecting...');
      if (onSuccess) {
        setTimeout(onSuccess, 800);
      } else if (onNavigate) {
        setTimeout(() => onNavigate('dashboard'), 800);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
      setErrorCode(err.code || '');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
      {/* Hidden dummy fields to prevent aggressive browser autofill */}
      <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" readOnly />
      <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="new-password" readOnly />
      {/* Error Alert */}
      {errorMessage && (
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isEmailUnverified
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : 'bg-red-500/15 border-red-500/30 text-red-400'
          } text-xs`}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isEmailUnverified ? 'text-rose-400' : 'text-red-400'}`} />
            <div className="flex-1 space-y-1">
              <span className="font-medium block leading-relaxed">{errorMessage}</span>
            </div>
          </div>

          {/* Action options when email is not verified */}
          {isEmailUnverified && (
            <div className="mt-3 pt-3 border-t border-rose-500/20 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="login-verify-now-btn"
                  onClick={handleGoToVerification}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-[11px] shadow-[0_0_15px_rgba(147,51,234,0.35)] transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Email Now</span>
                </button>

                <button
                  type="button"
                  id="login-resend-otp-btn"
                  onClick={() => handleResend()}
                  disabled={isResending || resendCooldown > 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-[11px] transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>
                    {isResending
                      ? 'Sending OTP...'
                      : resendCooldown > 0
                      ? `Resend in ${formatTimer(resendCooldown)}`
                      : 'Resend Code'}
                  </span>
                </button>
              </div>

              {/* Optional inline email input if the identifier is not an email */}
              {showEmailInput && (
                <div className="pt-1 flex items-center gap-2">
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-slate-400 text-[11px] focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleResend(manualEmail)}
                    disabled={isResending || !manualEmail.trim()}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              )}

              {/* Resend status feedback */}
              {resendNotice && (
                <div
                  className={`text-[11px] font-medium flex items-center gap-1.5 pt-0.5 ${
                    resendNotice.type === 'success' ? 'text-emerald-400' : 'text-rose-300'
                  }`}
                >
                  {resendNotice.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{resendNotice.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Identifier Field */}
      <div>
        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Email or Username
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="login-identifier"
            name="cx_login_user"
            type="text"
            autoComplete="off"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or @username"
            disabled={isLoading}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Password
          </label>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('forgot-password')}
            className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="login-password"
            name="cx_login_pwd"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
          />
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Remember me for 30 days
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        id="login-submit-btn"
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 group relative inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] transition-all duration-300 disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Authenticating...
          </span>
        ) : (
          <>
            <span>Log In to ConnectX</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Helper link for email verification */}
      <div className="pt-2 text-center text-xs">
        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          Haven't verified your email yet?
        </span>
        <button
          type="button"
          onClick={handleGoToVerification}
          className="ml-1 text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
        >
          Verify here
        </button>
      </div>
    </form>
  );
}
