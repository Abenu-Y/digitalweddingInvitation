'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { Shirt, Sparkles, Check } from 'lucide-react';

export const DressCodeSection: React.FC = () => {
  const { weddingData, language } = useWedding();
  const { dressCode } = weddingData;

  return (
    <section id="dresscode" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-3">
            <Shirt className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-cinzel">
              {language === 'am' ? 'የአለባበስ ሥርዓት' : 'Attire & Palette'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-shimmer">
            {dressCode.title}
          </h2>
          <p className="text-sm font-amharic text-amber-300 font-medium mt-1">
            {dressCode.titleAmharic}
          </p>
          <p className="text-xs sm:text-sm text-stone-300/80 mt-3 max-w-xl mx-auto leading-relaxed">
            {dressCode.description}
          </p>
        </div>

        {/* Color Palette Swatches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#131724]/90 border border-amber-500/25 shadow-2xl backdrop-blur-md mb-8"
        >
          <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold text-center mb-6">
            {language === 'am' ? 'የተመረጡ የክብር ቀለማት' : 'Suggested Wedding Color Palette'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {dressCode.colors.map((color, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 rounded-2xl bg-black/30 border border-white/5 group hover:border-amber-400/40 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-full border-2 border-white/20 shadow-lg mb-2.5 transition-transform group-hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: color.hex }}
                >
                  <Sparkles className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                </div>
                <span className="text-xs font-medium text-stone-200 text-center">
                  {color.name}
                </span>
                <span className="text-[10px] text-stone-400 uppercase mt-0.5 font-mono">
                  {color.hex}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Guidelines List */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
          <h4 className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'am' ? 'ጠቃሚ ማሳሰቢያዎች' : 'Important Dress Guidelines'}
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
            {dressCode.guidelines.map((guide, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{guide}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
