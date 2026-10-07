import React from 'react';
import { Sparkles, MessageCircle, Star, Heart } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const communityMembers = [
  {
    name: 'Elena Rostova',
    username: '@elena_art',
    location: 'Paris, France',
    avatar: '/images/girl_3.jpg',
    role: 'Digital Illustrator',
    tag: 'Art & Design',
    quote: 'Found my creative circle in less than a week. No phone number hassle, just genuine friendship and inspiration.',
    rating: 5
  },
  {
    name: 'Alex Rivera',
    username: '@alex_voyage',
    location: 'Vancouver, Canada',
    avatar: '/images/boy_1.jpg',
    role: 'Travel Explorer',
    tag: 'Travel Buddies',
    quote: 'Video calls are crystal clear. I host weekly mountaineering hangouts with 15 friends across 4 continents!',
    rating: 5
  },
  {
    name: 'Maya Lin',
    username: '@maya_sound',
    location: 'London, UK',
    avatar: '/images/girl_1.jpg',
    role: 'Music Producer',
    tag: 'Sound Design',
    quote: 'Finally a platform where your privacy is truly yours. The spatial voice notes feel like being in the same room.',
    rating: 5
  },
  {
    name: 'Lucas Weber',
    username: '@lucas_code',
    location: 'Berlin, Germany',
    avatar: '/images/boy_3.jpg',
    role: 'Full-Stack Dev',
    tag: 'Developers',
    quote: 'ConnectX is butter-smooth. The group channels and latency-free calls make staying close so effortless.',
    rating: 5
  },
  {
    name: 'Hana Tanaka',
    username: '@hana_cinema',
    location: 'Tokyo, Japan',
    avatar: '/images/girl_2.jpg',
    role: 'Film Enthusiast',
    tag: 'Movie Lovers',
    quote: 'Connected with international movie buffs. We watch screenings together and debate plots till 3 AM!',
    rating: 5
  },
  {
    name: 'Marcus Vance',
    username: '@marcus_pulse',
    location: 'New York, USA',
    avatar: '/images/boy_2.jpg',
    role: 'Community Lead',
    tag: 'Fitness Tribe',
    quote: 'Built a 200-member community in two weeks. Truly the best space for authentic human conversations.',
    rating: 5
  }
];

export default function RealStoriesMarquee({ onNavigate, isDark }) {
  return (
    <section className={`py-16 sm:py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#06080F]' : 'bg-[#fcfdfe]'
    }`}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-blue-600/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="down" delay={0.1} duration={0.8}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-[13px] font-extrabold tracking-widest uppercase mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
              <span>MEET THE COMMUNITY</span>
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
            <p className={`text-base sm:text-lg lg:text-xl leading-relaxed ${
              isDark ? 'text-slate-200' : 'text-slate-600'
            }`}>
              Every day, thousands of people make new lifelong friends and share moments that matter without limits.
            </p>
          </ScrollReveal>
        </div>

        {/* 6 Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {communityMembers.map((member, idx) => (
            <ScrollReveal
              key={member.username}
              direction="up"
              delay={0.1 * (idx % 3)}
              duration={0.8}
            >
              <div
                className={`group relative rounded-[28px] p-6 sm:p-7 border backdrop-blur-xl transition-all duration-400 hover:-translate-y-2 flex flex-col justify-between h-full ${
                  isDark
                    ? 'bg-[#090c17]/85 border-white/10 hover:border-purple-500/40 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.2)]'
                    : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl'
                }`}
              >
                {/* Top Profile Header */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {/* High-res Avatar with Online Indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-purple-500/40 group-hover:ring-purple-400 group-hover:scale-105 transition-all duration-300 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-[#090c17] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      </span>
                    </div>

                    {/* Member Details */}
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-base sm:text-lg font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {member.name}
                        </h4>
                      </div>
                      <div className="text-xs sm:text-sm font-mono text-purple-400 font-semibold truncate">
                        {member.username}
                      </div>
                      <div className="text-xs sm:text-[13px] text-slate-400 truncate">
                        {member.location}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-1">
                      {[...Array(member.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                      {member.tag}
                    </span>
                  </div>

                  {/* Member Quote */}
                  <p className={`text-sm sm:text-[15px] leading-relaxed italic text-left ${
                    isDark ? 'text-slate-200' : 'text-slate-600'
                  }`}>
                    "{member.quote}"
                  </p>
                </div>

                {/* Card Bottom: Connect Action */}
                <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between">
                  <span className={`text-xs sm:text-sm font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {member.role}
                  </span>
                  <button
                    onClick={() => onNavigate ? onNavigate('signup') : null}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Connect</span>
                  </button>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom Handwritten Accent */}
        <div className="mt-12 text-center">
          <div className="font-handwriting text-2xl sm:text-3xl text-purple-300 select-none flex items-center justify-center gap-2">
            <span>A more connected world starts with real people</span>
            <span className="text-pink-400 text-3xl">♡</span>
          </div>
        </div>

      </div>
    </section>
  );
}
