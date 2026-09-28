import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function RealRelationships({ onNavigate, isDark }) {
  const perks = [
    'Unique usernames for everyone',
    'Share photos, videos, files and more',
    'Safe, secure, and ad-free experience',
    'Make friends, join groups, and grow your world'
  ];

  return (
    <section id="why-connectx" className={`py-20 lg:py-28 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#06080F]' : 'bg-[#fcfdfe]'
    }`}>
      {/* Background ambient cosmic glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/15 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle, Checklist & CTA */}
          <div className="lg:col-span-6 text-left relative z-10">
            {/* Small Eyebrow */}
            <ScrollReveal direction="down" delay={0.1} duration={0.8}>
              <div className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-purple-400/90 mb-4">
                CONNECT A BRIGHTER TOMORROW
              </div>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal direction="up" delay={0.2} duration={0.9}>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Designed for
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400">
                  Real Relationships
                </span>
              </h2>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delay={0.3} duration={0.9}>
              <p className={`text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-normal ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Whether it's a quick chat, a late-night call, or a global group hangout, ConnectX gives you the freedom to communicate on your terms. Share moments, create communities, and be part of something real.
              </p>
            </ScrollReveal>

            {/* 4 Checkmark Perks */}
            <ScrollReveal direction="up" delay={0.4} duration={0.9}>
              <div className="space-y-3.5 mb-9">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {perk}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* CTA Button */}
            <ScrollReveal direction="up" delay={0.5} duration={0.9}>
              <div>
                <button
                  onClick={() => onNavigate ? onNavigate('signup') : null}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_40px_rgba(124,58,237,0.8)] hover:scale-[1.02] active:scale-98 transition-all duration-300 cursor-pointer"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: 3D Glowing Earth Globe with Connected Avatars */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="zoom" delay={0.3} duration={1.1} className="relative">
              <div className="relative mx-auto max-w-[540px] aspect-square flex items-center justify-center">
                
                {/* Outer Glow Halo behind Globe */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-pink-500/20 blur-[60px] pointer-events-none" />

                {/* 3D Glowing Earth Image */}
                <div className="relative w-[340px] sm:w-[420px] aspect-square rounded-full overflow-hidden shadow-[0_0_60px_rgba(124,58,237,0.35),0_0_100px_rgba(59,130,246,0.25)] border border-purple-500/30 group">
                  <img
                    src="/images/globe.jpg"
                    alt="Connected Global Community"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  {/* Subtle radial inner shadow */}
                  <div className="absolute inset-0 rounded-full bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />
                </div>

                {/* --- Floating Connected Avatar Badges --- */}

                {/* Badge 1: Top ("New friendships across the world 🌍") */}
                <div className="absolute -top-3 sm:top-2 left-12 sm:left-20 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0d1020]/90 border border-purple-400/40 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(168,85,247,0.35)] hover:scale-105 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Priya"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-400"
                  />
                  <span className="text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap">
                    New friendships across the world 🌍
                  </span>
                </div>

                {/* Badge 2: Right ("Ideas. Friends. Opportunities.") */}
                <div className="absolute top-1/4 -right-4 sm:-right-8 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0d1020]/90 border border-blue-400/40 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(59,130,246,0.35)] hover:scale-105 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Alex"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-400"
                  />
                  <span className="text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap">
                    Ideas. Friends. Opportunities.
                  </span>
                </div>

                {/* Badge 3: Bottom Left ("Different people. One global community.") */}
                <div className="absolute -bottom-4 sm:bottom-4 left-0 sm:left-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0d1020]/90 border border-pink-400/40 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(244,114,182,0.35)] hover:scale-105 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                    alt="Elena"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-pink-400"
                  />
                  <div className="text-left leading-tight">
                    <span className="text-[11px] sm:text-xs font-semibold text-white block">
                      Different people
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-300">
                      One global community.
                    </span>
                  </div>
                </div>

                {/* Circular Avatar Pins on the Globe */}
                {/* Pin 1: West */}
                <div className="absolute top-1/2 left-10 sm:left-14 z-10">
                  <div className="relative">
                    <span className="absolute -inset-1 rounded-full bg-purple-500 animate-ping opacity-60" />
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
                      alt="Pin 1"
                      className="relative w-8 h-8 rounded-full object-cover ring-2 ring-purple-400 shadow-lg"
                    />
                  </div>
                </div>

                {/* Pin 2: Center Top */}
                <div className="absolute top-14 sm:top-20 right-28 sm:right-36 z-10">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80"
                    alt="Pin 2"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-cyan-400 shadow-lg"
                  />
                </div>

                {/* Pin 3: East */}
                <div className="absolute top-1/2 right-6 sm:right-10 z-10">
                  <div className="relative">
                    <span className="absolute -inset-1 rounded-full bg-blue-500 animate-ping opacity-50" />
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                      alt="Pin 3"
                      className="relative w-7 h-7 rounded-full object-cover ring-2 ring-blue-400 shadow-lg"
                    />
                  </div>
                </div>

                {/* Pin 4: South */}
                <div className="absolute bottom-16 sm:bottom-20 right-20 sm:right-28 z-10">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&auto=format&fit=crop&q=80"
                    alt="Pin 4"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-400 shadow-lg"
                  />
                </div>

                {/* Pin 5: South Center */}
                <div className="absolute bottom-20 sm:bottom-24 left-36 sm:left-44 z-10">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=80"
                    alt="Pin 5"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-fuchsia-400 shadow-lg"
                  />
                </div>

                {/* Handwritten Note: Right Side of Globe */}
                <div className="hidden sm:flex flex-col items-end gap-1 absolute -bottom-10 -right-8 z-30 font-handwriting text-2xl text-purple-300 rotate-6 pointer-events-none select-none text-right">
                  <p className="leading-snug">
                    A more connected world<br />starts with you.
                  </p>
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
