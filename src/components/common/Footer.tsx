'use client';

import React from 'react';
import Link from 'next/link';
import { useWedding } from '@/context/WeddingContext';
import { Heart, Sparkles, Settings, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { weddingData, language } = useWedding();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#07090e] border-t border-[#d4af37]/20 pt-16 pb-12 px-4 sm:px-6 overflow-hidden">
      {/* Decorative Gold Border Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 opacity-70" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Monogram */}
        <div className="w-16 h-16 rounded-full border-2 border-[#d4af37]/60 flex items-center justify-center bg-black/60 shadow-[0_0_25px_rgba(212,175,55,0.3)] mb-4">
          <span className="font-cinzel text-xl font-bold text-gold-shimmer">
            {weddingData.groomName[0]} & {weddingData.brideName[0]}
          </span>
        </div>

        <h3 className="text-2xl font-cinzel font-bold text-amber-100">
          {weddingData.groomFullName} & {weddingData.brideFullName}
        </h3>
        <p className="text-sm font-amharic text-amber-300 mt-1">
          {weddingData.groomFullNameAmharic} እና {weddingData.brideFullNameAmharic}
        </p>

        <p className="text-xs text-stone-400 mt-4 max-w-md">
          {language === 'am'
            ? 'በሰርጋችን ቀን ከእኛ ጋር ስለሆናችሁና ፍቅራችሁን ስላጋራችሁን ከልብ እናመሰግናለን!'
            : 'Thank you for your love, heartfelt prayers, and joyful support as we embark on this sacred journey together.'}
        </p>

        <div className="my-8 flex items-center space-x-6 text-xs text-stone-400">
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 hover:text-amber-300 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to Top</span>
          </button>
          <span>•</span>
          <Link
            href="/admin"
            className="p-1.5 rounded-lg text-stone-500 hover:text-amber-300 hover:bg-white/5 transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-6 border-t border-white/5 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© 2026 {weddingData.groomName} & {weddingData.brideName} Royal Wedding Celebration. All rights reserved.</p>
          <p className="flex items-center gap-1 text-amber-400/70">
            <span>Powered by</span>
            <span className="font-cinzel font-semibold text-amber-300">Yene Serg Digital Invitations</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
