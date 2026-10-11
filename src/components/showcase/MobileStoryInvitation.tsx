'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Smartphone, LayoutGrid, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { SaveTheDateCard } from '../hero/SaveTheDateCard';
import { CoupleStoryCard } from '../invitation-card/CoupleStoryCard';
import { EthiopianCalendarCard } from '../calendar/EthiopianCalendarCard';
import { useWedding } from '@/context/WeddingContext';

export const MobileStoryInvitation: React.FC = () => {
  const { weddingData, isPlayingMusic, toggleMusic } = useWedding();
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'phone' | 'grid'>('phone');
  const totalSlides = 3;

  const slides = [
    {
      id: 'save-the-date',
      title: 'Save The Date',
      component: (
        <SaveTheDateCard
          groomFullName={weddingData.groomFullName}
          brideFullName={weddingData.brideFullName}
          bibleVerseAmharic={weddingData.religiousQuoteAmharic}
          bibleVerseSource={weddingData.quoteSource}
          programTitleAmharic="የቃልኪዳን እና የአምልኮ ጊዜ"
          programTimeAmharic="ከ9:00 እስከ 12:00"
          bgImageUrl="/images/ethiopian_wedding_couple.jpg"
        />
      ),
    },
    {
      id: 'invitation-letter',
      title: 'Our Invitation',
      component: (
        <CoupleStoryCard
          groomName={weddingData.groomName}
          brideName={weddingData.brideName}
          photoUrl="/images/ethiopian_couple_holding_hands.jpg"
          subtitle="With Love & Warm Regards"
          messageEn={weddingData.globalInvitationMessage}
          messageAm={weddingData.globalInvitationMessageAmharic}
        />
      ),
    },
    {
      id: 'ethiopian-calendar',
      title: 'Ethiopian Calendar',
      component: (
        <EthiopianCalendarCard
          monthName="ህዳር"
          year="2019"
          selectedDay={6}
          weekdayText="እሑድ፣ ህዳር 6፣ 2019"
          timeRangeText="ከ9:00 እስከ 12:00"
          quoteText="We can't wait to celebrate with you!"
          weddingDateIso={weddingData.weddingDate}
        />
      ),
    },
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section id="invitation" className="relative py-12 sm:py-20 px-3 sm:px-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0a3a2a]/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Header & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-xl mb-6 px-2 gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#edd58a] font-cinzel font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              ዲጂታል የሰርግ መጥሪያ (Digital Invitation)
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-[#fff3cb] font-bold mt-0.5">
              {weddingData.groomName} &amp; {weddingData.brideName}
            </h2>
          </div>

          {/* Desktop View Switcher */}
          <div className="hidden sm:flex items-center space-x-1 p-1 rounded-full bg-[#07241c] border border-[#d4af37]/30 shadow-inner">
            <button
              onClick={() => setViewMode('phone')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'phone'
                  ? 'bg-[#d4af37]/25 text-[#edd58a] shadow border border-[#d4af37]/40'
                  : 'text-[#edd58a]/60 hover:text-[#edd58a]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ስልክ እይታ (Mobile)</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#d4af37]/25 text-[#edd58a] shadow border border-[#d4af37]/40'
                  : 'text-[#edd58a]/60 hover:text-[#edd58a]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>ካርዶች በሙሉ (Grid)</span>
            </button>
          </div>
        </div>

        {/* 1. MOBILE PHONE FRAME VIEW (As shown in TikTok and Lovable preview) */}
        {viewMode === 'phone' ? (
          <div className="relative w-full max-w-[390px] flex flex-col items-center">
            {/* Phone outer bezel mockup */}
            <div className="relative w-full rounded-[40px] p-2.5 sm:p-3 bg-[#0a1813] border-2 sm:border-4 border-[#163529] shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(212,175,55,0.18)]">
              {/* Phone Speaker Notch & Camera */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#06120e] rounded-full z-30 flex items-center justify-center space-x-2">
                <div className="w-8 h-1 bg-[#152a20] rounded-full" />
                <div className="w-2 h-2 rounded-full bg-[#0d2218]" />
              </div>

              {/* Story Top Progress Bars */}
              <div className="relative z-30 pt-6 px-4 mb-2">
                <div className="flex items-center space-x-1.5 w-full">
                  {slides.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className="h-1 flex-1 rounded-full cursor-pointer overflow-hidden bg-black/40"
                    >
                      <div
                        className={`h-full transition-all duration-300 ${
                          idx === activeSlide
                            ? 'bg-[#edd58a]'
                            : idx < activeSlide
                            ? 'bg-[#edd58a]/60'
                            : 'bg-white/20'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Sub-header inside phone screen */}
                <div className="flex items-center justify-between text-[11px] text-[#edd58a]/70 font-cinzel mt-2 px-1">
                  <span>{slides[activeSlide].title}</span>
                  <span>
                    {activeSlide + 1} / {totalSlides}
                  </span>
                </div>
              </div>

              {/* Card Container */}
              <div className="relative overflow-hidden rounded-[28px] min-h-[580px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="w-full"
                  >
                    {slides[activeSlide].component}
                  </motion.div>
                </AnimatePresence>

                {/* Touch/Click left & right tap zones for fast story skipping */}
                <button
                  onClick={handlePrev}
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-[#d4af37]/30 text-[#edd58a] flex items-center justify-center z-20 backdrop-blur-sm transition-all shadow-lg"
                  aria-label="Previous card"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-[#d4af37]/30 text-[#edd58a] flex items-center justify-center z-20 backdrop-blur-sm transition-all shadow-lg"
                  aria-label="Next card"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Phone Bar */}
              <div className="py-2 flex items-center justify-center">
                <div className="w-24 h-1 bg-[#d4af37]/40 rounded-full" />
              </div>
            </div>

            {/* Quick slide thumbnails selector */}
            <div className="flex items-center justify-center space-x-2 mt-5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-cinzel transition-all border ${
                    activeSlide === idx
                      ? 'bg-[#d4af37]/25 text-[#edd58a] border-[#d4af37]'
                      : 'bg-[#08221b]/80 text-[#edd58a]/60 border-[#d4af37]/20 hover:border-[#d4af37]/50'
                  }`}
                >
                  {idx + 1}. {s.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 2. GRID VIEW (All 4 cards rendered together side by side) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full">
            {slides.map((s, idx) => (
              <div key={s.id} className="flex flex-col items-center">
                <div className="w-full max-w-sm mb-2 flex items-center justify-between text-xs text-[#edd58a]/80 font-cinzel px-2">
                  <span>0{idx + 1}. {s.title}</span>
                  <span className="text-[#d4af37]/50">✦</span>
                </div>
                {s.component}
              </div>
            ))}
          </div>
        )}

        {/* Quick jump to details banner */}
        <div className="mt-12 text-center">
          <a
            href="#venues"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37]/35 to-[#d4af37]/20 border border-[#d4af37]/60 text-[#fff3cb] font-semibold text-xs sm:text-sm hover:border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all"
          >
            <span>ወደ ዝርዝር መርሃ ግብር፣ ካርታና RSVP ይለፉ</span>
            <span>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};
