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
  const sectionRef = useRef<HTMLElement>(null);

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  // Transition lock to prevent scroll momentum from skipping multiple cards
  const isTransitioning = useRef<boolean>(false);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const activeSlideRef = useRef<number>(0);
  activeSlideRef.current = activeSlide;

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

  /**
   * Smoothly navigates to a designated card with intentional direction and debounce.
   */
  const goToSlide = useCallback((targetIndex: number, direction?: number) => {
    const current = activeSlideRef.current;
    if (targetIndex === current) return;

    const dir = direction !== undefined ? direction : targetIndex > current ? 1 : -1;
    setSlideDirection(dir);
    setActiveSlide(targetIndex);

    isTransitioning.current = true;
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    transitionTimeout.current = setTimeout(() => {
      isTransitioning.current = false;
    }, 450);
  }, []);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const prevIndex = (activeSlideRef.current - 1 + slides.length) % slides.length;
    goToSlide(prevIndex, -1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nextIndex = (activeSlideRef.current + 1) % slides.length;
    goToSlide(nextIndex, 1);
  };

  /**
   * Precision Wheel Scroll Interception:
   * When user is focused on the story card section:
   * - Scrolling down steps sequentially: Card 01 -> Card 02 -> Card 03.
   * - On Card 03, continuing to scroll down releases control and flows to the Countdown section.
   * - Scrolling up steps sequentially: Card 03 -> Card 02 -> Card 01.
   * - On Card 01, continuing to scroll up releases control and flows up to the Hero section.
   */
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = sectionEl.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Check if the story card is prominently centered in the viewport
      const isCardCentered = rect.top <= windowH * 0.4 && rect.bottom >= windowH * 0.6;
      if (!isCardCentered) return;

      const delta = e.deltaY;
      // Filter out micro-scroll twitches
      if (Math.abs(delta) < 18) return;

      const current = activeSlideRef.current;

      if (delta > 0) {
        // Scrolling Down
        if (current < slides.length - 1) {
          // Lock scroll and advance to next card
          e.preventDefault();
          if (!isTransitioning.current) {
            goToSlide(current + 1, 1);
          }
        }
        // If already on the last card (Card 03), natural page scroll proceeds to countdown
      } else {
        // Scrolling Up
        if (current > 0) {
          // Lock scroll and step to previous card
          e.preventDefault();
          if (!isTransitioning.current) {
            goToSlide(current - 1, -1);
          }
        }
        // If already on the first card (Card 01), natural page scroll proceeds to hero
      }
    };

    // Use non-passive wheel listener to allow intentional card progression
    sectionEl.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      sectionEl.removeEventListener('wheel', handleWheel);
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, [goToSlide, slides.length]);

  /**
   * When scrolling up from below (countdown/schedule), detect entrance from bottom
   * and prime Card 03 as the starting card so reverse scrolling is 100% natural.
   */
  useEffect(() => {
    let lastY = window.scrollY;

    const handleScrollTracking = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const currentY = window.scrollY;
      const scrollingUp = currentY < lastY;
      lastY = currentY;

      // If scrolling up from below and entering the card section
      if (scrollingUp && rect.bottom <= windowH + 100 && rect.bottom >= windowH * 0.7) {
        if (activeSlideRef.current === 0) {
          setActiveSlide(slides.length - 1);
          setSlideDirection(-1);
        }
      }
    };

    window.addEventListener('scroll', handleScrollTracking, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollTracking);
  }, [slides.length]);

  // Touch Gestures: supports both vertical scrolling gestures and horizontal swipes
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    const deltaY = touchStartY.current - touchEndY;
    const deltaX = touchStartX.current - touchEndX;

    const current = activeSlideRef.current;

    // Horizontal swipe takes precedence if clear horizontal intent
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        // Swiped left -> next card
        handleNext();
      } else {
        // Swiped right -> previous card
        handlePrev();
      }
    } else if (Math.abs(deltaY) > 50) {
      // Vertical swipe gesture on mobile
      if (deltaY > 0) {
        // Swiped up (scrolling down)
        if (current < slides.length - 1 && !isTransitioning.current) {
          goToSlide(current + 1, 1);
        }
      } else {
        // Swiped down (scrolling up)
        if (current > 0 && !isTransitioning.current) {
          goToSlide(current - 1, -1);
        }
      }
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  /**
   * Ultra-smooth 3D spring transition variants:
   * Incoming and outgoing cards animate simultaneously with depth, scale, and organic spring physics.
   * Eliminates all blank frames and lag!
   */
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.93,
      rotateY: direction > 0 ? 8 : -8,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      zIndex: 10,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.32, ease: 'easeOut' },
        scale: { duration: 0.35, ease: 'easeOut' },
        rotateY: { duration: 0.35, ease: 'easeOut' },
        filter: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.93,
      rotateY: direction > 0 ? -8 : 8,
      filter: 'blur(4px)',
      zIndex: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.28, ease: 'easeIn' },
        scale: { duration: 0.35, ease: 'easeIn' },
        rotateY: { duration: 0.35, ease: 'easeIn' },
        filter: { duration: 0.25 },
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="invitation-story"
      className="relative w-full min-h-[92vh] sm:min-h-screen py-8 sm:py-16 flex flex-col items-center justify-center px-3 sm:px-6 overflow-hidden select-none"
    >
      {/* Ambient luxury gold/emerald background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#0a3a2a]/30 blur-[130px] rounded-full pointer-events-none" />

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-md mx-auto flex flex-col items-center"
      >
        {/* Top Story Header & 3 Progress Bar Indicators */}
        <div className="w-full max-w-sm mb-4 px-2 flex flex-col items-center">
          {/* Story Progress Bars */}
          <div className="flex items-center space-x-2 w-full mb-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx, idx > activeSlide ? 1 : -1)}
                className="h-1.5 flex-1 rounded-full cursor-pointer overflow-hidden bg-black/60 border border-white/10 transition-all hover:border-amber-400/50"
                title={`Jump to card ${idx + 1}`}
                aria-label={`Jump to card ${idx + 1}`}
              >
                <div
                  style={{
                    width: '100%',
                    backgroundColor: idx <= activeSlide ? activeTheme.accentHex : 'rgba(255,255,255,0.15)',
                    boxShadow: idx === activeSlide ? `0 0 12px ${activeTheme.glowColor}` : 'none',
                  }}
                  className="h-full transition-all duration-300"
                />
              </button>
            ))}
          </div>

          {/* Title & Indicator Info */}
          <div
            style={{ color: activeTheme.accentHex }}
            className="flex items-center justify-between w-full text-xs font-cinzel select-none"
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: activeTheme.accentHex }} />
              <motion.span
                key={activeSlide}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="font-bold truncate"
              >
                {slides[activeSlide].number}. {slides[activeSlide].title}
              </motion.span>
              <span className="text-stone-500">•</span>
              <motion.span
                key={`${activeSlide}-am`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="font-amharic text-stone-300 truncate"
              >
                {slides[activeSlide].titleAmharic}
              </motion.span>
            </span>
            <div className="flex items-center space-x-1.5 shrink-0 font-semibold text-stone-400">
              <span>
                {activeSlide + 1} / {slides.length}
              </span>
            </div>
          </div>
        </div>

        {/* Card Stage Container with Precision Navigation Controls */}
        <div className="relative w-full max-w-sm flex items-center justify-center">
          {/* Previous Arrow Button (<) */}
          <button
            type="button"
            onClick={handlePrev}
            style={{
              backgroundColor: `${activeTheme.cardBgHex}f0`,
              borderColor: activeTheme.cardBorderHex,
              color: activeTheme.accentHex,
              boxShadow: `0 6px 24px rgba(0,0,0,0.85), 0 0 18px ${activeTheme.glowColor}`,
            }}
            className="absolute -left-4 sm:-left-7 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center z-30 backdrop-blur-md transition-all active:scale-90 hover:scale-110 cursor-pointer touch-manipulation"
            aria-label="Previous card"
            title="Previous card"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Smooth 3D Card Transition Stage: Both Cards Overlap Flawlessly */}
          <div
            className="relative w-full flex items-center justify-center min-h-[580px] sm:min-h-[600px]"
            style={{ perspective: 1200 }}
          >
            <AnimatePresence initial={false} custom={slideDirection}>
              <motion.div
                key={activeSlide}
                custom={slideDirection}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute top-0 left-0 w-full flex items-center justify-center"
              >
                {slides[activeSlide].component}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Arrow Button (>) */}
          <button
            type="button"
            onClick={handleNext}
            style={{
              backgroundColor: `${activeTheme.cardBgHex}f0`,
              borderColor: activeTheme.cardBorderHex,
              color: activeTheme.accentHex,
              boxShadow: `0 6px 24px rgba(0,0,0,0.85), 0 0 18px ${activeTheme.glowColor}`,
            }}
            className="absolute -right-4 sm:-right-7 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center z-30 backdrop-blur-md transition-all active:scale-90 hover:scale-110 cursor-pointer touch-manipulation"
            aria-label="Next card"
            title="Next card"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Slide Indicator Quick Selectors (Pills) */}
        <div className="flex items-center justify-center space-x-2 mt-5 z-20">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSlide(idx, idx > activeSlide ? 1 : -1)}
              style={
                activeSlide === idx
                  ? {
                      backgroundColor: `${activeTheme.cardBgHex}ee`,
                      color: activeTheme.accentHex,
                      borderColor: activeTheme.highlightHex,
                      boxShadow: `0 0 16px ${activeTheme.glowColor}`,
                    }
                  : {
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      color: '#9ca3af',
                      borderColor: 'rgba(255,255,255,0.1)',
                    }
              }
              className="px-3.5 py-1.5 rounded-full text-[11px] font-cinzel transition-all border cursor-pointer hover:border-amber-400/50 hover:text-white"
            >
              {s.number}. {s.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
