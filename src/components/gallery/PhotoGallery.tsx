'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const PhotoGallery: React.FC = () => {
  const { weddingData, language } = useWedding();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'prewedding' | 'cultural' | 'ceremony'>('all');

  const filteredPhotos = filter === 'all'
    ? weddingData.gallery
    : weddingData.gallery.filter((p) => p.category === filter);

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 relative bg-black/30">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-3">
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-cinzel">
              {language === 'am' ? 'የፎቶ ማስታወሻ' : 'Visual Gallery'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-shimmer">
            {language === 'am' ? 'የቅድመ-ሰርግ ፎቶዎች' : 'Pre-Wedding Moments'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-lg mx-auto">
            {language === 'am'
              ? 'በጋራ ያሳለፍናቸው የማይረሱ አስደሳች ጊዜያት በምስል'
              : 'Glimpses of our love, journey, and joyful memories'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'all', labelEn: 'All Photos', labelAm: 'ሁሉም ፎቶዎች' },
            { id: 'prewedding', labelEn: 'Pre-Wedding', labelAm: 'የቅድመ-ሰርግ' },
            { id: 'cultural', labelEn: 'Habesha Traditional', labelAm: 'ባህላዊ' },
            { id: 'ceremony', labelEn: 'Ceremony', labelAm: 'ሥነ-ሥርዓት' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                filter === tab.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'bg-stone-900/80 border border-white/10 text-stone-300 hover:text-amber-200 hover:border-amber-500/40'
              }`}
            >
              {language === 'en' ? tab.labelEn : tab.labelAm}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedPhotoIndex(idx)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl border border-amber-500/25 bg-[#121622] aspect-[4/3] shadow-lg hover:border-amber-400 transition-all"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 filter brightness-95"
                style={{ backgroundImage: `url(${photo.url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <div>
                  <p className="text-xs text-amber-200 font-medium">{photo.caption}</p>
                  <span className="text-[10px] text-amber-400/80 uppercase tracking-wider flex items-center gap-1 mt-1">
                    <Sparkles className="w-2.5 h-2.5" /> Click to view full image
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
              onClick={() => setSelectedPhotoIndex(null)}
            >
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 sm:left-8 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-amber-500 hover:text-black transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 sm:right-8 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-amber-500 hover:text-black transition-all z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div
                className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={filteredPhotos[selectedPhotoIndex].url}
                  alt={filteredPhotos[selectedPhotoIndex].caption}
                  className="max-w-full max-h-[75vh] object-contain rounded-xl border border-amber-500/30 shadow-2xl"
                />
                <p className="text-center text-sm text-amber-200 mt-4 font-cinzel">
                  {filteredPhotos[selectedPhotoIndex].caption}
                </p>
                <span className="text-xs text-stone-400 mt-1">
                  {selectedPhotoIndex + 1} / {filteredPhotos.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
