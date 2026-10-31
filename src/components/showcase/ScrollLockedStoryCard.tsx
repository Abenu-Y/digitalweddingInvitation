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
  const [slideDirection, setSlideDirection] = useState<number>(1);

  const transitionDuration = weddingData.storyCardTransitionDuration ?? 0.5;
  const scrollHeightVh = weddingData.storyCardScrollHeightVh || 300;

  // Guard against scroll fighting when clicking buttons or pills
  const isProgrammaticScroll = useRef<boolean>(false);
  const programmaticTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
   * Smoothly navigates to a designated slide and synchronizes the window's
   * scroll position to match that card's progress inside the locked section.
   */
  const scrollToSlide = useCallback(
    (targetIndex: number, forcedDirection?: number) => {
      const current = activeSlideRef.current;
      const direction = forcedDirection !== undefined ? forcedDirection : targetIndex >= current ? 1 : -1;
      setSlideDirection(direction);
      setActiveSlide(targetIndex);

      if (containerRef.current) {
        isProgrammaticScroll.current = true;
        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const containerTop = scrollTop + rect.top;
        const totalTravel = containerRef.current.offsetHeight - window.innerHeight;

        if (totalTravel > 0) {
          // Centered progression offsets for the 3 slides
          // Slide 0: ~12% | Slide 1: ~50% | Slide 2: ~88%
          const offsets = [0.12, 0.50, 0.88];
          const targetY = containerTop + (offsets[targetIndex] ?? 0.5) * totalTravel;

          window.scrollTo({
            top: targetY,
            behavior: 'smooth',
          });
        }

        if (programmaticTimeoutRef.current) {
          clearTimeout(programmaticTimeoutRef.current);
        }
        programmaticTimeoutRef.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 750);
      }
    },
    []
  );

  // Left arrow button: previous card
  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevIndex = (activeSlide - 1 + slides.length) % slides.length;
    scrollToSlide(prevIndex, -1);
  };

  // Right arrow button: next card
  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextIndex = (activeSlide + 1) % slides.length;
    scrollToSlide(nextIndex, 1);
  };

  /**
   * Scroll-Driven Card Transition:
   * Maps natural window scroll to show Card 01 -> Card 02 -> Card 03 one after the other
   * when scrolling down, and Card 03 -> Card 02 -> Card 01 when scrolling up.
   */
  const updateSlideFromScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const totalTravel = containerRef.current.offsetHeight - window.innerHeight;
    if (totalTravel <= 0) return;

    // Normalized progress within the locked section (0.0 to 1.0)
    const rawProgress = -rect.top / totalTravel;
    const progress = Math.max(0, Math.min(1, rawProgress));

    // Determine target slide based on scroll progression
    let targetSlide = 0;
    if (progress >= 0.67) {
      targetSlide = 2;
    } else if (progress >= 0.33) {
      targetSlide = 1;
    } else {
      targetSlide = 0;
    }

    const current = activeSlideRef.current;
    if (targetSlide !== current) {
      setSlideDirection(targetSlide > current ? 1 : -1);
      setActiveSlide(targetSlide);
    }
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateSlideFromScroll();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check on mount
    updateSlideFromScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (programmaticTimeoutRef.current) clearTimeout(programmaticTimeoutRef.current);
    };
  }, [updateSlideFromScroll]);

  // Touch Swipe Support for mobile gestures
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next slide
      const nextIndex = (activeSlide + 1) % slides.length;
      scrollToSlide(nextIndex, 1);
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> previous slide
      const prevIndex = (activeSlide - 1 + slides.length) % slides.length;
      scrollToSlide(prevIndex, -1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      ref={containerRef}
      id="invitation-story"
      className="relative w-full"
      style={{ height: `${scrollHeightVh}vh` }}
    >
      {/* Sticky container stays centered in viewport as user scrolls through the 3 cards */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-20 px-3 sm:px-6 py-4 overflow-hidden">
        {/* Ambient luxury gold/emerald background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#0a3a2a]/30 blur-[130px] rounded-full pointer-events-none" />

        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full max-w-md mx-auto flex flex-col items-center"
        >
          {/* Top Story Header & 3 Progress Bar Indicators */}
          <div className="w-full max-w-sm mb-3 px-2 flex flex-col items-center">
            {/* Story Progress Bars */}
            <div className="flex items-center space-x-2 w-full mb-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToSlide(idx, idx > activeSlide ? 1 : -1)}
                  className="h-1.5 flex-1 rounded-full cursor-pointer overflow-hidden bg-black/60 border border-white/10 transition-all hover:border-amber-400/50"
                  title={`Jump to card ${idx + 1}`}
                  aria-label={`Jump to card ${idx + 1}`}
                >
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: idx <= activeSlide ? activeTheme.accentHex : 'rgba(255,255,255,0.15)',
                      boxShadow: idx === activeSlide ? `0 0 10px ${activeTheme.glowColor}` : 'none',
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
                <span className="font-bold truncate">
                  {slides[activeSlide].number}. {slides[activeSlide].title}
                </span>
                <span className="text-stone-500">•</span>
                <span className="font-amharic text-stone-300 truncate">
                  {slides[activeSlide].titleAmharic}
                </span>
              </span>
              <div className="flex items-center space-x-1.5 shrink-0 font-semibold text-stone-400">
                <span>
                  {activeSlide + 1} / {slides.length}
                </span>
              </div>
            </div>
          </div>

          {/* The Card Container with Floating Interactive Arrows (< >) */}
          <div className="relative w-full max-w-sm flex items-center justify-center">
            {/* Previous Arrow Button (<) */}
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
              aria-label="Previous card"
              title="Previous card"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Active Card with Smooth Sequential Directional Animation */}
            <div className="w-full overflow-hidden">
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={activeSlide}
                  custom={slideDirection}
                  initial={{
                    opacity: 0,
                    y: slideDirection > 0 ? 24 : -24,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: slideDirection > 0 ? -24 : 24,
                    scale: 0.98,
                  }}
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

            {/* Next Arrow Button (>) */}
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
              aria-label="Next card"
              title="Next card"
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
                onClick={() => scrollToSlide(idx, idx > activeSlide ? 1 : -1)}
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
      </div>
    </div>
  );
};
