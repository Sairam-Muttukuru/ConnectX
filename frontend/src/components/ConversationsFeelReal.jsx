import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ConversationsFeelReal({ onNavigate, isDark }) {
  const perks = [
    'Instant messaging',
    'Share photos, videos, files and more',
    'Reply, react, and pin important messages',
    'Never miss a moment'
  ];

  return (
    <section id="how-it-works" className={`py-16 sm:py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#06080F]' : 'bg-[#fcfdfe]'
    }`}>
      {/* Background ambient glow */}
      <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Photo Card of Young Man with Laptop */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="zoom" delay={0.2} duration={1.0}>
              <div className="relative mx-auto max-w-[560px] rounded-[28px] overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.2)] group">
                
                {/* Main Photo */}
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <img
                    src="/images/man_laptop.jpg"
                    alt="Conversations that feel real"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge 1: Top-Left ("Good friends Brighter days 💜") */}
                <div className="absolute top-4 left-4 z-20 px-3.5 py-2 rounded-2xl bg-[#090b16]/85 border border-purple-500/30 backdrop-blur-md shadow-lg flex items-center gap-2 text-xs font-semibold text-white">
                  <span>Good friends</span>
                  <span className="text-purple-300">Brighter days 💜</span>
                </div>

                {/* Floating Badge 3: Top-Right Active Reaction ("Maya: That view looks unreal! ✨") */}
                <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-2xl bg-[#090b16]/85 border border-pink-500/30 backdrop-blur-md shadow-lg hidden sm:flex items-center gap-2 text-xs text-white">
                  <img
                    src="/images/girl_2.jpg"
                    alt="Maya"
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-pink-400"
                  />
                  <span className="text-[11px] font-medium text-pink-200">Maya: That view! ✨</span>
                </div>

                {/* Floating Badge 2: Bottom-Left ("Online friends Always close") */}
                <div className="absolute bottom-4 left-4 z-20 px-3.5 py-2 rounded-2xl bg-[#090b16]/85 border border-white/15 backdrop-blur-md shadow-lg flex items-center gap-2.5">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <img
                      src="/images/girl_1.jpg"
                      alt="Friend"
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-purple-500"
                    />
                    <img
                      src="/images/boy_1.jpg"
                      alt="Friend"
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-500"
                    />
                  </div>
                  <div className="text-left text-xs leading-tight">
                    <div className="font-bold text-white">Online friends</div>
                    <div className="text-[10px] text-slate-300">Always close</div>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Heading, Checklist & CTA */}
          <div className="lg:col-span-6 text-left relative z-10">
            {/* Eyebrow */}
            <ScrollReveal direction="down" delay={0.1} duration={0.8}>
              <div className="text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase text-[#D946EF] mb-4">
                CHAT, SHARE, BELONG
              </div>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal direction="up" delay={0.2} duration={0.9}>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-black tracking-tight leading-[1.12] mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Conversations
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
                  that feel real.
                </span>
              </h2>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delay={0.3} duration={0.9}>
              <p className={`text-base sm:text-lg lg:text-xl leading-relaxed mb-9 max-w-xl font-normal ${
                isDark ? 'text-slate-200' : 'text-slate-600'
              }`}>
                From everyday chats to late-night talks, share moments, ideas, and experiences — all in one place.
              </p>
            </ScrollReveal>

            {/* 4 Checklist Perks */}
            <ScrollReveal direction="up" delay={0.4} duration={0.9}>
              <div className="space-y-4 mb-9">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </div>
                    <span className={`text-sm sm:text-base lg:text-[17px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
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
                  className={`group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-base border transition-all duration-300 cursor-pointer ${
                    isDark
                      ? 'bg-[#0f1322] hover:bg-[#161c33] text-white border-white/15 hover:border-purple-500/40 shadow-lg'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-md'
                  }`}
                >
                  <span>Explore Messaging</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Handwritten Doodle */}
                <div className="font-handwriting text-2xl sm:text-3xl text-purple-300 -rotate-2 select-none flex items-center gap-1.5 text-right">
                  <span className="leading-tight">Good People<br />Great Conversations</span>
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
