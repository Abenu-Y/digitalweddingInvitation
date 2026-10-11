'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useWedding } from '@/context/WeddingContext';
import { Sparkles } from 'lucide-react';

export const WaxSealEnvelope: React.FC = () => {
  const {
    weddingData,
    currentGuest,
    activeTheme,
    isEnvelopeOpened,
    openEnvelope,
    language,
    setPlayingMusic,
  } = useWedding();

  const [isHovered, setIsHovered] = useState(false);
  const [animationStep, setAnimationStep] = useState<'sealed' | 'opening' | 'revealed' | 'entering'>('sealed');

  const handleSealClick = () => {
    if (animationStep !== 'sealed') return;

    // Step 2: Seal clicked -> trigger audio & confetti, break seal, rotate flap
    setAnimationStep('opening');

    try {
      setPlayingMusic(true);
    } catch (e) {
      console.log('Audio playback trigger:', e);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#f3e5ab', '#edd58a', '#c5a059', '#ffffff'],
      });
    } catch (e) {
      // Confetti fallback
    }

    // Step 3: Card slides up after flap rotates open (~600ms)
    setTimeout(() => {
      setAnimationStep('revealed');
    }, 600);

    // Step 4: Expand smoothly into full wedding website (~2200ms)
    setTimeout(() => {
      setAnimationStep('entering');
    }, 2200);

    // Complete transition and unmount envelope (~2800ms)
    setTimeout(() => {
      openEnvelope();
    }, 2800);
  };

  const isFlapOpen = animationStep === 'opening' || animationStep === 'revealed' || animationStep === 'entering';
  const isCardRevealed = animationStep === 'revealed' || animationStep === 'entering';

  return (
    <AnimatePresence>
      {!isEnvelopeOpened && (
        <motion.div
          key="cinematic-envelope-screen"
          initial={{ opacity: 0 }}
          animate={{
            opacity: animationStep === 'entering' ? 0 : 1,
            scale: animationStep === 'entering' ? 1.08 : 1,
            transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
          }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between min-h-screen w-full px-4 py-8 sm:py-12 select-none overflow-hidden"
          style={{
            backgroundColor: '#041a12',
            backgroundImage: `
              radial-gradient(circle at 18% 18%, rgba(212, 175, 55, 0.16) 0%, transparent 45%),
              radial-gradient(circle at 85% 85%, rgba(212, 175, 55, 0.12) 0%, transparent 40%),
              linear-gradient(135deg, #06281c 0%, #03170f 50%, #02110a 100%)
            `,
          }}
        >
          {/* Subtle warm sunlight beam across emerald background */}
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] pointer-events-none rounded-full blur-[140px] opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(237, 213, 138, 0.45) 0%, rgba(212, 175, 55, 0.1) 70%, transparent 100%)',
            }}
          />

          {/* Decorative Corner Foliage (Top-Left Botanical Olive Leaves) */}
          <div className="absolute top-0 left-0 w-36 h-36 sm:w-56 sm:h-56 pointer-events-none opacity-45 transform -scale-x-100">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
              <path
                d="M10 10 C 40 40, 70 80, 110 140"
                stroke="#124e35"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M30 35 C 15 25, 10 5, 30 15 C 45 25, 40 45, 30 35 Z"
                fill="#165b3f"
                opacity="0.85"
              />
              <path
                d="M55 60 C 40 45, 30 25, 55 35 C 75 45, 70 70, 55 60 Z"
                fill="#0f462f"
                opacity="0.9"
              />
              <path
                d="M75 95 C 60 75, 45 60, 75 65 C 95 75, 90 105, 75 95 Z"
                fill="#1c6e4c"
                opacity="0.8"
              />
              <path
                d="M100 130 C 85 110, 65 95, 95 100 C 115 110, 115 140, 100 130 Z"
                fill="#145238"
                opacity="0.85"
              />
              {/* Subtle gold seed berries */}
              <circle cx="48" cy="42" r="2.5" fill="#d4af37" opacity="0.7" />
              <circle cx="70" cy="78" r="2.5" fill="#edd58a" opacity="0.7" />
              <circle cx="92" cy="112" r="3" fill="#d4af37" opacity="0.7" />
            </svg>
          </div>

          {/* Decorative Corner Foliage (Bottom-Right Botanical Leaves) */}
          <div className="absolute bottom-0 right-0 w-36 h-36 sm:w-56 sm:h-56 pointer-events-none opacity-45">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
              <path
                d="M190 190 C 160 160, 130 120, 90 60"
                stroke="#124e35"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M170 165 C 185 175, 190 195, 170 185 C 155 175, 160 155, 170 165 Z"
                fill="#165b3f"
                opacity="0.85"
              />
              <path
                d="M145 140 C 160 155, 170 175, 145 165 C 125 155, 130 130, 145 140 Z"
                fill="#0f462f"
                opacity="0.9"
              />
              <path
                d="M125 105 C 140 125, 155 140, 125 135 C 105 125, 110 95, 125 105 Z"
                fill="#1c6e4c"
                opacity="0.8"
              />
              <path
                d="M100 70 C 115 90, 135 105, 105 100 C 85 90, 85 60, 100 70 Z"
                fill="#145238"
                opacity="0.85"
              />
              <circle cx="152" cy="158" r="2.5" fill="#d4af37" opacity="0.7" />
              <circle cx="130" cy="122" r="2.5" fill="#edd58a" opacity="0.7" />
              <circle cx="108" cy="88" r="3" fill="#d4af37" opacity="0.7" />
            </svg>
          </div>

          {/* 1. TOP HEADER: Couple Names and Marriage Announcement */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center text-center mt-2 sm:mt-4"
          >
            {/* Elegant Floral Motif Emblem */}
            <div className="flex items-center space-x-3 mb-2 text-[#d4af37]">
              <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#d4af37]/60" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#edd58a]">
                <path
                  d="M12 2L13.5 8.5L20 10L14.5 13.5L16 20L12 16L8 20L9.5 13.5L4 10L10.5 8.5L12 2Z"
                  fill="currentColor"
                  opacity="0.9"
                />
              </svg>
              <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#d4af37]/60" />
            </div>

            {/* Couple Stately Names */}
            <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-normal tracking-[0.28em] text-[#edd58a] drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] pl-[0.28em]">
              {weddingData.groomName.toUpperCase()} &amp; {weddingData.brideName.toUpperCase()}
            </h1>

            {/* Sub-tagline */}
            <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] text-[#c5a059] uppercase mt-2 font-medium pl-[0.35em]">
              Are Getting Married
            </p>
          </motion.header>

          {/* 2. CENTER: The Realistic 3D Horizontal Wedding Envelope */}
          <div className="relative z-20 my-auto flex items-center justify-center w-full max-w-[560px] px-2 sm:px-4">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
              className="relative w-full aspect-[1.58/1] max-h-[350px]"
              style={{
                perspective: '1400px',
              }}
            >
              {/* Outer Realistic Shadow */}
              <div
                className="absolute inset-2 sm:inset-3 rounded-lg pointer-events-none transition-shadow duration-700"
                style={{
                  boxShadow: isCardRevealed
                    ? '0 40px 90px -10px rgba(0,0,0,0.95), 0 0 50px rgba(212,175,55,0.25)'
                    : '0 30px 65px -12px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.8)',
                }}
              />

              {/* ENVELOPE BACK WALL / INTERIOR LINING */}
              <div
                className="absolute inset-0 rounded-lg overflow-hidden border border-[#d4af37]/25"
                style={{
                  backgroundColor: '#03170f',
                  backgroundImage: 'radial-gradient(ellipse at center, #05261a 0%, #02120b 100%)',
                }}
              />

              {/* THE INVITATION CARD (Sliding smoothly UP out of the envelope pocket in Step 3) */}
              <motion.div
                initial={{ y: 0, scale: 0.98, opacity: 0 }}
                animate={
                  isCardRevealed
                    ? {
                        y: -190,
                        scale: 1.04,
                        opacity: 1,
                        transition: {
                          duration: 1.1,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                    : { y: 0, scale: 0.98, opacity: 0 }
                }
                className="absolute inset-x-4 sm:inset-x-6 top-3 h-[90%] rounded-md p-4 sm:p-6 flex flex-col items-center justify-between text-center select-none shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-20 pointer-events-none"
                style={{
                  backgroundColor: '#fbf8ef',
                  backgroundImage: `
                    radial-gradient(circle at 50% 50%, #ffffff 0%, #f7f2e4 100%)
                  `,
                  border: '1px solid rgba(212, 175, 55, 0.7)',
                }}
              >
                {/* Thin Inner Gold Foil Border & Corner Accents */}
                <div className="absolute inset-2 sm:inset-3 rounded border border-[#d4af37]/45 pointer-events-none flex flex-col justify-between p-1">
                  <div className="flex justify-between text-[#b8860b] text-[10px]">
                    <span>❖</span>
                    <span>❖</span>
                  </div>
                  <div className="flex justify-between text-[#b8860b] text-[10px]">
                    <span>❖</span>
                    <span>❖</span>
                  </div>
                </div>

                {/* Card Top Announcement */}
                <div className="pt-1">
                  <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#7a6021] block">
                    The Wedding Celebration Of
                  </span>
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-1" />
                </div>

                {/* Card Center: Couple Royal Names in Calligraphy Script */}
                <div className="my-auto py-1">
                  <h2 className="font-script text-2xl sm:text-4xl text-[#1a382b] font-normal leading-tight">
                    {weddingData.groomFullName || 'Hosni Mubarek'}
                  </h2>
                  <span className="font-serif italic text-sm sm:text-lg text-[#947220] block my-0.5">
                    &amp;
                  </span>
                  <h2 className="font-script text-2xl sm:text-4xl text-[#1a382b] font-normal leading-tight">
                    {weddingData.brideFullName || 'Jerusalem Alemayehu'}
                  </h2>
                </div>

                {/* Card Bottom: Date & Venue */}
                <div className="pb-1 w-full border-t border-[#d4af37]/30 pt-1.5 flex flex-col items-center text-[#4a3b15]">
                  <p className="font-cinzel text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#1a382b]">
                    Sunday, November 15, 2026
                  </p>
                  <p className="font-amharic text-[10px] sm:text-xs text-[#6e5824] mt-0.5">
                    ልደታ መካነየሱስ ቤተክርስቲያን • አዲስ አበባ
                  </p>
                </div>
              </motion.div>

              {/* ENVELOPE FRONT FOLDS (Pocket formed by Left, Right, and Bottom Triangles) */}
              <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-lg">
                {/* Left Side Fold Triangle */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
                    backgroundColor: '#072b1e',
                    backgroundImage: 'linear-gradient(to right, #052217 0%, #093627 100%)',
                    boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.5)',
                  }}
                />

                {/* Right Side Fold Triangle */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
                    backgroundColor: '#072b1e',
                    backgroundImage: 'linear-gradient(to left, #052217 0%, #093627 100%)',
                    boxShadow: 'inset 2px 0 10px rgba(0,0,0,0.5)',
                  }}
                />

                {/* Bottom Fold Triangle (overlaps left & right folds) */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(0% 100%, 50% 48%, 100% 100%)',
                    backgroundColor: '#06261a',
                    backgroundImage: 'linear-gradient(to top, #041d14 0%, #083424 100%)',
                    boxShadow: '0 -4px 15px rgba(0,0,0,0.4)',
                  }}
                />

                {/* Delicate Gold Edging along front fold seams */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <line x1="0" y1="100" x2="50" y2="48" stroke="rgba(212, 175, 55, 0.45)" strokeWidth="0.5" />
                  <line x1="100" y1="100" x2="50" y2="48" stroke="rgba(212, 175, 55, 0.45)" strokeWidth="0.5" />
                </svg>
              </div>

              {/* ENVELOPE TOP TRIANGULAR FLAP (Rotates 180° upward in Step 2 with 3D CSS transform) */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{
                  rotateX: isFlapOpen ? -180 : 0,
                  transition: {
                    duration: 0.85,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
                style={{
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  zIndex: isFlapOpen ? 10 : 35, // When flap folds back, it drops behind the rising card!
                }}
                className="absolute inset-x-0 top-0 h-full pointer-events-none"
              >
                {/* Flap Outer Surface (Seen when closed) */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 55%)',
                    backgroundColor: '#083324',
                    backgroundImage: 'linear-gradient(to bottom, #093a29 0%, #05251a 100%)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                    backfaceVisibility: 'hidden',
                  }}
                />

                {/* Flap Fine Gold Foil V-Edging */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <polyline
                    points="0,0 50,55 100,0"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />
                  <polyline
                    points="2,0 50,53 98,0"
                    fill="none"
                    stroke="#edd58a"
                    strokeWidth="0.25"
                    opacity="0.5"
                  />
                </svg>

                {/* Flap Inside Lining Surface (Seen when flipped open) */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: 'rotateX(180deg)',
                    backfaceVisibility: 'hidden',
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 55%)',
                    backgroundColor: '#03170f',
                    backgroundImage: 'radial-gradient(ellipse at 50% 30%, #052c1e 0%, #02110a 100%)',
                  }}
                />
              </motion.div>

              {/* 3. THE GOLD WAX SEAL (Embossed with "H&J", centered at the flap apex) */}
              <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <AnimatePresence>
                  {!isFlapOpen && (
                    <motion.button
                      key="wax-seal-button"
                      onClick={handleSealClick}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      exit={{
                        scale: [1, 1.3, 0],
                        opacity: [1, 1, 0],
                        rotate: [0, -10, 20],
                        transition: { duration: 0.55, ease: 'easeOut' },
                      }}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer focus:outline-none group flex items-center justify-center select-none"
                      aria-label="Click the wax seal to open your invitation"
                      title="Click to open invitation"
                    >
                      {/* Wax Seal Cast Drop Shadow */}
                      <div className="absolute inset-0 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.85),0_0_15px_rgba(212,175,55,0.4)] pointer-events-none" />

                      {/* Organic Molten Scalloped Wax Base */}
                      <div
                        className="absolute inset-0 rounded-full transition-transform duration-300"
                        style={{
                          background: `
                            radial-gradient(circle at 35% 30%, #fef3c7 0%, #d4af37 40%, #b8860b 75%, #855b0a 100%)
                          `,
                          boxShadow: `
                            inset 0 2px 4px rgba(255,255,255,0.6),
                            inset 0 -3px 6px rgba(0,0,0,0.6),
                            0 4px 14px rgba(0,0,0,0.8)
                          `,
                        }}
                      />

                      {/* Molten wax irregular edge silhouette */}
                      <svg
                        viewBox="0 0 100 100"
                        className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none text-[#b8860b]"
                        fill="currentColor"
                        opacity="0.35"
                      >
                        <path d="M50 2 C 60 1, 70 8, 80 15 C 90 22, 98 32, 99 44 C 100 56, 95 68, 88 78 C 81 88, 70 95, 58 98 C 46 100, 32 96, 22 88 C 12 80, 4 68, 2 54 C 0 40, 6 26, 16 16 C 26 6, 38 3, 50 2 Z" />
                      </svg>

                      {/* Inner Embossed Ring */}
                      <div
                        className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center text-center"
                        style={{
                          background: `
                            radial-gradient(circle at 40% 35%, #ecd27e 0%, #c49929 55%, #946c14 100%)
                          `,
                          boxShadow: `
                            inset 0 2px 3px rgba(0,0,0,0.4),
                            inset 0 -2px 3px rgba(255,255,255,0.4),
                            0 0 0 1.5px rgba(255,245,190,0.5)
                          `,
                        }}
                      >
                        {/* Botanical Flourish at top of seal */}
                        <div className="text-[#684906] text-[8px] sm:text-[9px] -mb-0.5 leading-none opacity-85">
                          ❧
                        </div>

                        {/* Embossed Monogram "H&J" */}
                        <span
                          className="font-serif font-bold text-xs sm:text-sm tracking-wider text-[#523903] leading-none"
                          style={{
                            textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.4), -0.5px -0.5px 0px rgba(0,0,0,0.4)',
                          }}
                        >
                          H&amp;J
                        </span>

                        {/* Botanical Flourish at bottom of seal */}
                        <div className="text-[#684906] text-[8px] sm:text-[9px] -mt-0.5 leading-none opacity-85 transform rotate-180">
                          ❧
                        </div>
                      </div>

                      {/* Pulsing gentle golden glow ring */}
                      <div
                        className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-20"
                        style={{
                          background: 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%)',
                          animationDuration: '3s',
                        }}
                      />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* 3. BOTTOM FOOTER: Invitation Instruction & Animated Hand Prompt */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center text-center mb-2 sm:mb-4"
          >
            {/* Elegant Serif Invitation Subtext */}
            <h2 className="font-cinzel text-xs sm:text-sm tracking-[0.28em] text-[#edd58a] uppercase font-medium pl-[0.28em] mb-2">
              You Are Cordially Invited
            </h2>

            {/* Subtle Interactive Instruction with Animated Finger Cursor & Gold Lines */}
            <div
              onClick={handleSealClick}
              className="flex items-center space-x-2 text-[11px] sm:text-xs text-[#c5a059] cursor-pointer hover:text-[#edd58a] transition-colors"
            >
              <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#c5a059]/60" />
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block text-sm"
              >
                👆
              </motion.span>
              <span className="font-serif italic tracking-wide">
                Click the seal to open your invitation
              </span>
              <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#c5a059]/60" />
            </div>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
