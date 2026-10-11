'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { Heart, Sparkles } from 'lucide-react';

export const LoveStorySection: React.FC = () => {
  const { weddingData, language } = useWedding();

  return (
    <section id="story" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-cinzel">
              {language === 'am' ? 'የፍቅራችን ጉዞ' : 'Our Love Story'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-shimmer">
            {language === 'am' ? 'የፍቅር ታሪካችን' : 'How It All Began'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-lg mx-auto font-amharic">
            «ፍቅር ይታገሣል፥ ቸርነትንም ያደርጋል» — 1 ቆሮ 13:4
          </p>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {weddingData.loveStory.map((milestone, idx) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6 rounded-2xl bg-[#121622]/90 border border-amber-500/25 shadow-xl backdrop-blur-md group hover:border-amber-400/50 transition-all"
            >
              {milestone.imageUrl && (
                <div className="relative w-full sm:w-36 h-40 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${milestone.imageUrl})` }}
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-xs font-bold text-amber-300 font-cinzel">
                    {milestone.year}
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-amber-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold tracking-wider uppercase font-cinzel">
                    Chapter {idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-cinzel font-bold text-amber-100">
                  {milestone.title}
                </h3>
                <p className="text-xs font-amharic text-amber-300 font-medium mt-0.5">
                  {milestone.titleAmharic}
                </p>
                <p className="text-xs text-stone-300/80 leading-relaxed mt-2.5">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
