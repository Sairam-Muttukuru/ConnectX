import React, { useState } from 'react';
import {
  Play,
  Pause,
  ArrowRight,
  Phone,
  Video,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Paperclip,
  Smile,
  Search,
  Users,
  Bell,
  User,
  MessageSquare,
  MoreVertical,
  UserPlus,
  Bookmark,
  Settings,
  Star,
  RefreshCw,
  ChevronLeft
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function Hero({ onOpenVideo, onNavigate, isDark }) {
  // Interactive Chat State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'priya', type: 'text', text: "Hey! Are you free to talk?", time: '10:24 AM' },
    { id: 2, sender: 'priya', type: 'audio', duration: '0:28', time: '10:24 AM' },
    {
      id: 3,
      sender: 'priya',
      type: 'image',
      image: '/images/mountain.jpg',
      caption: 'Look at this view! 🏞️',
      time: '10:24 AM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPhoneMuted, setIsPhoneMuted] = useState(false);
  const [isPhoneVideoOff, setIsPhoneVideoOff] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'me',
      type: 'text',
      text: inputValue,
      time: '10:25 AM'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        'Awesome! Joining the call now 💜',
        'ConnectX feels so smooth and fast ✨',
        'Love having no phone number required 🙌'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'priya',
          type: 'text',
          text: randomReply,
          time: '10:25 AM'
        }
      ]);
    }, 1200);
  };

  return (
    <section id="home" className={`relative pt-32 sm:pt-36 pb-16 lg:pt-40 lg:pb-24 overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#080A11]' : 'bg-[#fcfdfe]'
    }`}>
      {/* Ambient Lighting Background Halos */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-purple-700/20 via-indigo-600/15 to-blue-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-28 w-[550px] h-[550px] bg-fuchsia-600/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text, CTAs, Stats & Social Proof */}
          <div className="lg:col-span-5 text-left relative z-10">
            {/* Top Eyebrow Tag */}
            <ScrollReveal direction="down" delay={0.1} duration={0.8}>
              <div className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#D946EF] mb-5">
                A MORE HUMAN WAY TO CONNECT
              </div>
            </ScrollReveal>

            {/* Main Headline */}
            <ScrollReveal direction="up" delay={0.2} duration={0.9}>
              <h1 className="text-5xl sm:text-6xl xl:text-[68px] font-black tracking-tight leading-[1.05] mb-6 text-white">
                Real<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#EC4899]">
                  Conversations
                </span><br />
                Without Limits.
              </h1>
            </ScrollReveal>

            {/* Subtitle Description */}
            <ScrollReveal direction="up" delay={0.3} duration={0.9}>
              <p className="text-base sm:text-lg leading-relaxed max-w-lg mb-8 font-normal text-slate-300">
                Chat, call, and build meaningful relationships — without a phone number. Just your email, your unique username, and a world full of people to connect with.
              </p>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal direction="up" delay={0.4} duration={0.9}>
              <div className="flex flex-wrap items-center gap-4 mb-9">
                <button
                  onClick={() => onNavigate ? onNavigate('signup') : null}
                  className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#9333EA] text-white font-semibold text-sm shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:shadow-[0_0_45px_rgba(147,51,234,0.85)] hover:scale-[1.02] active:scale-98 transition-all duration-300 cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenVideo}
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-full font-semibold text-sm bg-[#131624] hover:bg-[#1A1F33] text-white border border-white/10 backdrop-blur-md transition-all duration-300 group cursor-pointer shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-[#6B21A8] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3 h-3 text-white fill-current ml-0.5" />
                  </div>
                  <span>Watch Video</span>
                </button>
              </div>
            </ScrollReveal>

            {/* Hero Live Stats Row */}
            <ScrollReveal direction="up" delay={0.45} duration={0.9}>
              <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-1 mb-8 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-white block text-sm sm:text-base leading-tight">100K+</span>
                    <span className="text-[11px] text-slate-400">Active Users</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-white block text-sm sm:text-base leading-tight">50K+</span>
                    <span className="text-[11px] text-slate-400">Groups Created</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-indigo-400/40 text-indigo-400" />
                  </div>
                  <div>
                    <span className="font-extrabold text-white block text-sm sm:text-base leading-tight">4.8/5</span>
                    <span className="text-[11px] text-slate-400">User Rating</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Member Avatars Proof Row */}
            <ScrollReveal direction="up" delay={0.5} duration={0.9}>
              <div className="flex items-center gap-3 pt-1">
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
                      alt="ConnectX User"
                      className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-[#080A11] object-cover hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-300">
                  People from around the world are connecting on ConnectX!
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Tablet & Vertical Smartphone Mockup */}
          <div className="lg:col-span-7 relative">
            
            {/* Top Right Handwritten Doodle Annotation */}
            <div className="hidden md:flex flex-col items-end absolute -top-11 right-12 z-30 font-handwriting text-2xl sm:text-[28px] text-[#F472B6] pointer-events-none select-none text-right">
              <span className="rotate-2 font-bold tracking-wide">More than just messages</span>
              <svg className="w-10 h-10 text-[#00E5FF] mt-1 mr-4" viewBox="0 0 40 40" fill="none">
                <path
                  d="M8 6C16 8 24 16 27 28M27 28L21 26M27 28L28 21"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Sound / Vibe Burst Lines */}
            <div className="hidden sm:flex flex-col items-center gap-1.5 absolute top-[52%] -right-3 z-30 select-none pointer-events-none">
              <div className="w-3.5 h-0.5 bg-[#EC4899] rotate-45 rounded-full shadow-[0_0_8px_#EC4899]" />
              <div className="w-4 h-0.5 bg-[#EC4899] rounded-full shadow-[0_0_8px_#EC4899]" />
              <div className="w-3.5 h-0.5 bg-[#EC4899] -rotate-45 rounded-full shadow-[0_0_8px_#EC4899]" />
            </div>

            {/* Cute Pink Outline Heart at Bottom Right */}
            <div className="hidden sm:block absolute -bottom-5 right-10 z-30 select-none pointer-events-none">
              <svg className="w-8 h-8 text-[#EC4899] -rotate-12 filter drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            {/* Main Mockup Showcase Wrapper */}
            <ScrollReveal direction="zoom" delay={0.3} duration={1.1} className="relative">
              <div className="relative mx-auto max-w-[650px]">
                
                {/* 1. Tablet Mockup (Angled Dark Screen Chassis) */}
                <div className="relative rounded-[28px] p-2.5 bg-gradient-to-b from-white/10 via-white/5 to-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.2)] border border-slate-800/80 backdrop-blur-2xl mr-12 sm:mr-16">
                  <div className="rounded-[20px] bg-[#0E131F] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col h-[480px]">
                    
                    {/* Tablet Top Search & Titlebar */}
                    <div className="h-11 bg-[#090C15] border-b border-white/5 px-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="/images/connectx_logo.png"
                          alt="ConnectX"
                          className="w-5 h-5 rounded-md object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                        />
                        <span className="font-bold text-white text-xs">ConnectX</span>
                      </div>

                      {/* Search bar */}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141A28] rounded-full text-slate-400 text-[11px] w-48 sm:w-60 border border-white/5">
                        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-400 truncate">Search people, groups...</span>
                      </div>

                      {/* Top Action Icons */}
                      <div className="flex items-center gap-2.5 text-slate-400">
                        <button onClick={onOpenVideo} className="hover:text-purple-400 transition-colors p-1" title="Video Call">
                          <Video className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={onOpenVideo} className="hover:text-purple-400 transition-colors p-1" title="Audio Call">
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button className="hover:text-purple-400 transition-colors p-1" title="Add Contact">
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                        <button className="hover:text-purple-400 transition-colors p-1" title="Menu">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Tablet Workspace Inner Grid */}
                    <div className="flex flex-1 overflow-hidden">
                      
                      {/* Left Thin Sidebar Dock */}
                      <div className="w-11 bg-[#070911] border-r border-white/5 flex flex-col items-center py-3 justify-between">
                        <div className="flex flex-col items-center gap-3.5">
                          <button className="relative p-2 text-purple-400 bg-purple-500/15 rounded-xl">
                            <MessageSquare className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                              3
                            </span>
                          </button>
                          <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
                            <User className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
                            <Users className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
                            <Bell className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Chat List Column */}
                      <div className="w-44 sm:w-48 bg-[#0C101C] border-r border-white/5 flex flex-col text-left overflow-y-auto no-scrollbar">
                        <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2.5">
                          CHATS
                        </div>

                        {/* Priya Thread (Active Selected Item) */}
                        <div className="p-2.5 bg-[#17182E] border-l-2 border-[#7C3AED] flex items-center gap-2 cursor-pointer">
                          <div className="relative shrink-0">
                            <img
                              src="/images/priya_call.jpg"
                              alt="Priya"
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500"
                            />
                            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-[#080a12]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold text-white truncate">Priya</span>
                              <span className="text-[9px] text-purple-300 font-mono">10:24 AM</span>
                            </div>
                            <p className="text-[10px] text-purple-200 truncate">Hey! Are you free to ta...</p>
                          </div>
                        </div>

                        {/* Travel Buddies */}
                        <div className="p-2.5 hover:bg-white/[0.02] flex items-center gap-2 cursor-pointer opacity-85">
                          <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0 ring-1 ring-blue-500/30">
                            TB
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-medium text-slate-200 truncate">Travel Buddies</span>
                              <span className="text-[9px] text-slate-500">8:05 AM</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">Neha: Amazing view! 🏞️</p>
                          </div>
                        </div>

                        {/* Alex */}
                        <div className="p-2.5 hover:bg-white/[0.02] flex items-center gap-2 cursor-pointer opacity-85">
                          <img
                            src="/images/boy_1.jpg"
                            alt="Alex"
                            className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-blue-400/50"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-medium text-slate-200 truncate">Alex</span>
                              <span className="text-[9px] text-slate-500">9:18 AM</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">Let's catch up later!</p>
                          </div>
                        </div>

                        {/* College Crew */}
                        <div className="p-2.5 hover:bg-white/[0.02] flex items-center gap-2 cursor-pointer opacity-85">
                          <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 ring-1 ring-indigo-500/30">
                            CC
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-medium text-slate-200 truncate">College Crew</span>
                              <span className="text-[9px] text-slate-500">10:10</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">Meeting tonight!</p>
                          </div>
                        </div>

                        {/* Movie Lovers */}
                        <div className="p-2.5 hover:bg-white/[0.02] flex items-center gap-2 cursor-pointer opacity-85">
                          <div className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-400 font-bold flex items-center justify-center text-[10px] shrink-0 ring-1 ring-purple-500/30">
                            🎬
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-medium text-slate-200 truncate">Movie Lovers</span>
                              <span className="text-[9px] text-slate-500">Yesterday</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">Rahul: New release!</p>
                          </div>
                        </div>

                        {/* Sneha */}
                        <div className="p-2.5 hover:bg-white/[0.02] flex items-center gap-2 cursor-pointer opacity-85">
                          <img
                            src="/images/girl_1.jpg"
                            alt="Sneha"
                            className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-purple-400/50"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-slate-200 truncate block">Sneha</span>
                            <p className="text-[10px] text-slate-400 truncate">Photo sent</p>
                          </div>
                        </div>

                        {/* Karan */}
                        <div className="p-2.5 hover:bg-white/[0.02] flex items-center gap-2 cursor-pointer opacity-85">
                          <img
                            src="/images/boy_2.jpg"
                            alt="Karan"
                            className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-cyan-400/50"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-slate-200 truncate block">Karan</span>
                            <p className="text-[10px] text-slate-400 truncate">Photo 📷</p>
                          </div>
                        </div>

                        {/* Design Hub */}
                        <div className="p-2.5 hover:bg-white/[0.02] flex items-center gap-2 cursor-pointer opacity-85">
                          <div className="w-7 h-7 rounded-full bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 ring-1 ring-emerald-500/30">
                            DH
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-slate-200 truncate block">Design Hub</span>
                            <p className="text-[10px] text-slate-400 truncate">You: Great work!</p>
                          </div>
                        </div>
                      </div>

                      {/* Main Active Chat View */}
                      <div className="flex-1 bg-[#0A0D17] flex flex-col justify-between">
                        {/* Chat Top Bar */}
                        <div className="h-11 px-3.5 bg-[#080B14] border-b border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <img
                                src="/images/priya_call.jpg"
                                alt="Priya"
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-purple-500"
                              />
                              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-bold text-white leading-tight">Priya</h4>
                              <span className="text-[9px] text-emerald-400 font-medium">Online</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            <button onClick={onOpenVideo} className="hover:text-purple-400 transition-colors">
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={onOpenVideo} className="hover:text-purple-400 transition-colors">
                              <Video className="w-3.5 h-3.5" />
                            </button>
                            <button className="hover:text-purple-400 transition-colors">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Chat Messages Body */}
                        <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-left text-xs no-scrollbar">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                            >
                              {msg.type === 'text' && (
                                <div
                                  className={`px-3 py-1.5 rounded-2xl max-w-[200px] leading-relaxed text-[11px] shadow-sm ${
                                    msg.sender === 'me'
                                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-br-xs'
                                      : 'bg-[#181D2E] text-slate-100 rounded-bl-xs border border-white/5'
                                  }`}
                                >
                                  {msg.text}
                                  <div className={`text-[8px] mt-0.5 text-right ${msg.sender === 'me' ? 'text-purple-200' : 'text-slate-400'}`}>
                                    {msg.time}
                                  </div>
                                </div>
                              )}

                              {msg.type === 'audio' && (
                                <div className="flex items-center gap-2.5 px-3 py-2 bg-[#181D2E] text-slate-200 rounded-2xl rounded-bl-xs border border-white/5 max-w-[210px]">
                                  <button
                                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                    className="w-6 h-6 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white flex items-center justify-center shrink-0 transition-colors"
                                  >
                                    {isPlayingAudio ? (
                                      <Pause className="w-3 h-3 fill-current" />
                                    ) : (
                                      <Play className="w-3 h-3 fill-current ml-0.5" />
                                    )}
                                  </button>
                                  <div className="flex items-center gap-[2px] flex-1">
                                    {[12, 18, 8, 22, 16, 26, 14, 20, 10, 24, 16, 8, 14, 18].map((h, idx) => (
                                      <span
                                        key={idx}
                                        style={{ height: `${h}px` }}
                                        className={`w-[2px] rounded-full transition-all ${
                                          isPlayingAudio ? 'bg-purple-400 animate-pulse' : 'bg-slate-500'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-mono">{msg.duration}</span>
                                </div>
                              )}

                              {msg.type === 'image' && (
                                <div className="max-w-[195px] rounded-xl overflow-hidden bg-[#181D2E] border border-white/10 shadow-lg group">
                                  <img
                                    src={msg.image}
                                    alt="Shared view"
                                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                  <div className="p-1.5 bg-[#121624] flex justify-between items-center text-[10px] text-slate-200">
                                    <span>{msg.caption}</span>
                                    <span className="text-[8px] text-slate-400">{msg.time}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {isTyping && (
                            <div className="flex items-center gap-1.5 bg-[#181D2E] px-2.5 py-1.5 rounded-xl rounded-bl-xs w-fit border border-white/5">
                              <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" />
                              <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                            </div>
                          )}
                        </div>

                        {/* Chat Bottom Input Form */}
                        <form
                          onSubmit={handleSendMessage}
                          className="p-2 bg-[#080B14] border-t border-white/5 flex items-center gap-2"
                        >
                          <button type="button" className="text-slate-400 hover:text-white p-1">
                            <Paperclip className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-white/[0.05] border border-white/10 rounded-full px-3 py-1 text-[11px] text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          />
                          <button type="button" className="text-slate-400 hover:text-white p-1">
                            <Smile className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="submit"
                            className="w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
                          >
                            <Send className="w-3 h-3 ml-0.5" />
                          </button>
                        </form>
                      </div>

                    </div>
                  </div>
                </div>

                {/* 2. Vertical Smartphone Mockup (Overlapping Front Right) */}
                <div
                  className="absolute -right-2 sm:-right-4 lg:-right-6 bottom-[-15px] sm:bottom-[-20px] w-[225px] sm:w-[255px] rounded-[36px] p-2 bg-[#0A0D14] shadow-[0_30px_70px_rgba(0,0,0,0.98),0_0_40px_rgba(168,85,247,0.35)] border-2 border-slate-700/80 backdrop-blur-2xl z-20 hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="rounded-[28px] overflow-hidden bg-black border border-white/10 flex flex-col relative aspect-[9/17.8]">
                    
                    {/* Phone Video Call Top Header */}
                    <div className="absolute top-0 inset-x-0 z-20 px-3.5 pt-3 pb-1 flex items-center justify-between text-white bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                      <div className="flex items-center gap-2">
                        <button className="text-white hover:text-purple-300 transition-colors">
                          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <div className="text-left">
                          <span className="font-bold text-xs text-white block leading-tight">Priya</span>
                          <span className="text-[10px] text-slate-300 font-mono">00:24</span>
                        </div>
                      </div>
                      <button className="text-white hover:text-purple-300 transition-colors p-1">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Priya Video Feed */}
                    <div className="w-full h-full relative overflow-hidden bg-slate-950">
                      <img
                        src="/images/priya_video_call.jpg"
                        alt="Priya Video Call"
                        className="w-full h-full object-cover object-center"
                      />

                      {/* PiP of Caller (Bottom Right) */}
                      <div className="absolute bottom-16 right-3 w-16 aspect-[3/4] rounded-xl overflow-hidden border border-white/30 shadow-2xl bg-black">
                        <img
                          src="/images/rohan_call.jpg"
                          alt="Caller"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* Call Controls Bar at Bottom */}
                      <div className="absolute bottom-3 inset-x-0 px-3 flex items-center justify-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setIsPhoneMuted(!isPhoneMuted)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md text-white transition-colors cursor-pointer ${
                            isPhoneMuted ? 'bg-red-500' : 'bg-black/50 border border-white/15 hover:bg-black/70'
                          }`}
                          title="Toggle Mic"
                        >
                          {isPhoneMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsPhoneVideoOff(!isPhoneVideoOff)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md text-white transition-colors cursor-pointer ${
                            isPhoneVideoOff ? 'bg-red-500' : 'bg-black/50 border border-white/15 hover:bg-black/70'
                          }`}
                          title="Toggle Video"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={onOpenVideo}
                          className="w-10 h-10 rounded-full bg-[#E11D48] hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          title="End Call"
                        >
                          <PhoneOff className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md text-white bg-black/50 border border-white/15 hover:bg-black/70 transition-colors cursor-pointer"
                          title="Flip Camera"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
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
