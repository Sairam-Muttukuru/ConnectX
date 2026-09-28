
import { ArrowLeft, Sun, Moon, Sparkles } from 'lucide-react';
import RegisterForm from '../../components/auth/RegisterForm';
import BackendStatusBadge from '../../components/common/BackendStatusBadge';

export default function RegisterPage({ onNavigate, isDark, toggleTheme }) {
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-purple-700/25 via-indigo-600/15 to-blue-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        {/* Brand Logo & Back to Home */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate && onNavigate('home')}
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

        {/* Theme Toggle Button */}
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

      {/* Main Signup Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10 relative z-10">
        <div className="w-full max-w-[480px]">
          {/* Card Frame */}
          <div
            className={`rounded-[28px] p-6 sm:p-8 border backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.18)] transition-all ${
              isDark
                ? 'bg-[#0b0e1b]/85 border-white/10'
                : 'bg-white/95 border-slate-200/90 shadow-xl'
            }`}
          >
            {/* Header Text */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-3 h-3" />
                <span>JOIN WITHOUT A PHONE NUMBER</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Create Your Account
              </h1>
              <p className={`text-xs sm:text-sm mt-1 max-w-sm mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Just your unique username and you're in. Connect on your own terms.
              </p>
            </div>

            {/* Form */}
            <RegisterForm
              onNavigate={onNavigate}
              onSuccess={(email) => onNavigate && onNavigate('verify-email', { email })}
              isDark={isDark}
            />

            {/* Key Perks Under Form */}
            <div className={`mt-5 pt-4 border-t flex items-center justify-around text-[10px] font-medium ${
              isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span className="flex items-center gap-1">✓ No phone needed</span>
              <span className="flex items-center gap-1">✓ Unique @handle</span>
              <span className="flex items-center gap-1">✓ Free forever</span>
            </div>

            {/* Switch to Log In */}
            <div className={`mt-5 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Already have an account?{' '}
              <button
                onClick={() => onNavigate && onNavigate('login')}
                className="font-bold text-purple-400 hover:text-purple-300 underline underline-offset-2 ml-1 cursor-pointer"
              >
                Log in
              </button>
            </div>
          </div>

          {/* Handwritten Tag */}
          <div className="mt-5 text-center font-handwriting text-xl text-purple-300 select-none flex items-center justify-center gap-1.5">
            <span>Your world starts here</span>
            <span className="text-pink-400 text-2xl">♡</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 text-center text-[11px] text-slate-500">
        © 2026 ConnectX. All rights reserved. • Privacy • Terms
      </footer>
    </div>
  );
}
