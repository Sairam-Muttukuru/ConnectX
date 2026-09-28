import React from 'react';
import { ArrowRight, Shield, Check, Lock, Globe } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function CityscapeCTA({ onOpenVideo, onNavigate, isDark }) {
  const bottomBadges = [
    { icon: Shield, text: 'No phone number required' },
    { icon: Check, text: 'Free to use' },
    { icon: Lock, text: 'Your data, your control' },
    { icon: Globe, text: 'A global community' }
  ];

  return (
    <section id="signup" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={0.2} duration={1.0}>
          <div className="relative rounded-[32px] overflow-hidden border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(139,92,246,0.25)] min-h-[460px] flex flex-col justify-between p-8 sm:p-12 lg:p-14">
            
            {/* Background Image: Night Cityscape with Person Silhouette */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/cityscape.jpg"
                alt="Cityscape Overlook"
                className="w-full h-full object-cover object-left sm:object-center"
              />
              {/* Dark gradient overlay for perfect readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/30" />
            </div>

            {/* Top Right Handwritten Doodle */}
            <div className="relative z-10 flex justify-end">
              <div className="font-handwriting text-2xl sm:text-3xl text-purple-300 rotate-2 select-none flex flex-col items-end text-right">
                <span className="leading-tight">Better Connections<br />A Brighter Tomorrow</span>
                <span className="text-pink-400 text-3xl">♡</span>
              </div>
            </div>

            {/* Center Content Area */}
            <div className="relative z-10 max-w-2xl text-left space-y-5 my-auto">
              <div className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-purple-400/90">
                A BRIGHTER, MORE CONNECTED TOMORROW
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Be Part of Something Real.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                Join ConnectX today and experience a safer, smarter, and more meaningful way to connect with people around the world.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate ? onNavigate('signup') : null}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_40px_rgba(124,58,237,0.8)] hover:scale-[1.02] active:scale-98 transition-all duration-300 cursor-pointer"
                >
                  <span>Create Your Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenVideo}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/40 hover:bg-black/60 text-white font-semibold text-sm border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all duration-300 cursor-pointer"
                >
                  <span>Learn More</span>
                </button>
              </div>
            </div>

            {/* Bottom 4 Feature Pill Badges */}
            <div className="relative z-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              {bottomBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0d1a]/80 border border-white/10 backdrop-blur-md text-xs font-medium text-slate-300"
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-400" />
                    <span>{badge.text}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
