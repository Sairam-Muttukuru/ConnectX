import { useState, useEffect } from 'react';

export default function DashboardGreetingBanner({ user, isDark = true }) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setDateStr(
        now.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good Morning,' : hour < 17 ? 'Good Afternoon,' : 'Good Evening,';
  const displayName = user?.displayName || user?.username || 'Sairam';

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border min-h-[180px] sm:min-h-[200px] flex items-center transition-colors ${
      isDark ? 'border-white/10 bg-[#0B0D19]' : 'border-slate-200/80 bg-white shadow-xs'
    }`}>
      {/* Background Dusk Mountain Scenic Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/dashboard/sunrise_hero.jpg"
          alt="Evening Mountain Landscape"
          className="w-full h-full object-cover object-right filter brightness-75 contrast-125"
          onError={(e) => {
            e.target.src = '/images/dashboard/cover_clean.jpg';
          }}
        />
        {/* Deep Evening Gradient Wash for crystal clear typography */}
        <div className={`absolute inset-0 bg-gradient-to-r ${
          isDark
            ? 'from-[#06080F] via-[#06080F]/90 to-transparent'
            : 'from-white via-white/85 to-transparent'
        }`} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Left Side: Greeting & Subtitle */}
        <div className="max-w-md">
          <span className="text-xs sm:text-sm font-semibold text-slate-300 block mb-0.5">
            {timeGreeting}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{displayName}</span>
            <span className="text-2xl animate-bounce">👋</span>
          </h1>

          <h2 className="text-sm sm:text-base font-bold text-slate-100 mt-2">
            Welcome back to ConnectX!
          </h2>

          <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
            Continue your conversations, stay connected with your friends.
          </p>
        </div>

        {/* Center / Floating Calligraphy "Real Connections Matter" */}
        <div className="hidden lg:flex flex-col items-center select-none pointer-events-none opacity-90 -mt-2">
          <span className="font-handwriting text-2xl text-white font-bold rotate-[-3deg] drop-shadow-md text-center">
            Real<br />Connections<br />Matter
          </span>
          <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full mt-1 rotate-[-3deg]" />
        </div>

        {/* Right Side: Live Date & Time Clock */}
        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs text-slate-400 block font-medium">
            {dateStr || 'Thu, 23 Sep 2026'}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono block mt-0.5">
            {timeStr || '10:09 PM'}
          </span>
        </div>
      </div>
    </div>
  );
}
