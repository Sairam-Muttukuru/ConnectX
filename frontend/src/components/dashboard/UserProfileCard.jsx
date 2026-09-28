import { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { getAccentTheme } from '../../utils/themeHelper';

export default function UserProfileCard({ user, isDark, onEditProfile, accentColor = 'purple' }) {
  const theme = getAccentTheme(accentColor);
  const displayName = user?.displayName || user?.username || 'Sai Ram';
  const handle = user?.username ? `@${user.username}` : '@sai_dev';
  const avatarUrl = user?.avatarUrl || '/images/dashboard/sai_avatar.png';

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-[#0f1322] border border-white/10' : 'bg-white border border-slate-200/80 shadow-xs'
      }`}
    >
      {/* Cover Image with Edit Profile button */}
      <div className="relative h-24 sm:h-28 w-full overflow-hidden">
        <img
          src="/images/dashboard/cover_clean.jpg"
          alt="Profile Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/images/dashboard/profile_cover.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <button
          onClick={() => onEditProfile && onEditProfile()}
          className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* User Info Container */}
      <div className="px-4 pb-4 pt-0 relative">
        {/* Avatar overlapping banner */}
        <div className="-mt-11 mb-2.5 inline-block relative">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 bg-white dark:bg-[#0f1322] shadow-md inline-block">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/images/dashboard/sai_avatar.png';
              }}
            />
          </div>
          {/* Active online green dot */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0f1322]" />
        </div>

        {/* Name and Handle */}
        <h2 className={`text-base sm:text-lg font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {displayName}
        </h2>
        <p className={`text-xs ${theme.text} font-medium mt-0.5`}>
          {handle}
        </p>

        {/* Headline */}
        <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Computer Science Graduate | Java • Spring Boot • Web Development
        </p>

        {/* Motto / Bio quote */}
        <p className={`text-[11px] italic mt-2 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          “Building today for a more connected tomorrow.”
        </p>

        {/* Divider */}
        <div className="my-3.5 border-t border-slate-100 dark:border-white/10" />

        {/* Stats Row */}
        <div className="grid grid-cols-3 text-center divide-x divide-slate-100 dark:divide-white/10">
          <div className="px-1">
            <span className={`block text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              128
            </span>
            <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Connections
            </span>
          </div>

          <div className="px-1">
            <span className={`block text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              24
            </span>
            <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Posts
            </span>
          </div>

          <div className="px-1">
            <span className={`block text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              312
            </span>
            <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Profile views
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
