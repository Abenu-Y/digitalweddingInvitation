'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoldArtDecoCorners } from '../common/GoldArtDecoCorners';

interface LuxuryCountdownCardProps {
  targetDateIso?: string;
  onCalendarClick?: () => void;
}

export const LuxuryCountdownCard: React.FC<LuxuryCountdownCardProps> = ({
  targetDateIso = '2026-11-15T15:00:00',
  onCalendarClick,
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

  const timeBlocks = [
    { value: timeLeft.days, labelEn: 'DAYS', labelAm: 'ቀናት' },
    { value: timeLeft.hours, labelEn: 'HOURS', labelAm: 'ሰዓታት' },
    { value: timeLeft.minutes, labelEn: 'MINUTES', labelAm: 'ደቂቃዎች' },
    { value: timeLeft.seconds, labelEn: 'SECONDS', labelAm: 'ሰከንዶች' },
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0a271f] via-[#09221b] to-[#061914] p-6 sm:p-8 border border-[#d4af37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(212,175,55,0.12)] backdrop-blur-xl overflow-hidden text-center">
        <GoldArtDecoCorners borderColor="#d4af37" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Header */}
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#edd58a]/80 font-cinzel font-medium mb-1">
            COUNTING DOWN TO
          </p>

          <h3 className="font-script text-4xl sm:text-5xl text-[#edd58a] drop-shadow mb-6">
            Our Special Day
          </h3>

          {/* 2x2 Grid of Luxury Tiles */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-6">
            {timeBlocks.map((block, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#08221b]/90 border border-[#d4af37]/40 shadow-[0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-md"
              >
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#edd58a] tracking-tight">
                  {String(block.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.2em] font-semibold text-[#edd58a]/90 mt-1 uppercase">
                  {block.labelEn}
                </span>
                <span className="font-amharic text-[11px] text-[#edd58a]/70">
                  {block.labelAm}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Romantic Text */}
          <p className="font-serif italic text-xs sm:text-sm text-[#edd58a]/85 mb-6">
            Until we become one in love
          </p>

          {/* Bottom Action */}
          <div className="w-full pt-2">
            <button
              onClick={onCalendarClick}
              className="group inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#edd58a]/80 hover:text-amber-200 transition-colors"
            >
              <span>MARK YOUR CALENDAR</span>
              <span className="text-[#d4af37] group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
