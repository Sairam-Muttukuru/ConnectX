import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickFeatures from './components/QuickFeatures';
import ConversationsFeelReal from './components/ConversationsFeelReal';
import TalkFaceToFace from './components/TalkFaceToFace';
import FindYourPeople from './components/FindYourPeople';
import RealStoriesMarquee from './components/RealStoriesMarquee';
import CityscapeCTA from './components/CityscapeCTA';
import Footer from './components/Footer';
import VideoModal from './components/VideoModal';

export default function App() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('connectx_theme');
    if (saved) return saved === 'dark';
    return true; // default dark
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('connectx_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('connectx_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const renderLandingPage = (navigateTo) => (
    <div
      className={`min-h-screen flex flex-col selection:bg-purple-600 selection:text-white relative overflow-x-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#06080F] text-slate-100' : 'bg-[#fcfdfe] text-slate-900'
      }`}
    >
      {/* Background Starfield Subtle Accents in Dark mode */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0" />
      )}

      {/* 1. Navbar */}
      <Navbar
        onOpenVideo={() => setIsVideoModalOpen(true)}
        onNavigate={navigateTo}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Main Landing Page Sections */}
      <main className="flex-grow z-10">
        {/* 2. Hero Section */}
        <Hero
          onOpenVideo={() => setIsVideoModalOpen(true)}
          onNavigate={navigateTo}
          isDark={isDark}
        />

        {/* 3. 6 Quick Feature Glow Cards */}
        <QuickFeatures isDark={isDark} />

        {/* 4. Section 3: "Conversations that feel real." */}
        <ConversationsFeelReal
          onNavigate={navigateTo}
          isDark={isDark}
        />

        {/* 5. Section 4: "Talk face to face." */}
        <TalkFaceToFace
          onOpenVideo={() => setIsVideoModalOpen(true)}
          isDark={isDark}
        />

        {/* 6. Section 5: "Find your people." */}
        <FindYourPeople
          onNavigate={navigateTo}
          isDark={isDark}
        />

        {/* 7. Section 6: "Real Stories from Real People" */}
        <RealStoriesMarquee
          onNavigate={navigateTo}
          isDark={isDark}
        />

        {/* 8. Section 7: "Be Part of Something Real." */}
        <CityscapeCTA
          onOpenVideo={() => setIsVideoModalOpen(true)}
          onNavigate={navigateTo}
          isDark={isDark}
        />
      </main>

      {/* 9. Footer */}
      <Footer isDark={isDark} />

      {/* Interactive HD Video Call Simulation Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        isDark={isDark}
      />
    </div>
  );

  return (
    <AppRoutes
      isDark={isDark}
      toggleTheme={toggleTheme}
      renderLanding={renderLandingPage}
    />
  );
}
