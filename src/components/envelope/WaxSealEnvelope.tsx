'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useWedding } from '@/context/WeddingContext';
import { Sparkles, Heart, MailOpen, Crown } from 'lucide-react';

export const WaxSealEnvelope: React.FC = () => {
  const {
    weddingData,
    currentGuest,
    activeTheme,
    isEnvelopeOpened,
    openEnvelope,
    language,
  } = useWedding();

  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = () => {
    // Launch golden confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f5e2a3', '#ffffff', '#e5a9a9'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#d4af37', '#ffd700', '#fdfbf7'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#d4af37', '#ffd700', '#fdfbf7'],
        });
      }, 250);
    } catch (e) {
      console.error('Confetti error:', e);
    }

    openEnvelope();
  };

  if (isEnvelopeOpened) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.8, ease: 'easeInOut' } }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 overflow-hidden"
      >
        {/* Ambient Golden Particles / Floating Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ backgroundColor: activeTheme.sealColor }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse [animation-delay:2s]"
            style={{ backgroundColor: activeTheme.sealBorder }}
          />
        </div>

        {/* Envelope Container */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full max-w-lg z-10"
        >
          {/* Top Decorative Monogram */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-black/50 backdrop-blur-md mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs uppercase tracking-[0.25em] text-amber-200 font-cinzel">
                Royal Wedding Invitation
              </span>
            </div>
            <h2 className="text-sm font-amharic text-amber-300/90">የክብር የሰርግ ጥሪ ግብዣ</h2>
          </div>

          {/* Realistic Luxury Envelope Card */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleOpen}
            className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-[#d4af37]/40 transition-transform duration-500 hover:scale-[1.02]"
            style={{
              backgroundColor: activeTheme.envelopeColor,
            }}
          >
            {/* Ethiopian Tibeb Pattern Header Bar */}
            <div className="h-4 w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 opacity-80" />

            {/* Envelope Flap Triangle Graphic */}
            <div
              className="relative p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[340px]"
              style={{
                backgroundImage: `radial-gradient(circle at center, ${activeTheme.envelopeLining} 0%, ${activeTheme.envelopeColor} 100%)`,
              }}
            >
              {/* Golden Frame Border Inside */}
              <div className="absolute inset-4 rounded-xl border border-[#d4af37]/30 pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between text-[#d4af37]/50 text-xs">
                  <span>❖</span>
                  <span>❖</span>
                </div>
                <div className="flex justify-between text-[#d4af37]/50 text-xs">
                  <span>❖</span>
                  <span>❖</span>
                </div>
              </div>

              {/* Envelope Recipient Section (Personalized Guest Info) */}
              <div className="my-auto py-4 z-10 max-w-sm">
                <p className="text-[11px] uppercase tracking-widest text-stone-400 mb-1">
                  {language === 'am' ? 'የክብር ጥሪ ለ፡' : 'Specially Prepared For:'}
                </p>

                <div className="py-2 px-4 rounded-lg bg-black/40 border border-[#d4af37]/30 inline-block max-w-full">
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
                  <div className="mt-2 flex items-center justify-center space-x-2 text-[11px] text-amber-300/80">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                      {currentGuest.group}
                    </span>
                    {currentGuest.tableNumber && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                        {currentGuest.tableNumber}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Golden Ribbon Line */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent my-2" />

              {/* 3D Wax Seal Button */}
              <div className="relative z-20 my-3">
                <motion.div
                  animate={{
                    scale: isHovered ? 1.08 : [1, 1.03, 1],
                  }}
                  transition={{
                    scale: {
                      repeat: isHovered ? 0 : Infinity,
                      duration: 2.5,
                      ease: 'easeInOut',
                    },
                  }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center wax-seal-3d transition-transform cursor-pointer relative"
                  style={{
                    backgroundColor: activeTheme.sealColor,
                    borderColor: activeTheme.sealBorder,
                    borderWidth: '3px',
                  }}
                >
                  {/* Wax Seal Inner Ring */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-yellow-200/50 flex flex-col items-center justify-center text-center shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-100 mb-0.5 animate-spin-slow" />
                    <span className="font-cinzel text-xs sm:text-sm font-black text-amber-100 tracking-wider">
                      {weddingData.groomName[0]} & {weddingData.brideName[0]}
                    </span>
                    <span className="text-[8px] tracking-widest text-amber-200/80 uppercase mt-0.5 font-sans">
                      SEAL
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Prompt Text */}
              <div className="z-10 mt-2">
                <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                  <MailOpen className="w-3.5 h-3.5" />
                  <span>{language === 'am' ? 'ጥሪውን ለመክፈት ማህተሙን ይጫኑ' : 'Click Seal To Open Invitation'}</span>
                </p>
                <p className="text-[10px] text-stone-400 mt-1">
                  {language === 'am' ? '♫ ሙዚቃ አብሮ ይከፈታል' : '♫ Plays romantic melody on opening'}
                </p>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-2 w-full bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-600 opacity-60" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
