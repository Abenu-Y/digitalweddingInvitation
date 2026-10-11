'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { MapPin, Navigation, Clock, ExternalLink } from 'lucide-react';

export const VenuesSection: React.FC = () => {
  const { weddingData, language } = useWedding();

  return (
    <section id="venues" className="py-20 px-4 sm:px-6 relative bg-black/40">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-cinzel">
              {language === 'am' ? 'የሥነ-ሥርዓት ቦታዎች' : 'Locations & Venues'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-shimmer">
            {language === 'am' ? 'የሰርጉ አድራሻዎችና ካርታ' : 'Wedding Venues'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-lg mx-auto">
            {language === 'am'
              ? 'ለሥርዓተ ተክሊልና ለግብዣው የተዘጋጁ ውብ አዳራሾችና ቀጥታ የጉግል ካርታ መመሪያ'
              : 'Direct navigation and details for our holy matrimony and reception venues'}
          </p>
        </div>

        {/* Venues & Live Google Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {weddingData.venues.map((venue, idx) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="rounded-2xl overflow-hidden bg-[#131722]/90 border border-amber-500/25 shadow-2xl flex flex-col group hover:border-amber-400/60 transition-all"
            >
              {/* Venue Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                  style={{ backgroundImage: `url(${venue.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-transparent to-black/30" />
                
                {/* Event Tag */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-[11px] font-semibold text-amber-300">
                  {venue.tag}
                </div>
              </div>

              {/* Venue Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-cinzel font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                    {venue.name}
                  </h3>
                  <p className="text-sm font-amharic text-amber-300 font-medium mt-0.5">
                    {venue.nameAmharic}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-stone-300">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{venue.time}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed text-stone-400">{venue.address}</span>
                    </div>
                  </div>
                </div>

                {/* Google Maps Action Button */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href={venue.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:bg-amber-500/20 hover:border-amber-400 transition-all shadow-md group/btn"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-400 group-hover/btn:translate-x-0.5 transition-transform" />
                    <span>{language === 'am' ? 'በጉግል ካርታ ይክፈቱ' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Embedded Google Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden bg-[#131722]/90 border border-amber-500/25 shadow-2xl flex flex-col min-h-[420px] relative group hover:border-amber-400/60 transition-all"
          >
            <div className="p-4 bg-[#0e121a] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-cinzel font-bold text-amber-200">
                  Google Map • ልደታ መካነየሱስ ቤተክርስቲያን
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Live Directions
              </span>
            </div>

            <div className="relative flex-1 w-full min-h-[350px]">
              <iframe
                title="Lideta Mekane Yesus Church Google Map"
                src="https://maps.google.com/maps?q=Lideta+Mekane+Yesus+Church+Addis+Ababa&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[350px] border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
