import React from 'react';
import { ArrowRight, Globe, Users, Sparkles, MapPin } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function GlobalCommunity({ isDark }) {
  const mapPins = [
    { x: '24%', y: '36%', name: 'Alex', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    { x: '48%', y: '32%', name: 'Elena', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' },
    { x: '52%', y: '58%', name: 'Kofi', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80' },
    { x: '72%', y: '40%', name: 'Priya', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
    { x: '82%', y: '68%', name: 'Liam', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=80' }
  ];

  return (
    <section id="community" className={`py-24 sm:py-32 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#080b15]' : 'bg-slate-50'
    }`}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Photo Collage & Handwritten Story */}
          <div className="lg:col-span-6 relative">
            {/* Handwritten Note (Top Left) */}
            <div className="absolute -top-10 left-4 z-20 font-handwriting text-2xl text-purple-400 rotate-[-4deg] select-none pointer-events-none">
              <span>New places, New people, Better stories</span>
              <span className="text-pink-400 ml-1 text-3xl">♡</span>
            </div>

            <div className="relative pt-6">
              {/* Main Traveler Photo */}
              <ScrollReveal direction="right" delay={0.2} duration={0.9}>
                <div className={`relative rounded-3xl overflow-hidden shadow-2xl border ${
                  isDark ? 'border-white/15 bg-slate-900' : 'border-slate-200 bg-white'
                } group`}>
                  <img
                    src="/images/sunrise_traveler.jpg"
                    alt="Traveler exploring sunrise"
                    className="w-full h-[320px] sm:h-[380px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Badge on Main Photo */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-2.5 text-white text-xs shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                      alt="Friend"
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-white"
                    />
                    <div className="text-left">
                      <span className="font-semibold block text-white text-[11px] leading-tight">Friends</span>
                      <span className="text-[9px] text-purple-300">Everywhere</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Sub-Card 1: Campfire & Alpine Lake Thumbnail */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-8 -left-6 z-20">
                <div className={`w-36 h-24 rounded-2xl overflow-hidden shadow-2xl border-2 ${
                  isDark ? 'border-purple-500/40 bg-slate-900' : 'border-white bg-white'
                }`}>
                  <img
                    src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=300&auto=format&fit=crop&q=80"
                    alt="Campfire friends"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className={`w-28 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 ${
                  isDark ? 'border-blue-500/40 bg-slate-900' : 'border-white bg-white'
                }`}>
                  <img
                    src="/images/mountain.jpg"
                    alt="Scenic lake"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Interactive Dotted World Map */}
          <div className="lg:col-span-6 text-left">
            <ScrollReveal direction="down" delay={0.1} duration={0.8}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-xs font-semibold text-purple-400 tracking-wider uppercase mb-4">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>A GLOBAL COMMUNITY</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2} duration={0.9}>
              <h2 className={`text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight mb-5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Different people.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
                  Infinite possibilities.
                </span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3} duration={0.9}>
              <p className={`text-base sm:text-lg leading-relaxed mb-8 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                No matter where you are, ConnectX helps you meet amazing people, explore new cultures, and build friendships that go beyond borders.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4} duration={0.9}>
              <a
                href="#get-started"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 mb-10"
              >
                <span>Join the Community</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </ScrollReveal>

            {/* Dotted World Map Graphic with Pinned Avatars */}
            <ScrollReveal direction="up" delay={0.5} duration={0.9}>
              <div className={`relative rounded-3xl p-5 sm:p-6 border overflow-hidden transition-colors ${
                isDark ? 'bg-[#0c1022]/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                {/* SVG Dotted World Grid Pattern */}
                <div className="relative w-full aspect-[2/1] max-h-[220px]">
                  <svg className={`w-full h-full ${isDark ? 'opacity-30' : 'opacity-20'}`} viewBox="0 0 800 400" fill="none">
                    <defs>
                      <pattern id="dotPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill={isDark ? '#818cf8' : '#6366f1'} />
                      </pattern>
                    </defs>
                    <rect width="800" height="400" fill="url(#dotPattern)" />
                  </svg>

                  {/* Member Pins on Continents */}
                  {mapPins.map((pin, i) => (
                    <div
                      key={i}
                      className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: pin.x, top: pin.y }}
                    >
                      <div className="relative">
                        <span className="absolute -inset-1 rounded-full bg-purple-500/40 animate-ping"></span>
                        <img
                          src={pin.img}
                          alt={pin.name}
                          className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-purple-500 shadow-lg group-hover:scale-125 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-medium shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 ${
                        isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
                      }`}>
                        {pin.name}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Global Connection Badge */}
                <div className={`mt-3 pt-3 border-t flex items-center justify-between gap-3 ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {mapPins.slice(0, 3).map((p, idx) => (
                        <img
                          key={idx}
                          src={p.img}
                          alt="Global member"
                          className="w-6 h-6 rounded-full object-cover ring-2 ring-purple-500"
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      People around the world are connecting on ConnectX
                    </span>
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </section>
  );
}
