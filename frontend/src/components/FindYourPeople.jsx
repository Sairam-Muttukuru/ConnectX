import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function FindYourPeople({ onNavigate, isDark }) {
  const perks = [
    'Create and join groups',
    'Share ideas and resources',
    'Meet like-minded people',
    'Turn interests into real friendships'
  ];

  return (
    <section id="community" className={`py-16 sm:py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#06080F]' : 'bg-[#fcfdfe]'
    }`}>
      {/* Background ambient glow */}
      <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Overlapping Community Cards Collage */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="zoom" delay={0.2} duration={1.0}>
              <div className="relative mx-auto max-w-[500px] pb-10">
                
                {/* 1. Main Background Hiking Community Card */}
                <div className="rounded-[24px] overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] aspect-[16/10] relative group">
                  <img
                    src="/images/hiking_friends.jpg"
                    alt="Hiking Travel Group"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Badge: Travel Group */}
                  <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#090b16]/85 border border-white/15 backdrop-blur-md shadow-lg">
                    <img
                      src="/images/girl_1.jpg"
                      alt="Admin"
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-400"
                    />
                    <div className="text-left leading-none">
                      <span className="text-xs font-bold text-white block">Travel</span>
                      <span className="text-[9px] text-slate-400">1.2k members</span>
                    </div>
                  </div>
                </div>

                {/* 2. Top-Left Floating Badge (Developers / 512 members) */}
                <div className="absolute -top-4 left-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#0b0e1b]/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform">
                  <img
                    src="/images/boy_1.jpg"
                    alt="Dev"
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-400"
                  />
                  <div className="text-left leading-tight">
                    <div className="text-xs font-bold text-white">Developers</div>
                    <div className="text-[10px] text-slate-400">512 members</div>
                  </div>
                </div>

                {/* 3. Bottom Overlapping Card (Campfire / Movies) */}
                <div className="absolute -bottom-4 left-6 sm:left-8 w-[240px] sm:w-[270px] rounded-2xl overflow-hidden border border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.9)] aspect-[4/3] group z-10">
                  <img
                    src="/images/campfire.jpg"
                    alt="Campfire Movie Enthusiasts"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-2 px-3 py-1 rounded-full bg-[#090b16]/85 border border-white/15 backdrop-blur-md shadow-md">
                    <img
                      src="/images/girl_2.jpg"
                      alt="Admin"
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-pink-400"
                    />
                    <div className="text-left leading-none">
                      <span className="text-xs font-bold text-white block">Movies</span>
                      <span className="text-[9px] text-slate-400">890 members</span>
                    </div>
                  </div>
                </div>

                {/* 4. Bottom Right Member Avatar Stack (+18) */}
                <div className="absolute bottom-2 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#090b16]/90 border border-white/15 backdrop-blur-md shadow-lg">
                  <div className="flex -space-x-2 overflow-hidden">
                    {[
                      '/images/girl_1.jpg',
                      '/images/boy_1.jpg',
                      '/images/girl_2.jpg',
                      '/images/boy_2.jpg'
                    ].map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt="Member"
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-[#090b16] hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-purple-300">+18</span>
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Heading, Checklist, Button & Doodle */}
          <div className="lg:col-span-6 text-left relative z-10">
            {/* Eyebrow */}
            <ScrollReveal direction="down" delay={0.1} duration={0.8}>
              <div className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-purple-400/90 mb-4">
                COMMUNITIES THAT MATTER
              </div>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal direction="up" delay={0.2} duration={0.9}>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Find your people.
              </h2>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delay={0.3} duration={0.9}>
              <p className={`text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-normal ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Join groups, make friends, and be part of communities that share your interests.
              </p>
            </ScrollReveal>

            {/* 4 Checklist Perks */}
            <ScrollReveal direction="up" delay={0.4} duration={0.9}>
              <div className="space-y-3.5 mb-8">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {perk}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* CTA Button & Handwritten Doodle */}
            <ScrollReveal direction="up" delay={0.5} duration={0.9}>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <button
                  onClick={() => onNavigate ? onNavigate('signup') : null}
                  className={`group inline-flex items-center gap-2.5 px-7 py-3 rounded-full font-semibold text-sm border transition-all duration-300 cursor-pointer ${
                    isDark
                      ? 'bg-[#0f1322] hover:bg-[#161c33] text-white border-white/15 hover:border-purple-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-md'
                  }`}
                >
                  <span>Explore Communities</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Handwritten Doodle */}
                <div className="font-handwriting text-2xl text-purple-300 -rotate-2 select-none flex items-center gap-1.5 text-right">
                  <span className="leading-tight">Same Interests<br />New Friends<br />Bigger Stories</span>
                  <span className="text-pink-400 text-3xl">♡</span>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </section>
  );
}
