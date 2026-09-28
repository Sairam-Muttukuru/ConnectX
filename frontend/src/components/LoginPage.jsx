import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import BackendStatusBadge from './common/BackendStatusBadge';

export default function LoginPage({ onNavigate, isDark, toggleTheme }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailOrUsername.trim()) {
      setErrorMessage('Please enter your email or ConnectX username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // After successful login simulation, navigate back to home or dashboard after 1.5s
      setTimeout(() => {
        onNavigate('home');
      }, 1500);
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#06080F] text-slate-100' : 'bg-[#fcfdfe] text-slate-900'
      }`}
    >
      {/* Background Starfield Accents in Dark mode */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0" />
      )}

      {/* Ambient Lighting Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-purple-700/25 via-indigo-600/15 to-blue-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        {/* Brand Logo & Back to Home */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isDark
                ? 'text-slate-300 hover:text-white border-white/10 hover:border-white/20 bg-white/[0.04]'
                : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/images/connectx_logo.png"
                alt="ConnectX Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            </div>
            <span className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Connect<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">X</span>
            </span>
          </button>
        </div>

        {/* Theme Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
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
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[440px]">
          
          {/* Card Frame */}
          <div
            className={`rounded-[28px] p-6 sm:p-8 border backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.18)] transition-all ${
              isDark
                ? 'bg-[#0b0e1b]/85 border-white/10'
                : 'bg-white/95 border-slate-200/90 shadow-xl'
            }`}
          >
            {/* Header Text */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-3 h-3" />
                <span>SECURE ACCESS</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Welcome Back
              </h1>
              <p className={`text-xs sm:text-sm mt-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Log in to connect with your world without limits.
              </p>
            </div>

            {/* Success Notification */}
            {isSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Welcome back!</p>
                  <p className="text-[11px] text-emerald-300/90">Logging into your account...</p>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {/* Google */}
              <button
                type="button"
                className={`flex items-center justify-center py-2.5 rounded-xl border transition-all hover:scale-[1.02] ${
                  isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
                title="Log in with Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8 0-1 .2-1.9.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                </svg>
              </button>

              {/* GitHub */}
              <button
                type="button"
                className={`flex items-center justify-center py-2.5 rounded-xl border transition-all hover:scale-[1.02] ${
                  isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
                title="Log in with GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </button>

              {/* Discord */}
              <button
                type="button"
                className={`flex items-center justify-center py-2.5 rounded-xl border transition-all hover:scale-[1.02] ${
                  isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-[#5865F2]'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-[#5865F2]'
                }`}
                title="Log in with Discord"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </button>
            </div>

            {/* Separator */}
            <div className="relative flex items-center justify-center mb-6">
              <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
              <span className={`absolute px-3 text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'bg-[#0b0e1b] text-slate-500' : 'bg-white text-slate-400'
              }`}>
                or continue with email
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email or Username */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="you@example.com or @username"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
                      isDark
                        ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Password
                  </label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link sent to your registered email address!');
                    }}
                    className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full mt-2 group relative inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] transition-all duration-300 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <span>Log In to ConnectX</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Sign Up */}
            <div className={`mt-6 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('signup')}
                className="font-bold text-purple-400 hover:text-purple-300 underline underline-offset-2 ml-1"
              >
                Sign up for free
              </button>
            </div>

          </div>

          {/* Handwritten Tag */}
          <div className="mt-5 text-center font-handwriting text-xl text-purple-300 select-none flex items-center justify-center gap-1.5">
            <span>Real people, real conversations</span>
            <span className="text-pink-400 text-2xl">♡</span>
          </div>

        </div>
      </main>

      {/* Subtle Bottom Footer */}
      <footer className="relative z-20 py-4 text-center text-[11px] text-slate-500">
        © 2026 ConnectX. All rights reserved. • <a href="#privacy" className="hover:text-purple-400">Privacy</a> • <a href="#terms" className="hover:text-purple-400">Terms</a>
      </footer>
    </div>
  );
}
