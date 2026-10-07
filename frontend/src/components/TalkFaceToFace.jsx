import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  MessageSquare,
  Volume2
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function TalkFaceToFace({ onOpenVideo, onNavigate, isDark }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const perks = [
    'HD video & crystal clear audio',
    'One-to-one and group calls',
    'Screen sharing (coming soon)',
    'Low latency, reliable connections'
  ];

  return (
    <section id="security" className={`py-16 sm:py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#06080F]' : 'bg-[#f8fafc]'
    }`}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Checklist & CTA */}
          <div className="lg:col-span-6 text-left relative z-10">
            {/* Eyebrow */}
            <ScrollReveal direction="down" delay={0.1} duration={0.8}>
              <div className="text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase text-[#D946EF] mb-4">
                SEE, HEAR, FEEL CLOSER
              </div>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal direction="up" delay={0.2} duration={0.9}>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-black tracking-tight leading-[1.12] mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Talk face to face.
              </h2>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delay={0.3} duration={0.9}>
              <p className={`text-base sm:text-lg lg:text-xl leading-relaxed mb-9 max-w-xl font-normal ${
                isDark ? 'text-slate-200' : 'text-slate-600'
              }`}>
                High-quality audio and video calls that bring you closer, no matter where you are.
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

            {/* CTA Button */}
            <ScrollReveal direction="up" delay={0.5} duration={0.9}>
              <div>
                <button
                  onClick={() => onNavigate ? onNavigate('signup') : null}
                  className={`group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-base border transition-all duration-300 cursor-pointer ${
                    isDark
                      ? 'bg-[#0f1322] hover:bg-[#161c33] text-white border-white/15 hover:border-purple-500/40 shadow-lg'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-md'
                  }`}
                >
                  <span>Start Talking Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: 16:9 Video Conference Mockup Card */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="zoom" delay={0.2} duration={1.0}>
              <div className="relative mx-auto lg:ml-auto max-w-[620px]">
                
                {/* Video Call Frame */}
                <div className="rounded-[28px] overflow-hidden border border-white/20 bg-black shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.2)] aspect-[16/10] relative group">
                  
                  {/* Priya Video Feed */}
                  <img
                    src="/images/priya_call.jpg"
                    alt="Priya Video Call"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Top Bar with Timer */}
                  <div className="absolute top-3.5 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>00:15</span>
                  </div>

                  {/* Top-Right PiP of Callers (Rohan & Maya) */}
                  <div className="absolute top-3.5 right-4 z-20 flex items-center gap-2">
                    {/* Participant 1: Maya with headphones */}
                    <div className="w-18 sm:w-22 aspect-[4/3] rounded-xl overflow-hidden border border-white/30 shadow-2xl bg-black relative">
                      <img
                        src="/images/girl_call.jpg"
                        alt="Maya"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 left-1 text-[8px] text-white bg-black/60 px-1 rounded">Maya</span>
                    </div>

                    {/* Participant 2: Rohan */}
                    <div className="w-18 sm:w-22 aspect-[4/3] rounded-xl overflow-hidden border border-white/30 shadow-2xl bg-black relative">
                      <img
                        src="/images/rohan_call.jpg"
                        alt="Rohan"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 left-1 text-[8px] text-white bg-black/60 px-1 rounded">Rohan</span>
                    </div>
                  </div>

                  {/* Floating Bottom Conference Controls Bar */}
                  <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center px-4">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#0d1020]/90 border border-white/15 backdrop-blur-xl shadow-2xl">
                      {/* Audio */}
                      <button className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer" title="Audio Settings">
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {/* Mic */}
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                          isMuted ? 'bg-red-500 text-white' : 'text-slate-300 hover:text-white'
                        }`}
                        title="Toggle Mic"
                      >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>

                      {/* Video */}
                      <button
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                          isVideoOff ? 'bg-red-500 text-white' : 'text-slate-300 hover:text-white'
                        }`}
                        title="Toggle Video"
                      >
                        {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      </button>

                      {/* End Call Button (Red) */}
                      <button
                        onClick={onOpenVideo}
                        className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                        title="End Call"
                      >
                        <PhoneOff className="w-4 h-4" />
                      </button>

                      {/* Screen Share */}
                      <button onClick={onOpenVideo} className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer" title="Share Screen">
                        <Share2 className="w-4 h-4" />
                      </button>

                      {/* In-Call Chat */}
                      <button onClick={onOpenVideo} className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer" title="Chat">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Handwritten Doodle on the Right */}
                <div className="hidden sm:flex flex-col items-end absolute -top-8 -right-8 z-30 font-handwriting text-2xl text-purple-300 rotate-6 pointer-events-none select-none text-right">
                  <span>Distance means nothing</span>
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
