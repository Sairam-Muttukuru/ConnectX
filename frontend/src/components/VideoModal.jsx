import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Sparkles,
  Volume2,
  Settings
} from 'lucide-react';

export default function VideoModal({ isOpen, onClose }) {
  const [seconds, setSeconds] = useState(24);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const addEmoji = (char) => {
    const id = Date.now() + Math.random();
    setFloatingEmojis((prev) => [...prev, { id, char }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 1800);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Dark blur backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#04060b]/90 backdrop-blur-2xl transition-opacity animate-in fade-in duration-300"
      />

      {/* Web Video Call Modal Window */}
      <div className="relative z-10 w-full max-w-4xl bg-[#090d1a] rounded-3xl border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(139,92,246,0.3)] overflow-hidden flex flex-col">
        
        {/* Web Call Top App Header */}
        <div className="px-5 py-3.5 bg-[#060812] border-b border-white/10 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center">
              <img
                src="/images/connectx_logo.png"
                alt="ConnectX"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">Direct Call with Priya</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-mono font-bold">
                  {formatTime(seconds)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  End-to-End Encrypted
                </span>
                <span>•</span>
                <span className="text-slate-400">1080p HD • 60 FPS</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close Call Window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Area (Webcam feed of Priya) */}
        <div className="relative aspect-[16/10] bg-[#05070e] overflow-hidden flex items-center justify-center">
          {isVideoOff ? (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-24 h-24 rounded-full bg-purple-950/60 border-2 border-purple-500/40 flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                Priya
              </div>
              <span className="text-sm font-medium">Priya's camera is paused</span>
            </div>
          ) : (
            <img
              src="/images/priya_call.jpg"
              alt="Priya HD Video Stream"
              className="w-full h-full object-cover object-center"
            />
          )}

          {/* Floating Live Reaction Emojis */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingEmojis.map((e) => (
              <span
                key={e.id}
                className="absolute bottom-20 right-16 text-4xl animate-bounce"
                style={{
                  animation: 'floatUp 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}
              >
                {e.char}
              </span>
            ))}
          </div>

          {/* Top Left Speaker Badge with Equalizer */}
          <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-2.5 text-white text-xs shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold">Priya Sharma</span>
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-purple-400 rounded-full animate-pulse"></span>
              <span className="w-1 h-5 bg-purple-300 rounded-full animate-pulse [animation-delay:0.1s]"></span>
              <span className="w-1 h-2.5 bg-purple-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
              <span className="w-1 h-4 bg-purple-300 rounded-full animate-pulse [animation-delay:0.3s]"></span>
            </div>
          </div>

          {/* Call Participants PiP Stack */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2.5">
            {/* Maya */}
            <div className="w-24 sm:w-32 aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-white/40 shadow-2xl bg-slate-900 relative">
              <img
                src="/images/girl_call.jpg"
                alt="Maya"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white font-medium">
                Maya
              </div>
            </div>

            {/* You (Rohan) */}
            <div className="w-24 sm:w-32 aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-purple-500/60 shadow-2xl bg-slate-900 relative">
              <img
                src="/images/boy_1.jpg"
                alt="Self preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9px] text-white font-medium flex items-center gap-1">
                <span>You</span>
                {isMuted && <span className="text-red-400">(Muted)</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Web Conference Dock */}
        <div className="p-4 sm:p-5 bg-[#060812] border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Reaction Emoji Tray */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {['❤️', '🔥', '👏', '🚀', '😍'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-lg flex items-center justify-center transition-all hover:scale-125 active:scale-95"
                title={`Send ${emoji} reaction`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Center Call Actions Dock */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-2xl text-white transition-all ${
                isMuted
                  ? 'bg-red-500/90 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-white/10 hover:bg-white/20 border border-white/10'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-2xl text-white transition-all ${
                isVideoOff
                  ? 'bg-red-500/90 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-white/10 hover:bg-white/20 border border-white/10'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-2xl text-white transition-all ${
                isScreenSharing
                  ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'bg-white/10 hover:bg-white/20 border border-white/10'
              }`}
              title="Share Screen"
            >
              <Monitor className="w-5 h-5" />
            </button>

            {/* Red Leave Call Button */}
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-all hover:scale-105 active:scale-95 ml-2"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="hidden sm:inline">End Call</span>
            </button>
          </div>

          <div className="w-24 hidden md:block"></div>
        </div>

      </div>
    </div>
  );
}
