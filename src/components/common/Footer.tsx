'use client';

import React from 'react';
import Link from 'next/link';
import { useWedding } from '@/context/WeddingContext';
import { Settings, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { weddingData, language, activeTheme } = useWedding();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: activeTheme.cardBgHex,
        borderTopColor: activeTheme.cardBorderHex,
      }}
      className="relative border-t pt-16 pb-12 px-4 sm:px-6 overflow-hidden transition-colors duration-500"
    >
      {/* Decorative Accent Border Line */}
      <div
        style={{
          background: `linear-gradient(to right, transparent, ${activeTheme.accentHex}, transparent)`,
        }}
        className="absolute top-0 left-0 right-0 h-[2px] opacity-75"
      />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Monogram */}
        <div
          style={{
            borderColor: activeTheme.cardBorderHex,
            backgroundColor: `${activeTheme.cardBgHex}cc`,
            boxShadow: `0 0 25px ${activeTheme.glowColor}`,
          }}
          className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 transition-all"
        >
          <span
            style={{ color: activeTheme.accentHex }}
            className="font-cinzel text-xl font-bold"
          >
            {weddingData.groomName[0]} & {weddingData.brideName[0]}
          </span>
        </div>

        <h3
          style={{ color: activeTheme.secondaryTextHex }}
          className="text-2xl font-cinzel font-bold"
        >
          {weddingData.groomFullName} & {weddingData.brideFullName}
        </h3>
        <p
          style={{ color: activeTheme.accentHex }}
          className="text-sm font-amharic font-medium mt-1 opacity-90"
        >
          {weddingData.groomFullNameAmharic} እና {weddingData.brideFullNameAmharic}
        </p>

        <p className="text-xs text-stone-300 mt-4 max-w-md opacity-80 leading-relaxed">
          {language === 'am'
            ? 'በሰርጋችን ቀን ከእኛ ጋር ስለሆናችሁና ፍቅራችሁን ስላጋራችሁን ከልብ እናመሰግናለን!'
            : 'Thank you for your love, heartfelt prayers, and joyful support as we embark on this sacred journey together.'}
        </p>

        <div className="mt-8 flex items-center space-x-6 text-xs text-stone-400">
          <button
            onClick={scrollToTop}
            style={{ color: activeTheme.accentHex }}
            className="flex items-center space-x-1.5 hover:opacity-80 transition-opacity"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to Top</span>
          </button>
          <span className="opacity-40">•</span>
          <Link
            href="/admin"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-white/5 transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
