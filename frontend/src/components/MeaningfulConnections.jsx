import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Phone,
  PhoneOff,
  Video,
  Mic,
  Smile,
  Plus,
  Users,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function MeaningfulConnections({ onOpenVideo, isDark }) {
  return (
    <section id="how-it-works" className={`py-24 sm:py-32 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#06080F]' : 'bg-[#f8fafc]'
    }`}>
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-4 text-left">
            <ScrollReveal direction="down" delay={0.1} duration={0.8}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-4 ${
                isDark
                  ? 'bg-purple-500/10 border border-purple-500/25 text-purple-300'
                  : 'bg-purple-50 border border-purple-200 text-purple-700'
              }`}>
                <span>CHAT, CALL, SHARE, BELONG</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2} duration={0.9}>
              <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] mb-5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Conversations that{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
                  feel real.
                </span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3} duration={0.9}>
              <p className={`text-base sm:text-lg leading-relaxed mb-8 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                From everyday chats to late-night calls, ConnectX brings you closer to the people who matter. Share moments, ideas, and experiences — all in one place.
              </p>
            </ScrollReveal>

            {/* CTA Button */}
            <ScrollReveal direction="up" delay={0.4} duration={0.9}>
              <button
                onClick={onOpenVideo}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </ScrollReveal>
          </div>

          {/* Right Column: 3 Connected Interactive Cards */}
          <div className="lg:col-span-8 relative">
            {/* Handwritten Annotation: Groups that bring people together */}
            <div className="hidden sm:flex items-center gap-2 absolute -top-12 right-6 z-20 font-handwriting text-2xl text-purple-400 rotate-2 pointer-events-none select-none">
              <svg className="w-8 h-8 text-purple-400 -scale-y-100 mr-1" viewBox="0 0 30 30" fill="none">
                <path d="M5 25 C 10 12, 18 8, 25 6 M 25 6 L 19 12 M 25 6 L 18 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Groups that bring people together</span>
              <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
              
              {/* Card 1: Chat Window with Rohan */}
              <ScrollReveal direction="up" delay={0.15} duration={0.9} className="h-full">
                <div className={`h-full flex flex-col justify-between rounded-3xl p-4 border transition-all duration-500 shadow-xl ${
                  isDark
                    ? 'bg-[#0b0f20]/90 border-white/10'
                    : 'bg-white border-slate-200'
                }`}>
                  {/* Chat Header */}
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                    <img
                      src="/images/rohan_call.jpg"
                      alt="Rohan"
                      className="w-9 h-9 rounded-full object-cover object-top ring-2 ring-purple-500"
                    />
                    <div className="text-left">
                      <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Rohan</h4>
                      <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                    </div>
                  </div>

                  {/* Message Bubbles */}
                  <div className="py-4 space-y-3 text-xs text-left flex-1">
                    <div className={`p-2.5 rounded-2xl rounded-bl-xs max-w-[85%] ${
                      isDark ? 'bg-[#181e36] text-slate-200' : 'bg-slate-100 text-slate-800'
                    }`}>
                      <p>Are you coming today?</p>
                      <span className="text-[9px] text-slate-400 mt-0.5 block text-right">10:34 AM</span>
                    </div>

                    <div className="flex justify-end">
                      <div className="p-2.5 rounded-2xl rounded-br-xs max-w-[85%] bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm">
                        <p>Yes! See you there 🚀</p>
                        <span className="text-[9px] text-purple-200 mt-0.5 block text-right">10:34 AM</span>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-2xl rounded-bl-xs max-w-[85%] ${
                      isDark ? 'bg-[#181e36] text-slate-200' : 'bg-slate-100 text-slate-800'
                    }`}>
                      <p>Can't wait!</p>
                      <span className="text-[9px] text-slate-400 mt-0.5 block text-right">10:35 AM</span>
                    </div>
                  </div>

                  {/* Input Simulation */}
                  <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Plus className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400 flex-1 text-left">Type a message...</span>
                    <Smile className="w-3.5 h-3.5 text-slate-400" />
                    <Mic className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 2: Rohan Video Call Frame */}
              <ScrollReveal direction="up" delay={0.3} duration={0.9} className="h-full">
                <div
                  onClick={onOpenVideo}
                  className={`group h-full relative rounded-3xl overflow-hidden p-2 border shadow-xl flex flex-col justify-between cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                    isDark ? 'bg-[#0b0f20]/90 border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-950 flex flex-col justify-between p-3">
                    <img
                      src="/images/rohan_call.jpg"
                      alt="Rohan in Call"
                      className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Tag */}
                    <div className="relative z-10 flex items-center justify-between text-white text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 font-semibold">HD LIVE</span>
                      <span className="font-mono text-purple-300">12:45</span>
                    </div>

                    {/* User PiP in Top Right */}
                    <div className="absolute top-8 right-3 w-12 h-16 rounded-lg overflow-hidden border border-white/50 shadow-md bg-slate-900 z-10">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                        alt="Caller"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Bottom Call Controls */}
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <Mic className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
                        <PhoneOff className="w-4 h-4" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <Video className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 3: Travel Buddies Group Card */}
              <ScrollReveal direction="up" delay={0.45} duration={0.9} className="h-full">
                <div className={`h-full flex flex-col justify-between rounded-3xl p-4 border transition-all duration-500 shadow-xl text-left ${
                  isDark
                    ? 'bg-[#0b0f20]/90 border-white/10'
                    : 'bg-white border-slate-200'
                }`}>
                  <div>
                    {/* Group Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Travel Buddies</h4>
                        <span className="text-[11px] text-slate-400">12 members</span>
                      </div>
                    </div>

                    {/* Member List */}
                    <div className="py-3 space-y-2.5">
                      {/* Rohan */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src="/images/rohan_call.jpg"
                            alt="Rohan"
                            className="w-7 h-7 rounded-full object-cover object-top ring-1 ring-purple-500"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Rohan</span>
                              <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-400 font-bold">Admin</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 block">Online</span>
                          </div>
                        </div>
                      </div>

                      {/* Priya */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                            alt="Priya"
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500"
                          />
                          <div>
                            <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Priya</span>
                            <span className="text-[10px] text-emerald-400 block">Online</span>
                          </div>
                        </div>
                      </div>

                      {/* Karan */}
                      <div className="flex items-center justify-between opacity-80">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                            alt="Karan"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Karan</span>
                            <span className="text-[10px] text-slate-500 block">Last seen 2h ago</span>
                          </div>
                        </div>
                      </div>

                      {/* Sneha */}
                      <div className="flex items-center justify-between opacity-80">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                            alt="Sneha"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Sneha</span>
                            <span className="text-[10px] text-slate-500 block">Last seen 4h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Members Button */}
                  <button className="w-full py-2.5 px-4 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-purple-500/20">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Members</span>
                  </button>
                </div>
              </ScrollReveal>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
