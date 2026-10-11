'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWedding } from '@/context/WeddingContext';
import { Volume2, VolumeX, Globe, Settings, Sparkles, UserCheck, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    weddingData,
    currentGuest,
    language,
    setLanguage,
    isPlayingMusic,
    toggleMusic,
    setActiveGuestBySlug,
    activeTheme,
  } = useWedding();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#invitation', labelEn: 'Invitation', labelAm: 'ጥሪ' },
    { href: '#schedule', labelEn: 'Schedule', labelAm: 'መርሐግብር' },
    { href: '#venues', labelEn: 'Venues', labelAm: 'ስፍራዎች' },
    { href: '#story', labelEn: 'Love Story', labelAm: 'ታሪካችን' },
    { href: '#gallery', labelEn: 'Gallery', labelAm: 'ፎቶዎች' },
    { href: '#dresscode', labelEn: 'Dress Code', labelAm: 'አለባበስ' },
    { href: '#rsvp', labelEn: 'RSVP', labelAm: 'እመጣለሁ' },
    { href: '#registry', labelEn: 'Gifts', labelAm: 'ስጦታ' },
    { href: '#wishes', labelEn: 'Wishes', labelAm: 'ምኞት' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0b0d13]/90 backdrop-blur-md border-b border-[#d4af37]/20 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Monogram */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-full border border-[#d4af37]/60 flex items-center justify-center bg-black/40 group-hover:border-[#d4af37] transition-colors">
            <span className="font-cinzel text-xs font-bold text-amber-300">
              {weddingData.groomName[0]}&{weddingData.brideName[0]}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel font-bold text-sm sm:text-base tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors">
              {weddingData.groomName} & {weddingData.brideName}
            </span>
            <span className="text-[10px] text-amber-400/80 font-amharic -mt-1">
              {weddingData.groomNameAmharic} እና {weddingData.brideNameAmharic}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs uppercase tracking-widest">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-stone-300 hover:text-amber-300 transition-colors font-medium py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d4af37] hover:after:w-full after:transition-all"
            >
              {language === 'en' ? link.labelEn : link.labelAm}
            </a>
          ))}
        </nav>

        {/* Action Controls (Music, Lang, Guest Preview, Admin) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Guest Simulator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs bg-amber-500/10 border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 transition-colors"
              title="Switch guest preview to see personalized messages & themes"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline max-w-[110px] truncate">
                {currentGuest ? currentGuest.name.split(' ')[0] : 'All Guests'}
              </span>
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            </button>

            {guestDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#121622] border border-amber-500/40 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                    <span>Preview As Guest</span>
                    <span className="text-[10px] text-stone-400 font-normal">Personalized</span>
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Click a guest to see their custom card theme & message:
                  </p>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  <button
                    onClick={() => {
                      setActiveGuestBySlug(null);
                      setGuestDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      !currentGuest ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40' : 'text-stone-300 hover:bg-white/5'
                    }`}
                  >
                    <span>General Guest (Global Message)</span>
                    <span className="text-[10px] text-amber-400/70">Default</span>
                  </button>
                  {weddingData.guests.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setActiveGuestBySlug(g.slug);
                        setGuestDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        currentGuest?.id === g.id
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                          : 'text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{g.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-amber-300 ml-2 shrink-0">
                          {g.themeId.split('-')[0]}
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-400 truncate mt-0.5">
                        {g.useCustomMessage ? '✨ Custom Message' : 'Standard Message'} • {g.group}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="p-1.5 rounded-full border border-stone-700/60 bg-stone-900/60 text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors flex items-center space-x-1 text-xs px-2"
            title="Toggle English / Amharic"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-semibold">{language === 'en' ? 'አማ' : 'EN'}</span>
          </button>

          {/* Background Audio Toggle */}
          <button
            onClick={toggleMusic}
            className={`p-2 rounded-full border transition-all ${
              isPlayingMusic
                ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'border-stone-700/60 bg-stone-900/60 text-stone-400 hover:text-stone-200'
            }`}
            title={isPlayingMusic ? 'Mute Music' : 'Play Romantic Music'}
          >
            {isPlayingMusic ? (
              <div className="relative">
                <Volume2 className="w-4 h-4 animate-pulse" />
              </div>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Admin Dashboard Link */}
          <Link
            href="/admin"
            className="p-2 rounded-full border border-stone-700/60 bg-stone-900/60 text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
            title="Admin Portal (Manage Guests & Wedding Settings)"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-stone-700/60 bg-stone-900/60 text-stone-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e121a]/95 backdrop-blur-xl border-b border-amber-500/20 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-3 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 px-1 rounded-lg text-xs bg-stone-900/60 border border-white/5 text-stone-300 hover:text-amber-300 hover:border-amber-500/30 font-medium"
              >
                {language === 'en' ? link.labelEn : link.labelAm}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <span>Logged in as: {currentGuest ? currentGuest.name : 'General Guest'}</span>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-amber-300 hover:bg-white/10"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
