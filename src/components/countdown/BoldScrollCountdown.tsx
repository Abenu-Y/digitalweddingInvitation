'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { GoldArtDecoCorners } from '../common/GoldArtDecoCorners';

interface BoldScrollCountdownProps {
  targetDateIso?: string;
}

export const BoldScrollCountdown: React.FC<BoldScrollCountdownProps> = ({
  targetDateIso = '2026-11-15T15:00:00',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDateIso) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateIso]);

  const countdownUnits = [
    {
      value: timeLeft.days,
      labelEn: 'DAYS',
      labelAm: 'ቀናት',
      direction: -1, // From left
      delay: 0.1,
    },
    {
      value: timeLeft.hours,
      labelEn: 'HOURS',
      labelAm: 'ሰዓታት',
      direction: 1, // From right
      delay: 0.25,
    },
    {
      value: timeLeft.minutes,
      labelEn: 'MINUTES',
      labelAm: 'ደቂቃዎች',
      direction: -1, // From left
      delay: 0.4,
    },
    {
      value: timeLeft.seconds,
      labelEn: 'SECONDS',
      labelAm: 'ሰከንዶች',
      direction: 1, // From right
      delay: 0.55,
      isSeconds: true,
    },
  ];

  return (
    <section id="countdown-bold" className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#0a3a2a]/30 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-black/40 backdrop-blur-md mb-3 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin-slow" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#edd58a] font-cinzel font-semibold">
            COUNTING DOWN TO
          </span>
        </motion.div>

        {/* Big Script Title */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-script text-5xl sm:text-7xl text-[#edd58a] drop-shadow-[0_4px_15px_rgba(212,175,55,0.3)] leading-tight mb-2"
        >
          Our Special Day
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif italic text-sm sm:text-base text-[#edd58a]/85 mb-1"
        >
          Until we become one in love
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-amharic text-base sm:text-lg text-[#edd58a] font-medium mb-10 tracking-wide"
        >
          በፍቅር አንድ እስክንሆን
        </motion.p>

        {/* BOLD 4-CARD GRID WITH SCROLL-IN FROM SIDES ANIMATION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl mb-10">
          {countdownUnits.map((unit, idx) => (
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                x: unit.direction * 90, // Slides boldly from left or right!
                scale: 0.9,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{
                type: 'spring',
                damping: 18,
                stiffness: 85,
                delay: unit.delay,
              }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#092b21] via-[#07241c] to-[#041913] p-5 sm:p-7 border-2 border-[#d4af37]/50 shadow-[0_15px_40px_rgba(0,0,0,0.65),0_0_25px_rgba(212,175,55,0.18)] backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden group"
            >
              {/* Inner subtle gold border */}
              <div className="absolute inset-1.5 border border-[#d4af37]/20 rounded-xl pointer-events-none" />

              {/* Shimmer light sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {/* Bold Large Number */}
              <span
                className={`font-cinzel text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#edd58a] tracking-tight drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] ${
                  unit.isSeconds ? 'animate-pulse' : ''
                }`}
              >
                {String(unit.value).padStart(2, '0')}
              </span>

              {/* English Label */}
              <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.25em] text-[#fff3cb] mt-2 uppercase">
                {unit.labelEn}
              </span>

              {/* Amharic Label */}
              <span className="font-amharic text-xs sm:text-sm text-[#edd58a]/80 font-medium mt-0.5">
                {unit.labelAm}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Date & Venue Footer Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-3 rounded-2xl bg-[#062017]/80 border border-[#d4af37]/40 shadow-xl backdrop-blur-md text-xs sm:text-sm text-[#edd58a]"
        >
          <div className="flex items-center space-x-2 font-amharic font-semibold">
            <Heart className="w-4 h-4 text-[#d4af37] fill-[#d4af37]/40" />
            <span>እሑድ፣ ህዳር 6፣ 2019 ዓ.ም</span>
            <span className="text-stone-400">•</span>
            <span>ከ9:00 እስከ 12:00</span>
          </div>
          <span className="hidden sm:inline text-stone-500">|</span>
          <span className="font-amharic text-stone-300">
            📍ልደታ መካነየሱስ ቤተክርስቲያን
          </span>
        </motion.div>
      </div>
    </section>
  );
};
