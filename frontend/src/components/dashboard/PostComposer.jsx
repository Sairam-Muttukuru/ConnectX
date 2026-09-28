import { useState } from 'react';
import { Image, Video, Calendar, FileText, Send } from 'lucide-react';

export default function PostComposer({ user, onNewPost, isDark }) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Sai';
  const avatarUrl = user?.avatarUrl || '/images/dashboard/sai_avatar.png';

  const handlePost = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (onNewPost) {
      onNewPost({
        id: Date.now(),
        author: {
          name: user?.displayName || 'Sai Ram',
          handle: user?.username ? `@${user.username}` : '@sai_dev',
          headline: 'Computer Science Graduate | Java • Spring Boot • Web Development',
          avatar: avatarUrl,
        },
        timeAgo: 'Just now',
        content: content.trim(),
        likes: 0,
        comments: 0,
        shares: 0,
        image: null,
      });
    }

    setContent('');
    setIsFocused(false);
  };

  return (
    <div
      className={`rounded-2xl p-4 transition-colors ${
        isDark ? 'bg-[#0B0D19]/90 border border-white/[0.08] shadow-xl shadow-black/30' : 'bg-white border border-slate-200/80 shadow-xs'
      }`}
    >
      {/* Top: Avatar + Input */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover shrink-0"
          onError={(e) => {
            e.target.src = '/images/dashboard/sai_avatar.png';
          }}
        />

        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePost(e);
              }
            }}
            placeholder={`What's on your mind, ${firstName}?`}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm border transition-all ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/60'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500/60'
            }`}
          />
        </div>
      </div>

      {/* Bottom: Action Buttons */}
      <div
        className={`flex items-center justify-between pt-3 mt-3 border-t ${
          isDark ? 'border-white/5' : 'border-slate-100'
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isDark ? 'hover:bg-white/[0.06] text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Image className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Photo</span>
          </button>

          <button
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isDark ? 'hover:bg-white/[0.06] text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Video className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Video</span>
          </button>

          <button
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isDark ? 'hover:bg-white/[0.06] text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Event</span>
          </button>

          <button
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isDark ? 'hover:bg-white/[0.06] text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Article</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handlePost}
          disabled={!content.trim()}
          className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Post</span>
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
