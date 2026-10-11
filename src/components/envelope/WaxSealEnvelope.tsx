'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useWedding } from '@/context/WeddingContext';
import { Sparkles, Heart, MailOpen, Crown, ChevronUp } from 'lucide-react';

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
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Immediately start romantic audio playback (which will start from 40s)
    try {
      setPlayingMusic(true);
    } catch (e) {
      console.log('Audio trigger error:', e);
    }

    // 2. Launch spectacular golden confetti cascades
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#d4af37', '#edd58a', '#ffffff', '#b8860b', '#fff3cb'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 65,
          origin: { x: 0.1, y: 0.6 },
          colors: ['#d4af37', '#ffd700', '#fdfbf7', '#e2b842'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 65,
          origin: { x: 0.9, y: 0.6 },
          colors: ['#d4af37', '#ffd700', '#fdfbf7', '#e2b842'],
        });
      }, 300);
    } catch (e) {
      console.error('Confetti error:', e);
    }

    // 3. Smooth transition to reveal the full webpage after the card emerges
    setTimeout(() => {
      openEnvelope();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {!isEnvelopeOpened && (
        <motion.div
          key="wax-seal-envelope-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.15,
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-2xl p-4 sm:p-6 overflow-hidden"
        >
          {/* Ambient Golden Particles / Floating Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full blur-[140px] opacity-25 animate-pulse"
              style={{ backgroundColor: activeTheme.sealColor || '#b8860b' }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] opacity-25 animate-pulse [animation-delay:2s]"
              style={{ backgroundColor: activeTheme.highlightHex || '#d4af37' }}
            />
          </div>

          {/* Envelope Main Container */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.93 }}
            animate={
              isOpening
                ? {
                    scale: [1, 1.03, 1.12],
                    opacity: [1, 1, 0],
                    y: [0, -10, -35],
                    transition: { delay: 1.1, duration: 0.7, ease: 'easeInOut' },
                  }
                : { y: 0, opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
            }
            className="relative w-full max-w-lg z-10"
          >
            {/* Top Decorative Monogram Header */}
            <motion.div
              animate={isOpening ? { opacity: 0, y: -20, transition: { duration: 0.4 } } : { opacity: 1, y: 0 }}
              className="text-center mb-5"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#d4af37]/45 bg-black/60 backdrop-blur-md mb-2 shadow-lg">
                <Crown className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#edd58a] font-cinzel font-semibold">
                  Royal Wedding Invitation
                </span>
              </div>
              <h2 className="text-sm font-amharic text-[#fff3cb]/90">የክብር የሰርግ ጥሪ ግብዣ</h2>
            </motion.div>

            {/* Realistic 3D Luxury Envelope Card */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleOpen}
              className="relative cursor-pointer group rounded-3xl overflow-visible shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] border-2 transition-transform duration-500 hover:scale-[1.01]"
              style={{
                backgroundColor: activeTheme.cardBgHex || '#07241c',
                borderColor: activeTheme.cardBorderHex || 'rgba(212, 175, 55, 0.45)',
                boxShadow: `0 25px 70px rgba(0,0,0,0.95), 0 0 35px ${activeTheme.glowColor}`,
              }}
            >
              {/* Ethiopian Tibeb Pattern Header Bar */}
              <div className="h-4 w-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 opacity-90 rounded-t-3xl" />

              {/* The Sliding Royal Letter Card (rises up out of the pocket when opened) */}
              <motion.div
                initial={{ y: 0, opacity: 0, scale: 0.95 }}
                animate={
                  isOpening
                    ? {
                        y: -230,
                        opacity: 1,
                        scale: 1.05,
                        transition: { delay: 0.35, duration: 0.9, ease: [0.25, 1, 0.5, 1] },
                      }
                    : { y: 0, opacity: 0, scale: 0.95 }
                }
                className="absolute inset-x-4 top-4 h-[320px] rounded-2xl bg-gradient-to-b from-[#092b21] via-[#07241c] to-[#041913] border-2 border-[#d4af37]/70 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.4)] p-6 flex flex-col items-center justify-between text-center pointer-events-none z-20"
              >
                <div className="w-full flex justify-between items-center text-[11px] font-cinzel text-[#edd58a] uppercase tracking-widest border-b border-[#d4af37]/30 pb-2">
                  <span>Save The Date</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                  <span>Sunday, Nov 15</span>
                </div>

                <div className="my-auto py-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-300 font-cinzel mb-1">
                    The Holy Matrimony Of
                  </p>
                  <h1 className="font-script text-3xl sm:text-4xl text-[#edd58a] drop-shadow-md leading-tight">
                    {weddingData.groomName} <span className="text-[#fff3cb]">&</span> {weddingData.brideName}
                  </h1>
                  <p className="text-xs font-amharic text-[#fff3cb]/90 mt-1">
                    {weddingData.groomNameAmharic} እና {weddingData.brideNameAmharic}
                  </p>
                </div>

                <div className="w-full pt-2 border-t border-[#d4af37]/30 flex items-center justify-center space-x-2 text-xs font-amharic text-[#edd58a]">
                  <span>📍ልደታ መካነየሱስ</span>
                  <span>•</span>
                  <span>ከ9:00 እስከ 12:00</span>
                </div>
              </motion.div>

              {/* Envelope Flap 3D Perspective Hinged Triangle */}
              <div
                className="relative overflow-hidden rounded-t-2xl z-30"
                style={{ perspective: '1200px' }}
              >
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={
                    isOpening
                      ? {
                          rotateX: -160,
                          transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] },
                        }
                      : { rotateX: 0 }
                  }
                  style={{ transformOrigin: 'top center' }}
                  className="w-full h-24 bg-gradient-to-b from-[#0a3528] to-[#06241b] border-b border-[#d4af37]/40 shadow-md relative flex items-center justify-center"
                >
                  {/* Flap gold piping decoration */}
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                  <div className="w-2.5 h-2.5 rotate-45 border-r border-b border-[#d4af37]/60 absolute bottom-[-5px]" />
                </motion.div>
              </div>

              {/* Envelope Pocket Face */}
              <div
                className="relative p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[330px] z-30"
                style={{
                  backgroundImage: `radial-gradient(circle at center, ${activeTheme.cardBgHex}f0 0%, #03140e 100%)`,
                }}
              >
                {/* Golden Frame Border Inside */}
                <div className="absolute inset-4 rounded-2xl border border-[#d4af37]/30 pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between text-[#d4af37]/60 text-xs">
                    <span>❖</span>
                    <span>❖</span>
                  </div>
                  <div className="flex justify-between text-[#d4af37]/60 text-xs">
                    <span>❖</span>
                    <span>❖</span>
                  </div>
                </div>

                {/* Envelope Recipient Section (Personalized Guest Info) */}
                <motion.div
                  animate={isOpening ? { opacity: 0, scale: 0.9, transition: { duration: 0.3 } } : { opacity: 1, scale: 1 }}
                  className="my-auto py-2 z-10 max-w-sm"
                >
                  <p className="text-[11px] uppercase tracking-widest text-[#edd58a] font-cinzel font-semibold mb-1.5">
                    {language === 'am' ? 'የክብር ጥሪ ለ፡' : 'Specially Prepared For:'}
                  </p>

                  <div className="py-2.5 px-5 rounded-xl bg-black/50 border border-[#d4af37]/40 inline-block max-w-full shadow-inner">
                    <h3 className="text-lg sm:text-xl font-cinzel font-bold text-gold-shimmer">
                      {currentGuest ? currentGuest.name : `${weddingData.groomName} & ${weddingData.brideName}'s Honored Guest`}
                    </h3>
                    {currentGuest?.nameAmharic && (
                      <p className="text-xs font-amharic text-amber-200/90 mt-0.5">
                        {currentGuest.nameAmharic}
                      </p>
                    )}
                  </div>

                  {currentGuest && (
                    <div className="mt-2.5 flex items-center justify-center space-x-2 text-[11px] text-amber-300/90 font-medium">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40">
                        {currentGuest.group}
                      </span>
                      {currentGuest.tableNumber && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40">
                          Table {currentGuest.tableNumber}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Golden Ribbon Line */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent my-2" />

                {/* 3D Wax Seal Button with dynamic breaking glow */}
                <div className="relative z-40 my-2">
                  <motion.div
                    animate={
                      isOpening
                        ? {
                            scale: [1, 1.25, 0],
                            rotate: [0, -15, 30],
                            opacity: [1, 1, 0],
                            transition: { duration: 0.6, ease: 'easeOut' },
                          }
                        : {
                            scale: isHovered ? 1.08 : [1, 1.03, 1],
                          }
                    }
                    transition={{
                      scale: {
                        repeat: isHovered || isOpening ? 0 : Infinity,
                        duration: 2.5,
                        ease: 'easeInOut',
                      },
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center wax-seal-3d transition-transform cursor-pointer relative shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                    style={{
                      backgroundColor: activeTheme.sealColor || '#b8860b',
                      borderColor: activeTheme.sealBorder || '#edd58a',
                      borderWidth: '3px',
                      boxShadow: `0 10px 30px rgba(0,0,0,0.9), 0 0 25px ${activeTheme.glowColor}`,
                    }}
                  >
                    {/* Inner Wax Seal Monogram */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-yellow-200/50 flex flex-col items-center justify-center text-center shadow-inner">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-100 mb-0.5 animate-spin-slow" />
                      <span className="font-cinzel text-xs sm:text-sm font-black text-amber-100 tracking-wider">
                        {weddingData.groomName[0]} & {weddingData.brideName[0]}
                      </span>
                      <span className="text-[8px] tracking-widest text-amber-200/80 uppercase mt-0.5 font-sans">
                        SEAL
                      </span>
                    </div>

                    {/* Seal Opening Light Flare */}
                    {isOpening && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 3, opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 blur-xl pointer-events-none"
                      />
                    )}
                  </motion.div>
                </div>

                {/* Call to action Prompt Text */}
                <motion.div
                  animate={isOpening ? { opacity: 0, y: 10, transition: { duration: 0.3 } } : { opacity: 1, y: 0 }}
                  className="z-10 mt-1.5"
                >
                  <p className="text-xs uppercase tracking-widest text-[#edd58a] font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                    <MailOpen className="w-3.5 h-3.5" />
                    <span>{language === 'am' ? 'ጥሪውን ለመክፈት ማህተሙን ይጫኑ' : 'Click Seal To Open Invitation'}</span>
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1 font-amharic">
                    {language === 'am' ? '♫ ሙዚቃ አብሮ ይከፈታል (ከ40 ሰከንድ ጀምሮ)' : '♫ Romantic melody starts from 40s on opening'}
                  </p>
                </motion.div>
              </div>

              {/* Bottom Accent Tibeb Bar */}
              <div className="h-2.5 w-full bg-gradient-to-r from-amber-800 via-amber-400 to-amber-700 opacity-80 rounded-b-3xl" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
