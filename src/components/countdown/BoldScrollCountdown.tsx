'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { GoldArtDecoCorners } from '../common/GoldArtDecoCorners';
import { useWedding } from '@/context/WeddingContext';

interface BoldScrollCountdownProps {
  targetDateIso?: string;
}

export const BoldScrollCountdown: React.FC<BoldScrollCountdownProps> = ({
  targetDateIso = '2026-11-15T15:00:00',
}) => {
  const { activeTheme } = useWedding();
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
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" style={{ color: activeTheme.accentHex }} />
          <span className="text-[11px] uppercase tracking-[0.3em] font-cinzel font-semibold" style={{ color: activeTheme.accentHex }}>
            COUNTING DOWN TO
          </span>
        </motion.div>

        {/* Big Script Title */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-script text-5xl sm:text-7xl leading-tight mb-2"
          style={{ color: activeTheme.accentHex, filter: `drop-shadow(0 4px 15px ${activeTheme.glowColor})` }}
        >
          Our Special Day
        </motion.h2>

        {/* <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif italic text-sm sm:text-base mb-10 opacity-90"
          style={{ color: activeTheme.secondaryTextHex }}
        >
          Until we become one in love
        </motion.p> */}

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
              style={{
                backgroundColor: activeTheme.cardBgHex,
                borderColor: activeTheme.cardBorderHex,
                boxShadow: `0 15px 40px rgba(0,0,0,0.65), 0 0 25px ${activeTheme.glowColor}`,
              }}
              className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden group transition-all"
            >
              {/* Inner subtle theme border */}
              <div
                style={{ borderColor: activeTheme.cardBorderHex }}
                className="absolute inset-1.5 border rounded-xl pointer-events-none opacity-40"
              />

              {/* Shimmer light sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {/* Bold Large Number */}
              <span
                style={{
                  color: activeTheme.accentHex,
                  textShadow: `0 2px 14px ${activeTheme.glowColor}`,
                }}
                className={`font-cinzel text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight ${
                  unit.isSeconds ? 'animate-pulse' : ''
                }`}
              >
                {String(unit.value).padStart(2, '0')}
              </span>

              {/* English Label */}
              <span
                style={{ color: activeTheme.secondaryTextHex }}
                className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.25em] mt-2 uppercase"
              >
                {unit.labelEn}
              </span>

              {/* Amharic Label */}
              <span
                style={{ color: activeTheme.accentHex }}
                className="font-amharic text-xs sm:text-sm font-medium mt-0.5 opacity-80"
              >
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
          style={{
            backgroundColor: `${activeTheme.cardBgHex}dd`,
            borderColor: activeTheme.cardBorderHex,
            color: activeTheme.secondaryTextHex,
          }}
          className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-3 rounded-2xl border shadow-xl backdrop-blur-md text-xs sm:text-sm"
        >
          <div className="flex items-center space-x-2 font-amharic font-semibold">
            <Heart className="w-4 h-4" style={{ color: activeTheme.accentHex, fill: `${activeTheme.accentHex}40` }} />
            <span>እሑድ፣ ህዳር 6፣ 2019 ዓ.ም</span>
            <span className="text-stone-400">•</span>
            <span>ከ9:00 እስከ 12:00</span>
          </div>
          <span className="hidden sm:inline text-stone-500">|</span>
          <span className="font-amharic opacity-90">
            📍ልደታ መካነየሱስ ቤተክርስቲያን
          </span>
        </motion.div>
      </div>
    </section>
  );
};
