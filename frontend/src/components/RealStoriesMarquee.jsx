import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Globe2,
  Lock,
  Zap,
  ArrowRight,
  PenSquare,
  X,
  Check,
  Users
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const initialReviews = [
  {
    id: 1,
    name: 'Elena Rostova',
    username: '@elena_art',
    role: 'Lead Concept Artist',
    org: 'Studio Aurora',
    location: 'Paris, France',
    avatar: '/images/girl_3.jpg',
    verified: true,
    tenure: 'Member for 1 year',
    category: 'Creators & Teams',
    rating: 5,
    headline: 'Finally, a platform where my phone number is never exposed or sold.',
    quote: 'Found my international creative circle in less than a week. No phone number hassle, zero ad surveillance algorithms, just genuine friendship and inspiration. I can collaborate on concept art and jump into audio lounges without unsolicited spam.',
    featureTags: ['Zero Phone # Required', 'Encrypted Files', 'Creative Circles'],
    community: 'Paris Illustrators Guild • 340 members',
    helpfulCount: 48,
    date: '3 days ago'
  },
  {
    id: 2,
    name: 'Alex Rivera',
    username: '@alex_voyage',
    role: 'Expedition Guide & Content Creator',
    org: 'WildPeak Adventures',
    location: 'Vancouver, Canada',
    avatar: '/images/boy_1.jpg',
    verified: true,
    tenure: 'Member for 1.2 yrs',
    category: 'Audio & Video Calling',
    rating: 5,
    headline: 'Video calls are crystal clear even streaming from remote basecamps.',
    quote: 'ConnectX video calls are astonishingly resilient even over fluctuating basecamp LTE. I host weekly mountaineering hangouts with 15 friends across 4 continents without audio desync, robotic glitches, or dropped packets.',
    featureTags: ['Low Latency Video', 'Multi-party Calling', 'HD Photo Sync'],
    community: 'Global Alpine Explorers • 1.2k members',
    helpfulCount: 64,
    date: '1 week ago'
  },
  {
    id: 3,
    name: 'Maya Lin',
    username: '@maya_sound',
    role: 'Sound Designer & Music Producer',
    org: 'EchoWave Audio',
    location: 'London, UK',
    avatar: '/images/girl_1.jpg',
    verified: true,
    tenure: 'Member for 8 mos',
    category: 'Audio & Video Calling',
    rating: 5,
    headline: '48kHz lossless voice notes feel like sitting in the same studio room.',
    quote: 'As an audio producer, heavy voice compression on other chat apps used to drive me crazy. ConnectX provides uncompressed, crystal-clear 48kHz voice notes with near-zero noise floor. You hear the true warmth and nuance of real conversations.',
    featureTags: ['Lossless Voice Notes', 'Spatial Audio Lounges', 'Noise Cancellation'],
    community: 'London Audio Collective • 480 members',
    helpfulCount: 52,
    date: '2 weeks ago'
  },
  {
    id: 4,
    name: 'Lucas Weber',
    username: '@lucas_code',
    role: 'Senior Systems Architect',
    org: 'OpenForge Labs',
    location: 'Berlin, Germany',
    avatar: '/images/boy_3.jpg',
    verified: true,
    tenure: 'Member for 1 yr',
    category: 'Creators & Teams',
    rating: 5,
    headline: 'Sub-40ms latency, zero bloat, and respects engineer sanity.',
    quote: 'ConnectX solved our remote distributed team communication fatigue. Unlike bloated enterprise messengers, it loads in milliseconds, draws almost zero idle battery, and has a clean, hyper-responsive UI that stays out of your way.',
    featureTags: ['Sub-40ms Latency', 'Markdown & Code Snippets', 'Zero Bloat'],
    community: 'Berlin Open Source Guild • 720 members',
    helpfulCount: 41,
    date: '3 weeks ago'
  },
  {
    id: 5,
    name: 'Hana Tanaka',
    username: '@hana_cinema',
    role: 'Independent Film Curator',
    org: 'Tokyo Indie Screenings',
    location: 'Tokyo, Japan',
    avatar: '/images/girl_2.jpg',
    verified: true,
    tenure: 'Member for 7 mos',
    category: 'Global Hangouts',
    rating: 5,
    headline: 'Hosting midnight cinema debates across 5 timezones seamlessly.',
    quote: 'I was looking for a focused community of international cinephiles away from mainstream social feed algorithms. We host synchronized watch-parties, debate classic cinema till 3 AM, and share high-res movie stills with instant clarity.',
    featureTags: ['Multi-Timezone Channels', 'Full-Res Media', 'Night Owls Lounge'],
    community: 'Tokyo Cinema Guild • 560 members',
    helpfulCount: 39,
    date: '1 month ago'
  },
  {
    id: 6,
    name: 'Marcus Vance',
    username: '@marcus_pulse',
    role: 'Community Lead',
    org: 'Endurance Athletic Hub',
    location: 'New York, USA',
    avatar: '/images/boy_2.jpg',
    verified: true,
    tenure: 'Member for 9 mos',
    category: 'Privacy & Freedom',
    rating: 5,
    headline: 'Built a 400-member community in weeks with absolute anti-spam peace.',
    quote: 'Phone number scrapers were rampant on other chat platforms. ConnectX gives group organizers real safety: unique handles, zero phone number exposure, and instant permissions. Member engagement and trust are at an all-time high.',
    featureTags: ['Anti-Spam Handles', 'Zero Phone Exposure', 'Safe Mod Controls'],
    community: 'NYC Fitness Alliance • 450 members',
    helpfulCount: 78,
    date: '1 month ago'
  }
];

