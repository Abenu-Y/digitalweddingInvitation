'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GoldArtDecoCorners } from '../common/GoldArtDecoCorners';
import { Heart } from 'lucide-react';

interface CoupleStoryCardProps {
  groomName?: string;
  brideName?: string;
  photoUrl?: string;
  subtitle?: string;
  messageEn?: string;
  messageAm?: string;
}

export const CoupleStoryCard: React.FC<CoupleStoryCardProps> = ({
  groomName = 'Hosni',
  brideName = 'Jerusalem',
  photoUrl = '/images/ethiopian_couple_holding_hands.jpg',
  subtitle = 'With Love & Warm Regards',
  messageEn = 'We would be honored to have you join us on this beautiful occasion and share in our happiness. Your presence and blessings will mean a lot to us. With love and warm regards,',
  messageAm = 'በዚህ ውብ እና የተቀደሰ ቀን አብረውን በመሆን ደስታችንን እንድትጋሩ በታላቅ ክብር እንጋብዝዎታለን። መገኘትዎ እና ምርቃትዎ ለእኛ ትልቅ ዋጋ አለው። በፍቅር እና በአክብሮት፣',
}) => {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0a271f] via-[#09221b] to-[#061914] p-5 sm:p-7 border border-[#d4af37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(212,175,55,0.12)] backdrop-blur-xl overflow-hidden text-center">
        <GoldArtDecoCorners borderColor="#d4af37" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Framed Couple Photo */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#d4af37]/50 shadow-2xl mb-6 group">
            {/* Inner gold frame line */}
            <div className="absolute inset-1.5 border border-[#d4af37]/30 rounded-lg pointer-events-none z-10" />
            
            <img
              src={photoUrl}
              alt={`${groomName} & ${brideName}`}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061914]/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Names in Calligraphy Script */}
          <h3 className="font-script text-4xl sm:text-5xl text-[#edd58a] drop-shadow leading-tight mb-1">
            {groomName} & {brideName}
          </h3>

          {/* Subtitle */}
          <p className="font-serif italic text-xs sm:text-sm text-[#edd58a]/80 tracking-widest uppercase mb-5">
            {subtitle}
          </p>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent mx-auto mb-5" />

          {/* Warm Invitation Message */}
          <div className="space-y-4 px-1">
            <p className="font-serif text-xs sm:text-sm text-[#edd58a]/90 leading-relaxed text-center font-normal">
              "{messageEn}"
            </p>

            <p className="font-amharic text-xs sm:text-sm text-[#edd58a]/80 leading-relaxed text-center font-normal">
              "{messageAm}"
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-2 text-[#edd58a]/60">
            <div className="w-6 h-[1px] bg-[#d4af37]/40" />
            <Heart className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]/40" />
            <div className="w-6 h-[1px] bg-[#d4af37]/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
