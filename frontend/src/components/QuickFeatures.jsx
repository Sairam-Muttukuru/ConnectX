import React from 'react';
import {
  MessageSquare,
  Video,
  Users,
  ShieldCheck,
  UserPlus,
  Lock
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const features = [
  {
    icon: MessageSquare,
    title: 'Chat Freely',
    subtitle: 'Real-time, reliable and always in sync',
    glow: 'from-blue-500/25 to-indigo-500/25',
    iconBg: 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
  },
  {
    icon: Video,
    title: 'HD Audio & Video',
    subtitle: 'Crystal clear calls anytime, anywhere',
    glow: 'from-blue-600/25 to-purple-600/25',
    iconBg: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
  },
  {
    icon: Users,
    title: 'Group Together',
    subtitle: 'Create communities around what you love',
    glow: 'from-purple-500/25 to-pink-500/25',
    iconBg: 'bg-purple-600/20 text-purple-400 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
  },
  {
    icon: ShieldCheck,
    title: 'Your Privacy',
    subtitle: 'Public or private profile — you decide',
    glow: 'from-cyan-500/25 to-blue-500/25',
    iconBg: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
  },
  {
    icon: UserPlus,
    title: 'Friends & Requests',
    subtitle: 'Find, add, and grow your network',
    glow: 'from-violet-500/25 to-purple-500/25',
    iconBg: 'bg-violet-600/20 text-violet-400 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    subtitle: 'Your conversations, truly yours',
    glow: 'from-blue-500/25 to-teal-500/25',
    iconBg: 'bg-sky-600/20 text-sky-400 border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
  }
];

export default function QuickFeatures({ isDark }) {
  return (
    <section id="features" className={`py-12 sm:py-16 relative transition-colors duration-300 ${
      isDark ? 'bg-transparent' : 'bg-slate-50/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={idx}
                direction="up"
                delay={0.08 * idx}
                duration={0.7}
                className="h-full"
              >
                <div
                  className={`group relative h-full flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border backdrop-blur-xl transition-all duration-400 hover:-translate-y-1.5 cursor-pointer ${
                    isDark
                      ? 'bg-[#090c17]/85 border-white/10 hover:border-purple-500/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)]'
                      : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg'
                  }`}
                >
                  {/* Subtle background glow on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${item.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none -z-10`}
                  />

                  {/* Icon with glowing container */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300 ${item.iconBg}`}>
                    <Icon className="w-5 h-5 fill-current/10" />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xs sm:text-sm font-bold mb-1.5 leading-snug transition-colors ${
                    isDark ? 'text-white group-hover:text-purple-200' : 'text-slate-900 group-hover:text-purple-700'
                  }`}>
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  <p className={`text-[11px] sm:text-xs leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {item.subtitle}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