const categories = [
  'All Stories',
  'Privacy & Freedom',
  'Creators & Teams',
  'Global Hangouts',
  'Audio & Video Calling'
];

export default function RealStoriesMarquee({ onNavigate, isDark }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedCategory, setSelectedCategory] = useState('All Stories');
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedToast, setSubmittedToast] = useState(false);

  // New Review Form State
  const [newReview, setNewReview] = useState({
    name: '',
    username: '',
    role: '',
    location: '',
    category: 'Creators & Teams',
    headline: '',
    quote: '',
    rating: 5
  });

  const toggleHelpful = (id) => {
    setHelpfulVotes((prev) => {
      const isVoted = prev[id];
      return {
        ...prev,
        [id]: !isVoted
      };
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.quote.trim()) return;

    const createdReview = {
      id: Date.now(),
      name: newReview.name,
      username: newReview.username.startsWith('@') ? newReview.username : `@${newReview.username || 'user'}`,
      role: newReview.role || 'ConnectX Member',
      org: 'Independent',
      location: newReview.location || 'Global',
      avatar: '/images/sunrise_traveler.jpg',
      verified: true,
      tenure: 'Just now',
      category: newReview.category,
      rating: Number(newReview.rating),
      headline: newReview.headline || 'Loving my experience on ConnectX!',
      quote: newReview.quote,
      featureTags: ['Verified Review', 'Community Member'],
      community: 'ConnectX Global Community',
      helpfulCount: 1,
      date: 'Just now'
    };

    setReviews([createdReview, ...reviews]);
    setIsModalOpen(false);
    setNewReview({
      name: '',
      username: '',
      role: '',
      location: '',
      category: 'Creators & Teams',
      headline: '',
      quote: '',
      rating: 5
    });
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  const filteredReviews = selectedCategory === 'All Stories'
    ? reviews
    : reviews.filter((r) => r.category === selectedCategory);

  return (
    <section id="community" className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#06080F]' : 'bg-[#f8fafc]'
    }`}>
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-purple-600/12 via-indigo-600/10 to-blue-600/10 blur-[170px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-pink-600/8 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <ScrollReveal direction="down" delay={0.1} duration={0.8}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-[13px] font-extrabold tracking-widest uppercase mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/25 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>VERIFIED COMMUNITY EXPERIENCES</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2} duration={0.9}>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-black tracking-tight leading-tight mb-5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Real Stories from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Real People.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3} duration={0.9}>
            <p className={`text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto font-normal ${
              isDark ? 'text-slate-200' : 'text-slate-600'
            }`}>
              Every day, thousands of creators, engineers, travelers, and friends build lasting relationships without phone numbers, spam, or invasive algorithms.
            </p>
          </ScrollReveal>

          {/* Aggregate Rating & Trust Score Bar */}
          <ScrollReveal direction="up" delay={0.35} duration={0.9}>
            <div className={`mt-8 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3.5 rounded-2xl border backdrop-blur-xl shadow-lg ${
              isDark
                ? 'bg-[#0E1322]/85 border-white/10 text-slate-200'
                : 'bg-white border-slate-200 text-slate-800'
            }`}>
              {/* Star Rating Score */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-extrabold text-sm sm:text-base text-white">4.9 / 5.0</span>
                <span className="text-xs sm:text-sm text-slate-400 font-medium">(14,500+ reviews)</span>
              </div>

              <div className="hidden sm:block w-px h-5 bg-white/10" />

              {/* Trust Badges */}
              <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>100% Verified Members</span>
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Lock className="w-4 h-4" />
                  <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>Zero Phone # Required</span>
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Category Filter Tabs & Write Review Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-white/5">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]'
                    : isDark
                      ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Write a Review Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400 transition-all duration-300 cursor-pointer shrink-0 shadow-sm"
          >
            <PenSquare className="w-4 h-4 text-purple-400" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Success Toast when review submitted */}
        {submittedToast && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Thank you! Your verified review has been published to the community.</span>
            </div>
            <button onClick={() => setSubmittedToast(false)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredReviews.map((review, idx) => {
            const hasVoted = helpfulVotes[review.id];
            const displayHelpfulCount = review.helpfulCount + (hasVoted ? 1 : 0);

            return (
              <ScrollReveal
                key={review.id}
                direction="up"
                delay={0.08 * (idx % 3)}
                duration={0.8}
              >
                <div
                  className={`group relative rounded-[28px] p-6 sm:p-7 border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full ${
                    isDark
                      ? 'bg-[#0B0F1C]/90 border-white/10 hover:border-purple-500/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(139,92,246,0.15)]'
                      : 'bg-white border-slate-200/90 hover:border-purple-300 hover:shadow-xl'
                  }`}
                >
                  {/* Card Content Top */}
                  <div>
                    {/* Header: Avatar, Name, Handle, Verified Badge & Date */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative shrink-0">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-purple-500/30 group-hover:ring-purple-400 transition-all duration-300 shadow-md"
                          />
                          {review.verified && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full ring-2 ring-[#0B0F1C] flex items-center justify-center" title="Verified Member">
                              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div className="text-left min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className={`text-base font-bold truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {review.name}
                            </h4>
                          </div>
                          <div className="text-xs font-mono text-purple-400 font-semibold truncate">
                            {review.username}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {review.role} • {review.location}
                          </div>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Review Headline */}
                    <h5 className={`text-sm sm:text-[15px] font-bold leading-snug mb-2.5 text-left ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {review.headline}
                    </h5>

                    {/* Review Quote Body */}
                    <p className={`text-xs sm:text-[13.5px] leading-relaxed text-left mb-4.5 font-normal ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      "{review.quote}"
                    </p>

                    {/* Feature Tags Pill Row */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {review.featureTags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                            isDark
                              ? 'bg-white/5 border-white/10 text-slate-300'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="pt-3.5 mt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] truncate max-w-[170px]" title={review.community}>
                      {review.community}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleHelpful(review.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        hasVoted
                          ? 'bg-purple-600 text-white shadow-sm'
                          : isDark
                            ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                      title="Mark as helpful"
                    >
                      <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'fill-current' : ''}`} />
                      <span>Helpful ({displayHelpfulCount})</span>
                    </button>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Production Proof Stats Ribbon */}
        <ScrollReveal direction="up" delay={0.2} duration={0.9}>
          <div className={`mt-16 rounded-[28px] p-6 sm:p-8 border backdrop-blur-xl ${
            isDark
              ? 'bg-gradient-to-r from-[#0C101D] via-[#0F1424] to-[#0C101D] border-white/10'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="pt-3 md:pt-0">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  100,000+
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 block">
                  Active Global Members
                </span>
              </div>

              <div className="pt-3 md:pt-0">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  4.9 / 5.0
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 block">
                  Average Community Rating
                </span>
              </div>

              <div className="pt-3 md:pt-0">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  0
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 block">
                  Phone Numbers or Trackers
                </span>
              </div>

              <div className="pt-3 md:pt-0">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  99.98%
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 block">
                  Call & Message Reliability
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Production Level Community CTA Banner */}
        <ScrollReveal direction="up" delay={0.3} duration={0.9}>
          <div className="mt-12 text-center">
            <div className={`p-8 sm:p-10 rounded-[28px] border max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 ${
              isDark
                ? 'bg-[#0E1322] border-white/10 shadow-xl'
                : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <div className="text-left space-y-1">
                <h4 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Ready for conversations without limits?
                </h4>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Join over 100,000 members connecting safely across 140+ countries. Free forever.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onNavigate ? onNavigate('signup') : null}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:shadow-[0_0_35px_rgba(124,58,237,0.75)] hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Interactive Write A Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl ${
            isDark ? 'bg-[#0E1322] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-left mb-6">
              <h3 className="text-xl font-bold">Share Your ConnectX Story</h3>
              <p className="text-xs text-slate-400 mt-1">
                Help other people discover genuine, privacy-first communication.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username Handle</label>
                  <input
                    type="text"
                    value={newReview.username}
                    onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
                    placeholder="@sarah_j"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Profession</label>
                  <input
                    type="text"
                    value={newReview.role}
                    onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                    placeholder="e.g. UX Designer"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newReview.category}
                    onChange={(e) => setNewReview({ ...newReview, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A2B] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Privacy & Freedom">Privacy & Freedom</option>
                    <option value="Creators & Teams">Creators & Teams</option>
                    <option value="Global Hangouts">Global Hangouts</option>
                    <option value="Audio & Video Calling">Audio & Video Calling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Review Headline *</label>
                <input
                  type="text"
                  required
                  value={newReview.headline}
                  onChange={(e) => setNewReview({ ...newReview, headline: e.target.value })}
                  placeholder="One sentence that summarizes your experience"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Review *</label>
                <textarea
                  required
                  rows={3}
                  value={newReview.quote}
                  onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                  placeholder="Tell us what you love about ConnectX..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400 mr-2">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newReview.rating ? 'fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    Publish Review
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
