'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';

interface AutoScrollControllerProps {
  speedPixelsPerSecond?: number;
  initialActive?: boolean;
}

export const AutoScrollController: React.FC<AutoScrollControllerProps> = ({
  speedPixelsPerSecond = 40,
  initialActive = true,
}) => {
  const { weddingData } = useWedding();
  const effectiveSpeed = weddingData?.autoScrollSpeed || speedPixelsPerSecond || 40;

  const [isActive, setIsActive] = useState<boolean>(initialActive);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [atBottom, setAtBottom] = useState<boolean>(false);

  // Refs for tracking animation frame
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const subPixelAccumulatorRef = useRef<number>(0);
  const userInteractingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user is near bottom
  const checkScrollPosition = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollY >= maxScroll - 20) {
      setAtBottom(true);
      setIsActive(false);
    } else {
      setAtBottom(false);
    }
  }, []);

  // Main animation frame scroll loop
  useEffect(() => {
    const step = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Only scroll if active and user is NOT holding the screen
      if (isActive && !isHolding) {
        const scrollDistance = effectiveSpeed * delta;
        subPixelAccumulatorRef.current += scrollDistance;

        if (subPixelAccumulatorRef.current >= 1) {
          const pixelsToScroll = Math.floor(subPixelAccumulatorRef.current);
          subPixelAccumulatorRef.current -= pixelsToScroll;
          window.scrollBy(0, pixelsToScroll);
          checkScrollPosition();
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [isActive, isHolding, effectiveSpeed, checkScrollPosition]);

  // Touch & Mouse Hold Listeners (Pause when holding the page)
  useEffect(() => {
    const isInteractiveElement = (target: EventTarget | null) => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return (
        tag === 'button' ||
        tag === 'a' ||
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        Boolean(target.closest('button')) ||
        Boolean(target.closest('a')) ||
        Boolean(target.closest('.interactive-control'))
      );
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      // Don't intercept clicks on buttons or form inputs
      if (isInteractiveElement(e.target)) return;
      setIsHolding(true);
    };

    const handlePointerUp = () => {
      setIsHolding(false);
    };

    // User manual wheel or swipe: pause temporarily, then resume if active
    const handleWheel = () => {
      setIsHolding(true);
      if (userInteractingTimeoutRef.current) {
        clearTimeout(userInteractingTimeoutRef.current);
      }
      userInteractingTimeoutRef.current = setTimeout(() => {
        setIsHolding(false);
      }, 1400);
      checkScrollPosition();
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', checkScrollPosition, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', checkScrollPosition);
      if (userInteractingTimeoutRef.current) {
        clearTimeout(userInteractingTimeoutRef.current);
      }
    };
  }, [checkScrollPosition]);

  const toggleAutoScroll = () => {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setAtBottom(false);
      setIsActive(true);
      return;
    }

    const nextState = !isActive;
    setIsActive(nextState);
    subPixelAccumulatorRef.current = 0;
    lastTimeRef.current = null;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAtBottom(false);
    setIsActive(true);
  };

  return (
    <aside aria-label="Auto-scroll controls" className="interactive-control fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end space-y-2 pointer-events-auto">
      <div className="flex items-center space-x-2">
        {/* Scroll To Top button when near bottom */}
        {atBottom && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full bg-[#08261e] border border-[#d4af37]/60 text-[#edd58a] shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center hover:border-[#d4af37] transition-all"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4 text-[#edd58a]" />
          </motion.button>
        )}

        {/* The Clean "Pause" / "Play" Auto-Scroll Toggle Button in English */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleAutoScroll}
          className={`group flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(212,175,55,0.25)] border backdrop-blur-xl ${
            isActive && !isHolding
              ? 'bg-gradient-to-r from-[#062017] via-[#092d21] to-[#062017] border-[#d4af37] text-[#fff3cb]'
              : 'bg-[#08221b]/95 border-[#d4af37]/50 text-[#edd58a]/90 hover:border-[#d4af37]'
          }`}
          title={isActive && !isHolding ? 'Pause' : 'Play'}
        >
          {/* Exact Intuitive "||" / "▶" Indicator */}
          <div className="flex items-center justify-center min-w-[16px]">
            {isActive && !isHolding ? (
              <span className="font-mono font-black text-sm tracking-tighter text-[#edd58a] group-hover:text-amber-200 transition-colors">
                ||
              </span>
            ) : (
              <span className="text-xs text-[#edd58a] ml-0.5">
                ▶
              </span>
            )}
          </div>

          {/* Simple English label as requested */}
          <span className="text-xs font-sans font-semibold tracking-wide">
            {isActive && !isHolding ? 'Pause' : 'Play'}
          </span>

          {/* Pulse ring when active */}
          {isActive && !isHolding && (
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
          )}
        </motion.button>
      </div>
    </aside>
  );
};
