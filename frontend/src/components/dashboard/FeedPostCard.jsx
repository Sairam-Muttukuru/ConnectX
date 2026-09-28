import { useState } from 'react';
import { MoreHorizontal, ThumbsUp, MessageSquare, Share2, Bookmark } from 'lucide-react';

export default function FeedPostCard({ post, isDark }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);

  const handleToggleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentsList((prev) => [
      ...prev,
      { id: Date.now(), author: 'You', text: newComment.trim(), time: 'Just now' },
    ]);
    setCommentCount((prev) => prev + 1);
    setNewComment('');
  };

  return (
    <article
      className={`rounded-2xl p-4 sm:p-5 transition-colors ${
        isDark ? 'bg-[#0B0D19]/90 border border-white/[0.08] shadow-xl shadow-black/30' : 'bg-white border border-slate-200/80 shadow-xs'
      }`}
    >
      {/* Header: Author Info */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
            onError={(e) => {
              e.target.src = '/images/dashboard/sai_avatar.png';
            }}
          />

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {post.author.name}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {post.author.handle} &bull; {post.timeAgo}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {post.author.headline}
            </p>
          </div>
        </div>

        <button
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'hover:bg-white/[0.06] text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Body: Post Content */}
      <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        {post.content}
      </p>

      {/* Media Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3 border border-slate-100 dark:border-white/5">
          <img
            src={post.image}
            alt="Post Attachment"
            className="w-full h-auto max-h-[380px] object-cover"
          />
        </div>
      )}

      {/* Reaction Stats */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 py-2 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] shadow-xs">
              👍
            </span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] shadow-xs">
              ❤️
            </span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] shadow-xs">
              💡
            </span>
          </div>
          <span className="font-semibold text-slate-600 dark:text-slate-300 ml-1">
            {likes}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>{commentCount} comments</span>
          <span>&bull;</span>
          <span>{post.shares || 0} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 pt-1.5">
        <button
          onClick={handleToggleLike}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isLiked
              ? 'text-blue-500 bg-blue-500/10'
              : isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            showComments
              ? 'text-purple-500 bg-purple-500/10'
              : isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Comment</span>
        </button>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            alert('Post link copied to clipboard!');
          }}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.05]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        <button
          onClick={() => setIsSaved((prev) => !prev)}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isSaved
              ? 'text-purple-500 bg-purple-500/10'
              : isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          <span>Save</span>
        </button>
      </div>

      {/* Comments Section (collapsible) */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 space-y-3">
          {/* New comment input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                isDark
                  ? 'bg-white/[0.05] border border-white/10 text-white placeholder-slate-500'
                  : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold disabled:opacity-40"
            >
              Reply
            </button>
          </form>

          {/* List of comments */}
          {commentsList.map((c) => (
            <div key={c.id} className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span>{c.author}</span>
                <span className="text-[10px] text-slate-400 font-normal">{c.time}</span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
