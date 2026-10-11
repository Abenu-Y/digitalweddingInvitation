'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SaveTheDateCard } from '../hero/SaveTheDateCard';
import { CoupleStoryCard } from '../invitation-card/CoupleStoryCard';
import { EthiopianCalendarCard } from '../calendar/EthiopianCalendarCard';
import { useWedding } from '@/context/WeddingContext';

export const ScrollLockedStoryCard: React.FC = () => {
  const { weddingData, activeTheme } = useWedding();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const slides = [
    {
      id: 'save-the-date',
      number: '01',
      title: 'Save The Date',
      titleAmharic: 'የቀጠሮ ቀን',
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
      id: 'our-invitation',
      number: '02',
      title: 'Our Invitation',
      titleAmharic: 'የሰርግ ጥሪ መልእክት',
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
      number: '03',
      title: 'Ethiopian Calendar',
      titleAmharic: 'የኢትዮጵያ የቀን መቁጠሪያ',
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

  const isProgrammaticScroll = useRef<boolean>(false);

  // High-performance direct scroll calculation that NEVER gets stuck on desktop or mobile
  const updateSlideFromScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalTravel = rect.height - windowH;

    if (totalTravel <= 0) return;

    // How far we have scrolled into this section
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalTravel));

    let target = 0;
    if (progress < 0.33) {
      target = 0;
    } else if (progress < 0.67) {
      target = 1;
    } else {
      target = 2;
    }

    setActiveSlide((prev) => (prev !== target ? target : prev));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateSlideFromScroll, { passive: true });
    window.addEventListener('resize', updateSlideFromScroll, { passive: true });
    updateSlideFromScroll();

    return () => {
      window.removeEventListener('scroll', updateSlideFromScroll);
      window.removeEventListener('resize', updateSlideFromScroll);
    };
  }, [updateSlideFromScroll]);

  // Timed Auto-Advance for cards (1 -> 2 -> 3) based on admin duration setting
  useEffect(() => {
    const durationSec = weddingData.storyCardDurationSeconds ?? 6;
    if (durationSec <= 0) return; // 0 = manual scroll only

    const timer = setInterval(() => {
      if (isProgrammaticScroll.current) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Active when cards are currently centered in viewport
      const isVisible = rect.top <= windowH * 0.5 && rect.bottom >= windowH * 0.5;
      if (isVisible) {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }
    }, durationSec * 1000);

    return () => clearInterval(timer);
  }, [weddingData.storyCardDurationSeconds, slides.length]);

  const scrollToSlide = (targetIndex: number) => {
    isProgrammaticScroll.current = true;
    setActiveSlide(targetIndex);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const startY = scrollTop + rect.top;
      const totalTravel = containerRef.current.offsetHeight - window.innerHeight;
      
      // Position targets: slide 0 -> 10%, slide 1 -> 50%, slide 2 -> 90%
      const progressOffsets = [0.10, 0.50, 0.90];
      const targetY = startY + progressOffsets[targetIndex] * totalTravel;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 1000);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextIndex = (activeSlide + 1) % slides.length;
    scrollToSlide(nextIndex);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevIndex = (activeSlide - 1 + slides.length) % slides.length;
    scrollToSlide(prevIndex);
  };

  const scrollHeightVh = weddingData.storyCardScrollHeightVh || 260;

  return (
    <div
      ref={containerRef}
      id="invitation-story"
      className="relative w-full"
      style={{ height: `${scrollHeightVh}vh` }}
    >
      {/* Sticky container stays centered during scroll */}
      <div className="sticky top-0 min-h-screen w-full flex flex-col items-center justify-center z-20 px-3 sm:px-6 py-6 overflow-hidden">
        {/* Ambient gold/emerald background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0a3a2a]/25 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
          {/* Top Story Header & Progress Indicators */}
          <div className="w-full max-w-sm mb-3 px-2 flex flex-col items-center">
            {/* Story Progress Bars */}
            <div className="flex items-center space-x-2 w-full mb-2">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => scrollToSlide(idx)}
                  className="h-1.5 flex-1 rounded-full cursor-pointer overflow-hidden bg-black/60 border border-white/10 transition-all"
                >
                  <div
                    style={{
                      backgroundColor: idx <= activeSlide ? activeTheme.accentHex : 'rgba(255,255,255,0.2)',
                      boxShadow: idx === activeSlide ? `0 0 10px ${activeTheme.glowColor}` : 'none',
                    }}
                    className="h-full transition-all duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Title & Indicator Info */}
            <div
              style={{ color: activeTheme.accentHex }}
              className="flex items-center justify-between w-full text-xs font-cinzel"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: activeTheme.accentHex }} />
                <span className="font-bold">{slides[activeSlide].number}. {slides[activeSlide].title}</span>
                <span className="text-stone-500">•</span>
                <span className="font-amharic text-stone-300">{slides[activeSlide].titleAmharic}</span>
              </span>
              <span className="font-semibold text-stone-400">
                {activeSlide + 1} / {slides.length}
              </span>
            </div>
          </div>

          {/* The Single Card Container with Navigation Arrows (< >) */}
          <div className="relative w-full max-w-sm flex items-center justify-center">
            {/* Previous Arrow Button (<) */}
            <button
              onClick={handlePrev}
              style={{
                backgroundColor: `${activeTheme.cardBgHex}ea`,
                borderColor: activeTheme.cardBorderHex,
                color: activeTheme.accentHex,
                boxShadow: `0 4px 20px rgba(0,0,0,0.8), 0 0 15px ${activeTheme.glowColor}`,
              }}
              className="absolute -left-3 sm:-left-7 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border flex items-center justify-center z-30 backdrop-blur-md transition-all active:scale-95 group hover:scale-105"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Active Card with Smooth Sequential Animation */}
            <div className="w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full"
                >
                  {slides[activeSlide].component}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Arrow Button (>) */}
            <button
              onClick={handleNext}
              style={{
                backgroundColor: `${activeTheme.cardBgHex}ea`,
                borderColor: activeTheme.cardBorderHex,
                color: activeTheme.accentHex,
                boxShadow: `0 4px 20px rgba(0,0,0,0.8), 0 0 15px ${activeTheme.glowColor}`,
              }}
              className="absolute -right-3 sm:-right-7 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border flex items-center justify-center z-30 backdrop-blur-md transition-all active:scale-95 group hover:scale-105"
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Slide Indicator Quick Selectors */}
          <div className="flex items-center justify-center space-x-2 mt-4 z-20">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => scrollToSlide(idx)}
                style={
                  activeSlide === idx
                    ? {
                        backgroundColor: `${activeTheme.cardBgHex}cc`,
                        color: activeTheme.accentHex,
                        borderColor: activeTheme.highlightHex,
                        boxShadow: `0 0 15px ${activeTheme.glowColor}`,
                      }
                    : {
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        color: '#9ca3af',
                        borderColor: 'rgba(255,255,255,0.1)',
                      }
                }
                className="px-3 py-1 rounded-full text-[11px] font-cinzel transition-all border"
              >
                {s.number}. {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
