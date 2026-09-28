import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import BackendStatusBadge from './common/BackendStatusBadge';

export default function Navbar({ onOpenVideo, onNavigate, isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Features');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It works', href: '#how-it-works' },
    { label: 'Security', href: '#security' },
    { label: 'Community', href: '#community' },
    { label: 'About', href: '#about' }
  ];

  const handleNavClick = (label, href) => {
    setActiveTab(label);
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-[#06080f]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/connectx_logo.png"
              alt="ConnectX Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(168,85,247,0.55)]"
            />
          </div>
          <span className={`text-2xl font-extrabold tracking-tight flex items-center ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Connect<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">X</span>
          </span>
        </a>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.label, item.href);
                }}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? isDark
                      ? 'text-white font-semibold'
                      : 'text-purple-700 font-semibold'
                    : isDark
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Actions & Working Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / White Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`relative p-2.5 rounded-full border transition-all duration-300 group flex items-center justify-center cursor-pointer ${
              isDark
                ? 'bg-white/[0.06] border-white/15 text-yellow-300 hover:bg-white/15 hover:border-yellow-400/40 shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200 hover:border-indigo-400/40 shadow-sm'
            }`}
            title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Moon className="w-4 h-4 fill-current text-slate-200 group-hover:scale-110 transition-transform" />
            ) : (
              <Sun className="w-4 h-4 fill-yellow-500 text-yellow-500 group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Log In Button */}
          <button
            onClick={() => onNavigate ? onNavigate('login') : onOpenVideo()}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all cursor-pointer ${
              isDark
                ? 'text-slate-200 hover:text-white border-white/15 hover:border-white/30 hover:bg-white/5'
                : 'text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            Log In
          </button>

          {/* Sign Up Button */}
          <button
            onClick={() => onNavigate ? onNavigate('signup') : null}
            className="group relative inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span>Sign Up</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile menu and theme trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border ${
              isDark ? 'text-slate-200 border-white/10' : 'text-slate-700 border-slate-200'
            }`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Moon className="w-5 h-5 fill-current" /> : <Sun className="w-5 h-5 fill-current" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg ${
              isDark ? 'text-slate-200 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden px-4 pt-3 pb-6 border-b backdrop-blur-2xl flex flex-col gap-3 transition-colors ${
          isDark ? 'bg-[#090D1A]/95 border-white/10' : 'bg-white/95 border-slate-200'
        }`}>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.label, item.href);
                setMobileMenuOpen(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === item.label
                  ? 'text-purple-400 font-bold bg-white/5'
                  : isDark
                    ? 'text-slate-200 hover:bg-white/10'
                    : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) onNavigate('login');
              }}
              className={`flex-1 py-2 text-center text-sm font-medium rounded-full border ${
                isDark ? 'text-white border-white/20' : 'text-slate-800 border-slate-300'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) onNavigate('signup');
              }}
              className="flex-1 py-2 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
