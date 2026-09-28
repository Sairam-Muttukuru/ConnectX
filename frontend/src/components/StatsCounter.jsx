import React from 'react';
import { Users, MessageSquare, Users2, Globe, Heart } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const stats = [
  {
    icon: Users,
    value: '100K+',
    label: 'Active Users',
    color: 'text-blue-400',
    iconBg: 'bg-blue-600/20 border-blue-500/30'
  },
  {
    icon: MessageSquare,
    value: '1M+',
    label: 'Messages Daily',
    color: 'text-purple-400',
    iconBg: 'bg-purple-600/20 border-purple-500/30'
  },
  {
    icon: Users2,
    value: '50K+',
    label: 'Groups Created',
    color: 'text-indigo-400',
    iconBg: 'bg-indigo-600/20 border-indigo-500/30'
  },
  {
    icon: Globe,
    value: '180+',
    label: 'Countries',
    color: 'text-cyan-400',
    iconBg: 'bg-cyan-600/20 border-cyan-500/30'
  },
  {
    icon: Heart,
    value: '4.8/5',
    label: 'User Rating',
    color: 'text-pink-400',
    iconBg: 'bg-pink-600/20 border-pink-500/30'
  }
];

export default function StatsCounter({ isDark }) {
  return (
    <section className="py-10 sm:py-14 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="zoom" delay={0.1} duration={0.9}>
          <div className={`relative rounded-3xl p-5 sm:p-7 border backdrop-blur-2xl transition-all shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${
            isDark
              ? 'bg-[#0a0d1b]/80 border-white/10'
              : 'bg-white/90 border-slate-200 shadow-md'
          }`}>
            
            {/* Ambient top highlight line */}
            <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3.5 ${
                      idx > 0 && idx < 2 ? 'pt-4 sm:pt-0' : ''
                    } ${idx >= 2 ? 'pt-4 md:pt-0' : ''} ${idx > 0 ? 'md:pl-5 lg:pl-6' : ''}`}
                  >
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                      <Icon className={`w-5 h-5 ${stat.color} fill-current/15`} />
                    </div>
                    <div className="text-left min-w-0">
                      <div className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs font-medium truncate ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {stat.label}
                      </div>
                    </div>
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
