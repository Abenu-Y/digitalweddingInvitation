'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GoldArtDecoCorners } from '../common/GoldArtDecoCorners';

interface SaveTheDateCardProps {
  groomFullName?: string;
  brideFullName?: string;
  bibleVerseAmharic?: string;
  bibleVerseSource?: string;
  programTitleAmharic?: string;
  programTimeAmharic?: string;
  bgImageUrl?: string;
}

export const SaveTheDateCard: React.FC<SaveTheDateCardProps> = ({
  groomFullName = 'Hosni Mubarek',
  brideFullName = 'Jerusalem Alemayehu',
  bibleVerseAmharic = 'እኔ ግን በቸርነትህ ታመንሁ፥ ልቤም በመድኃኒትህ ደስ ይለዋል።',
  bibleVerseSource = 'መዝሙረ ዳዊት 13:5',
  programTitleAmharic = 'የቃልኪዳን እና የአምልኮ ጊዜ',
  programTimeAmharic = 'ከ9:00 እስከ 12:00',
  bgImageUrl = '/images/ethiopian_wedding_couple.jpg',
}) => {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Outer Card Frame */}
      <div className="relative min-h-[580px] rounded-2xl bg-[#061d16] p-6 sm:p-8 border border-[#d4af37]/35 shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col justify-between text-center">
        {/* Background photo blend with deep emerald overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImageUrl}
            alt="Fitsum & Bethelhem"
            className="w-full h-full object-cover object-center filter brightness-[0.4] saturate-[0.85] transform scale-105"
          />
          {/* Deep emerald vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051812] via-[#061e16]/85 to-[#051812]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#061e16]/60 to-[#051812]" />
        </div>

        {/* Ornaments */}
        <GoldArtDecoCorners borderColor="#d4af37" />

        {/* Card Content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full space-y-6">
          {/* Top: SAVE THE DATE */}
          <div className="pt-2">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#edd58a]/90 font-cinzel font-semibold mb-2">
              SAVE THE DATE
            </p>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent mx-auto" />
          </div>

          {/* Center: Couple Names */}
          <div className="my-auto py-2">
            <h1 className="font-script text-4xl sm:text-5xl text-[#edd58a] drop-shadow-md leading-tight">
              {groomFullName}
            </h1>
            <span className="font-script text-3xl sm:text-4xl text-[#edd58a]/85 block my-1">
              &
            </span>
            <h1 className="font-script text-4xl sm:text-5xl text-[#edd58a] drop-shadow-md leading-tight">
              {brideFullName}
            </h1>
          </div>

          {/* Thin divider */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent mx-auto" />

          {/* Bible Verse */}
          <div className="px-2">
            <p className="font-amharic text-xs sm:text-sm text-[#edd58a]/90 font-normal leading-relaxed drop-shadow">
              "{bibleVerseAmharic}" {bibleVerseSource}
            </p>
          </div>

          {/* Program Title & Time Box */}
          <div className="pb-3 w-full flex flex-col items-center">
            <p className="font-amharic text-base sm:text-lg text-[#edd58a] font-semibold mb-3 tracking-wide">
              {programTitleAmharic}
            </p>

            {/* Time Box */}
            <div className="px-6 py-2.5 rounded-lg border border-[#d4af37]/60 bg-[#061e16]/60 backdrop-blur-sm shadow-md">
              <span className="font-amharic text-xs sm:text-sm text-[#edd58a] font-medium tracking-wider">
                {programTimeAmharic}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
