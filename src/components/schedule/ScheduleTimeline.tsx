'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { Clock, MapPin, CalendarDays, Church, UtensilsCrossed, Camera, Music, Car } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Church,
  UtensilsCrossed,
  Camera,
  Music,
  Car,
  Clock,
};

export const ScheduleTimeline: React.FC = () => {
  const { weddingData, language, activeTheme, currentGuest } = useWedding();

  return (
    <section id="schedule" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-3">
            <CalendarDays className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-cinzel">
              {language === 'am' ? 'የዕለቱ መርሐግብር' : 'Wedding Itinerary'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-shimmer">
            {language === 'am' ? 'የሥነ-ሥርዓት ቅደም ተከተል' : 'Program of the Day'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-lg mx-auto font-amharic">
            {language === 'am'
              ? 'የሰርጋችን ቀን በደስታና በሥርዓት እንዲከናወን የተዘጋጀ የሰዓት ሰሌዳ'
              : 'Detailed timeline of our holy matrimony and royal celebration'}
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative">
          {/* Central Golden Vertical Spine */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-500 via-amber-300 to-amber-700 -translate-x-1/2 opacity-40" />

          <div className="space-y-8 sm:space-y-12">
            {weddingData.schedule.map((item, index) => {
              const IconComponent = iconMap[item.icon] || Clock;
              const isEven = index % 2 === 0;
              const isInvited = !currentGuest || !currentGuest.invitedEvents || currentGuest.invitedEvents.includes(item.eventType);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card */}
                  <div className={`w-full sm:w-[calc(50%-2.5rem)] pl-12 sm:pl-0 ${isEven ? 'sm:text-right' : 'sm:text-left'}`}>
                    <div
                      className={`p-5 sm:p-6 rounded-2xl bg-[#141824]/90 border border-amber-500/25 shadow-xl backdrop-blur-md hover:border-amber-400/50 transition-all ${
                        !isInvited ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Time Badge */}
                      <div
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2.5 ${
                          isEven ? 'sm:flex-row-reverse sm:space-x-reverse' : ''
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.time}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-cinzel font-bold text-amber-100">
                        {item.title}
                      </h3>
                      <p className="text-sm font-amharic text-amber-300 font-medium mt-0.5">
                        {item.titleAmharic}
                      </p>

                      <p className="text-xs text-stone-300/80 mt-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div
                        className={`flex items-center space-x-1.5 text-xs text-stone-400 mt-3 pt-3 border-t border-white/5 ${
                          isEven ? 'sm:justify-end' : 'sm:justify-start'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Icon Node in Center Spine */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-4 w-9 h-9 rounded-full bg-[#1c2233] border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.4)] z-10">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
