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
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Transition lock and momentum cooldown guards
  const isTransitioning = useRef<boolean>(false);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const cooldownUntil = useRef<number>(0);
  const activeSlideRef = useRef<number>(0);
  activeSlideRef.current = activeSlide;

  // Track 100% full view entry state
  const hasArrivedAt100 = useRef<boolean>(false);

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
    cooldownUntil.current = Date.now() + 480;

    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    transitionTimeout.current = setTimeout(() => {
      isTransitioning.current = false;
    }, 450);
  }, []);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const sectionEl = sectionRef.current;
    if (sectionEl) {
      const sectionTop = window.scrollY + sectionEl.getBoundingClientRect().top;
      window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }
    const current = activeSlideRef.current;
    const prevIndex = (current - 1 + slides.length) % slides.length;
    goToSlide(prevIndex, -1);
  }, [goToSlide, slides.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const sectionEl = sectionRef.current;
    if (sectionEl) {
      const sectionTop = window.scrollY + sectionEl.getBoundingClientRect().top;
      window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }
    const current = activeSlideRef.current;
    const nextIndex = (current + 1) % slides.length;
    goToSlide(nextIndex, 1);
  }, [goToSlide, slides.length]);

  /**
   * 100% View Scroll-Locked Sequential Progression:
   * 1. Scrolling down from top (Hero):
   *    - Natural page scroll continues freely until the section is 100% in view.
   *    - Once 100% viewed, it locks at 100% view on Card 01 (Save The Date).
   *    - First scroll down advances to Card 02 (while staying 100% on this section).
   *    - Second scroll down advances to Card 03 (while staying 100% on this section).
   *    - Third scroll down on Card 03 releases lock and flows naturally down to Countdown.
   *
   * 2. Scrolling back up from below (Countdown):
   *    - Natural page scroll continues freely until the section is 100% in view.
   *    - Once 100% viewed, it locks at 100% view on Card 03 (Ethiopian Calendar).
   *    - First scroll up steps to Card 02 (while staying 100% on this section).
   *    - Second scroll up steps to Card 01 (while staying 100% on this section).
   *    - Third scroll up on Card 01 releases lock and flows naturally up to Hero.
   */
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScrollTracking = () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const windowH = window.innerHeight;
      const currentY = window.scrollY;
      const scrollingUp = currentY < lastScrollY;
      lastScrollY = currentY;

      // While scrolling down from above (in Hero section)
      if (!scrollingUp && rect.top > windowH * 0.3) {
        hasArrivedAt100.current = false;
        if (activeSlideRef.current !== 0) {
          activeSlideRef.current = 0;
          setActiveSlide(0);
          setSlideDirection(1);
        }
      }
      // While scrolling up from below (in Countdown / Schedule sections)
      else if (scrollingUp && rect.bottom < windowH * 0.7) {
        hasArrivedAt100.current = false;
        if (activeSlideRef.current !== slides.length - 1) {
          activeSlideRef.current = slides.length - 1;
          setActiveSlide(slides.length - 1);
          setSlideDirection(-1);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const rect = sectionEl.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionTop = window.scrollY + rect.top;
      const deltaY = e.deltaY;

      if (Math.abs(deltaY) < 14) return; // Ignore micro-jitters

      const current = activeSlideRef.current;
      const now = Date.now();

      // Check if section is 100% in view (aligned at top or covering the viewport)
      const is100PercentInView = Math.abs(rect.top) <= 30 || (rect.top <= 20 && rect.bottom >= windowH - 20);

      // 1. If NOT 100% in view yet:
      if (!is100PercentInView) {
        hasArrivedAt100.current = false;

        // When approaching from above (Hero), ensure Card 01 is primed
        if (rect.top > 30 && current !== 0) {
          activeSlideRef.current = 0;
          setActiveSlide(0);
        }
        // When approaching from below (Countdown), ensure Card 03 is primed
        if (rect.top < -30 && current !== slides.length - 1) {
          activeSlideRef.current = slides.length - 1;
          setActiveSlide(slides.length - 1);
        }

        // Natural browser scroll brings the section into 100% view freely
        return;
      }

      // 2. The section IS 100% in view!
      // If we just entered 100% view from natural scroll:
      // Lock scroll position at 100% view and absorb entrance momentum so the starting card is not skipped!
      if (!hasArrivedAt100.current) {
        hasArrivedAt100.current = true;
        window.scrollTo({ top: sectionTop, behavior: 'instant' });
        cooldownUntil.current = now + 480;
        e.preventDefault();
        return;
      }

      // 3. If currently in transition or arrival cooldown:
      // Keep section locked at 100% view and absorb scroll events
      if (now < cooldownUntil.current || isTransitioning.current) {
        e.preventDefault();
        window.scrollTo({ top: sectionTop, behavior: 'instant' });
        return;
      }

      // 4. Intentional user scroll while staying 100% on this section:
      if (deltaY > 0) {
        // Scrolling DOWN
        if (current < slides.length - 1) {
          // Stay locked at 100% view of this section and advance: Card 01 -> Card 02 -> Card 03
          e.preventDefault();
          window.scrollTo({ top: sectionTop, behavior: 'instant' });
          goToSlide(current + 1, 1);
        } else {
          // Already on Card 03 (last card): release lock and allow natural scroll to countdown
          hasArrivedAt100.current = false;
        }
      } else {
        // Scrolling UP
        if (current > 0) {
          // Stay locked at 100% view of this section and step back: Card 03 -> Card 02 -> Card 01
          e.preventDefault();
          window.scrollTo({ top: sectionTop, behavior: 'instant' });
          goToSlide(current - 1, -1);
        } else {
          // Already on Card 01 (first card): release lock and allow natural scroll to hero
          hasArrivedAt100.current = false;
        }
      }
    };

    window.addEventListener('scroll', handleScrollTracking, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScrollTracking);
      window.removeEventListener('wheel', handleWheel);
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, [goToSlide, slides.length]);

  // Optional auto-advance configured via admin settings (rotates smoothly if enabled)
  const autoAdvance = weddingData.storyCardAutoAdvance ?? false;
  const durationSec = weddingData.storyCardDurationSeconds ?? 12;
  const pauseOnHover = weddingData.storyCardPauseOnHover ?? true;

  useEffect(() => {
    if (!autoAdvance) return;
    const interval = setInterval(() => {
      if (isHovered && pauseOnHover) return;
      if (!isTransitioning.current) {
        const nextIndex = (activeSlideRef.current + 1) % slides.length;
        goToSlide(nextIndex, 1);
      }
    }, durationSec * 1000);

    return () => clearInterval(interval);
  }, [autoAdvance, durationSec, isHovered, pauseOnHover, goToSlide, slides.length]);

  // Touch Gestures: supports both vertical scrolling gestures and horizontal swipes
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    const deltaY = touchStartY.current - touchEndY;
    const deltaX = touchStartX.current - touchEndX;

    const current = activeSlideRef.current;
    const rect = sectionEl.getBoundingClientRect();
    const windowH = window.innerHeight;
    const sectionTop = window.scrollY + rect.top;

    // Horizontal swipe takes precedence for switching cards
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    } else if (Math.abs(deltaY) > 45) {
      // Vertical swipe: only step cards if section is 100% viewed
      const is100PercentInView = Math.abs(rect.top) <= 35 || (rect.top <= 20 && rect.bottom >= windowH - 20);
      if (is100PercentInView) {
        if (deltaY > 0) {
          // Swiped up (scroll down)
          if (current < slides.length - 1 && !isTransitioning.current) {
            window.scrollTo({ top: sectionTop, behavior: 'smooth' });
            goToSlide(current + 1, 1);
          }
        } else {
          // Swiped down (scroll up)
          if (current > 0 && !isTransitioning.current) {
            window.scrollTo({ top: sectionTop, behavior: 'smooth' });
            goToSlide(current - 1, -1);
          }
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
      id="invitation"
      className="relative w-full min-h-screen py-8 sm:py-12 flex flex-col items-center justify-center px-3 sm:px-6 overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
                onClick={() => {
                  const sectionEl = sectionRef.current;
                  if (sectionEl) {
                    const sectionTop = window.scrollY + sectionEl.getBoundingClientRect().top;
                    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
                  }
                  goToSlide(idx, idx > activeSlide ? 1 : -1);
                }}
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
              onClick={() => {
                const sectionEl = sectionRef.current;
                if (sectionEl) {
                  const sectionTop = window.scrollY + sectionEl.getBoundingClientRect().top;
                  window.scrollTo({ top: sectionTop, behavior: 'smooth' });
                }
                goToSlide(idx, idx > activeSlide ? 1 : -1);
              }}
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
