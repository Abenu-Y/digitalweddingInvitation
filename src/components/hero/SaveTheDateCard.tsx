'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GoldArtDecoCorners } from '../common/GoldArtDecoCorners';
import { useWedding } from '@/context/WeddingContext';

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
  const { activeTheme } = useWedding();

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Outer Card Frame with Dynamic Theme Styling */}
      <div
        style={{
          backgroundColor: activeTheme.cardBgHex,
          borderColor: activeTheme.cardBorderHex,
          boxShadow: `0 20px 50px rgba(0,0,0,0.65), 0 0 30px ${activeTheme.glowColor}`,
        }}
        className="relative min-h-[580px] rounded-2xl p-6 sm:p-8 border overflow-hidden flex flex-col justify-between text-center transition-all duration-500"
      >
        {/* Background photo blend with theme overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImageUrl}
            alt="Hosni & Jerusalem"
            className="w-full h-full object-cover object-center filter brightness-[0.35] saturate-[0.85] transform scale-105"
          />
          {/* Dynamic Theme vignette gradients */}
          <div
            style={{
              background: `linear-gradient(to top, ${activeTheme.cardBgHex}fa 0%, ${activeTheme.cardBgHex}bb 50%, ${activeTheme.cardBgHex}e6 100%)`,
            }}
            className="absolute inset-0"
          />
        </div>

        {/* Ornaments in active theme accent color */}
        <GoldArtDecoCorners borderColor={activeTheme.highlightHex} />

        {/* Card Content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full space-y-6">
          {/* Top: SAVE THE DATE */}
          <div className="pt-2">
            <p
              style={{ color: activeTheme.accentHex }}
              className="text-[11px] sm:text-xs uppercase tracking-[0.35em] font-cinzel font-semibold mb-2"
            >
              SAVE THE DATE
            </p>
            <div
              style={{
                background: `linear-gradient(to right, transparent, ${activeTheme.accentHex}, transparent)`,
              }}
              className="w-16 h-[1px] mx-auto"
            />
          </div>

          {/* Center: Couple Names */}
          <div className="my-auto py-2">
            <h1
              style={{ color: activeTheme.accentHex }}
              className="font-script text-4xl sm:text-5xl drop-shadow-md leading-tight"
            >
              {groomFullName}
            </h1>
            <span
              style={{ color: activeTheme.secondaryTextHex }}
              className="font-script text-3xl sm:text-4xl block my-1 opacity-90"
            >
              &
            </span>
            <h1
              style={{ color: activeTheme.accentHex }}
              className="font-script text-4xl sm:text-5xl drop-shadow-md leading-tight"
            >
              {brideFullName}
            </h1>
          </div>

          {/* Thin divider */}
          <div
            style={{
              background: `linear-gradient(to right, transparent, ${activeTheme.accentHex}88, transparent)`,
            }}
            className="w-24 h-[1px] mx-auto"
          />

          {/* Bible Verse */}
          <div className="px-2">
            <p
              style={{ color: activeTheme.secondaryTextHex }}
              className="font-amharic text-xs sm:text-sm font-normal leading-relaxed drop-shadow opacity-95"
            >
              "{bibleVerseAmharic}" {bibleVerseSource}
            </p>
          </div>

          {/* Program Title & Time Box */}
          <div className="pb-3 w-full flex flex-col items-center">
            <p
              style={{ color: activeTheme.accentHex }}
              className="font-amharic text-base sm:text-lg font-semibold mb-3 tracking-wide"
            >
              {programTitleAmharic}
            </p>

            {/* Time Box */}
            <div
              style={{
                borderColor: activeTheme.cardBorderHex,
                backgroundColor: `${activeTheme.cardBgHex}cc`,
              }}
              className="px-6 py-2.5 rounded-lg border backdrop-blur-sm shadow-md"
            >
              <span
                style={{ color: activeTheme.secondaryTextHex }}
                className="font-amharic text-xs sm:text-sm font-medium tracking-wider"
              >
                {programTimeAmharic}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
