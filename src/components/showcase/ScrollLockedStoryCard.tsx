'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Pause } from 'lucide-react';
import { SaveTheDateCard } from '../hero/SaveTheDateCard';
import { CoupleStoryCard } from '../invitation-card/CoupleStoryCard';
import { EthiopianCalendarCard } from '../calendar/EthiopianCalendarCard';
import { useWedding } from '@/context/WeddingContext';

export const ScrollLockedStoryCard: React.FC = () => {
  const { weddingData, activeTheme } = useWedding();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Settings from admin panel (with safe fallbacks)
  const durationSec = weddingData.storyCardDurationSeconds ?? 12;
  const transitionDuration = weddingData.storyCardTransitionDuration ?? 0.75;
  const autoAdvance = weddingData.storyCardAutoAdvance ?? true;
  const pauseOnHover = weddingData.storyCardPauseOnHover ?? true;

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

  // 1. Advance to next slide and reset timer
  const goToNextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
    setSlideProgress(0);
  }, [slides.length]);

  // 2. Go to previous slide and reset timer
  const goToPrevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setSlideProgress(0);
  }, [slides.length]);

  // 3. Jump to specific slide and reset timer
  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
    setSlideProgress(0);
  }, []);

  // 4. Reliable timer: waits the exact specified durationSec, then advances to next slide (1 -> 2 -> 3 -> 1)
  useEffect(() => {
    if (!autoAdvance || durationSec <= 0) {
      setSlideProgress(0);
      return;
    }

    // Interval tick every 50ms for buttery-smooth progress bar filling
    const intervalMs = 50;
    const progressStep = (intervalMs / (durationSec * 1000)) * 100;

    const timer = setInterval(() => {
      // Pause if hovered or touched and pauseOnHover is enabled
      if (pauseOnHover && isHovered) {
        return;
      }

      // Only tick if the story card is visible in the viewport
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowH = window.innerHeight;
        // In viewport check
        const inView = rect.top < windowH && rect.bottom > 0;
        if (!inView) {
          return;
        }
      }

      setSlideProgress((prev) => {
        const next = prev + progressStep;
        if (next >= 100) {
          // Time fulfilled: move to next slide
          goToNextSlide();
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoAdvance, durationSec, pauseOnHover, isHovered, goToNextSlide]);

  // 5. Left & Right Click Handlers (Immediately change slide & reset timer)
  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToPrevSlide();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToNextSlide();
  };

  // 6. Touch Swipe Support for intuitive mobile interaction
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    if (pauseOnHover) setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (pauseOnHover) setIsHovered(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next slide
      goToNextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> previous slide
      goToPrevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      ref={sectionRef}
      id="invitation-story"
      className="relative w-full py-12 sm:py-20 flex flex-col items-center justify-center px-3 sm:px-6 overflow-hidden"
    >
      {/* Ambient luxury gold/emerald background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#0a3a2a]/30 blur-[130px] rounded-full pointer-events-none" />

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-md mx-auto flex flex-col items-center"
      >
        {/* Top Story Header & 3 Progress Bar Indicators */}
        <div className="w-full max-w-sm mb-3 px-2 flex flex-col items-center">
          {/* 3 Story Progress Bars with Smooth Real-Time Fill */}
          <div className="flex items-center space-x-2 w-full mb-2">
            {slides.map((_, idx) => {
              let fillPercent = 0;
              if (idx < activeSlide) {
                fillPercent = 100;
              } else if (idx === activeSlide) {
                fillPercent = autoAdvance ? slideProgress : 100;
              } else {
                fillPercent = 0;
              }

              return (
                <div
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className="h-1.5 flex-1 rounded-full cursor-pointer overflow-hidden bg-black/60 border border-white/10 transition-all hover:border-amber-400/50"
                  title={`Click to jump to slide ${idx + 1}`}
                >
                  <div
                    style={{
                      width: `${fillPercent}%`,
                      backgroundColor: activeTheme.accentHex,
                      boxShadow: idx === activeSlide ? `0 0 10px ${activeTheme.glowColor}` : 'none',
                    }}
                    className="h-full transition-all duration-75 ease-linear"
                  />
                </div>
              );
            })}
          </div>

          {/* Title & Indicator Info */}
          <div
            style={{ color: activeTheme.accentHex }}
            className="flex items-center justify-between w-full text-xs font-cinzel select-none"
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: activeTheme.accentHex }} />
              <span className="font-bold truncate">{slides[activeSlide].number}. {slides[activeSlide].title}</span>
              <span className="text-stone-500">•</span>
              <span className="font-amharic text-stone-300 truncate">{slides[activeSlide].titleAmharic}</span>
            </span>
            <div className="flex items-center space-x-1.5 shrink-0 font-semibold text-stone-400">
              {isHovered && pauseOnHover && (
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold flex items-center gap-0.5 animate-pulse">
                  <Pause className="w-2.5 h-2.5" /> Paused
                </span>
              )}
              <span>
                {activeSlide + 1} / {slides.length}
              </span>
            </div>
          </div>
        </div>

        {/* The Card Container with Floating Interactive Arrows (< >) */}
        <div className="relative w-full max-w-sm flex items-center justify-center">
          {/* Previous Arrow Button (<) - Changes slide immediately on click! */}
          <button
            type="button"
            onClick={handlePrevClick}
            style={{
              backgroundColor: `${activeTheme.cardBgHex}f0`,
              borderColor: activeTheme.cardBorderHex,
              color: activeTheme.accentHex,
              boxShadow: `0 6px 24px rgba(0,0,0,0.85), 0 0 18px ${activeTheme.glowColor}`,
            }}
            className="absolute -left-4 sm:-left-7 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center z-40 backdrop-blur-md transition-all active:scale-90 hover:scale-110 cursor-pointer touch-manipulation"
            aria-label="Previous slide"
            title="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Active Card with Smooth Sequential Animation */}
          <div className="w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 0.97, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -14 }}
                transition={{
                  duration: transitionDuration,
                  ease: [0.22, 1, 0.36, 1], // Silky smooth royal cubic-bezier
                }}
                className="w-full"
              >
                {slides[activeSlide].component}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Arrow Button (>) - Changes slide immediately on click! */}
          <button
            type="button"
            onClick={handleNextClick}
            style={{
              backgroundColor: `${activeTheme.cardBgHex}f0`,
              borderColor: activeTheme.cardBorderHex,
              color: activeTheme.accentHex,
              boxShadow: `0 6px 24px rgba(0,0,0,0.85), 0 0 18px ${activeTheme.glowColor}`,
            }}
            className="absolute -right-4 sm:-right-7 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center z-40 backdrop-blur-md transition-all active:scale-90 hover:scale-110 cursor-pointer touch-manipulation"
            aria-label="Next slide"
            title="Next slide"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Slide Indicator Quick Selectors (Pills) */}
        <div className="flex items-center justify-center space-x-2 mt-4 z-20">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSlide(idx)}
              style={
                activeSlide === idx
                  ? {
                      backgroundColor: `${activeTheme.cardBgHex}ee`,
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
              className="px-3 py-1.5 rounded-full text-[11px] font-cinzel transition-all border cursor-pointer hover:border-amber-400/50 hover:text-white"
            >
              {s.number}. {s.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
