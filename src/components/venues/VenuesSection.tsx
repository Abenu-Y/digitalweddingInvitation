'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { MapPin, Navigation, Clock, ExternalLink } from 'lucide-react';

export const VenuesSection: React.FC = () => {
  const { weddingData, language, activeTheme } = useWedding();

  return (
    <section id="venues" className="py-20 px-4 sm:px-6 relative bg-black/40">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div
            style={{
              borderColor: activeTheme.cardBorderHex,
              backgroundColor: `${activeTheme.cardBgHex}cc`,
            }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border backdrop-blur-md mb-3"
          >
            <MapPin className="w-3.5 h-3.5" style={{ color: activeTheme.accentHex }} />
            <span
              style={{ color: activeTheme.accentHex }}
              className="text-xs uppercase tracking-widest font-cinzel font-semibold"
            >
              {language === 'am' ? 'የሥነ-ሥርዓት ቦታዎች' : 'Locations & Venues'}
            </span>
          </div>
          <h2
            style={{ color: activeTheme.secondaryTextHex }}
            className="text-3xl sm:text-4xl font-cinzel font-bold"
          >
            {language === 'am' ? 'የሰርጉ አድራሻዎችና ካርታ' : 'Wedding Venues'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-lg mx-auto opacity-80">
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
              style={{
                backgroundColor: activeTheme.cardBgHex,
                borderColor: activeTheme.cardBorderHex,
                boxShadow: `0 20px 45px rgba(0,0,0,0.7), 0 0 20px ${activeTheme.glowColor}`,
              }}
              className="rounded-2xl overflow-hidden border shadow-2xl flex flex-col group transition-all"
            >
              {/* Venue Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                  style={{ backgroundImage: `url(${venue.imageUrl})` }}
                />
                <div
                  style={{
                    background: `linear-gradient(to top, ${activeTheme.cardBgHex} 0%, transparent 60%, rgba(0,0,0,0.4) 100%)`,
                  }}
                  className="absolute inset-0"
                />
                
                {/* Event Tag */}
                <div
                  style={{
                    backgroundColor: `${activeTheme.cardBgHex}ee`,
                    borderColor: activeTheme.cardBorderHex,
                    color: activeTheme.accentHex,
                  }}
                  className="absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-md border text-[11px] font-semibold"
                >
                  {venue.tag}
                </div>
              </div>

              {/* Venue Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    style={{ color: activeTheme.secondaryTextHex }}
                    className="text-xl font-cinzel font-bold transition-colors"
                  >
                    {venue.name}
                  </h3>
                  <p
                    style={{ color: activeTheme.accentHex }}
                    className="text-sm font-amharic font-medium mt-0.5"
                  >
                    {venue.nameAmharic}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-stone-300">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: activeTheme.accentHex }} />
                      <span>{venue.time}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: activeTheme.accentHex }} />
                      <span className="leading-relaxed text-stone-300 opacity-90">{venue.address}</span>
                    </div>
                  </div>
                </div>

                {/* Google Maps Action Button */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href={venue.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: activeTheme.primaryButtonGradient,
                      color: activeTheme.primaryButtonTextColor,
                      boxShadow: `0 0 15px ${activeTheme.glowColor}`,
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-md group/btn"
                  >
                    <Navigation className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    <span>{language === 'am' ? 'በጉግል ካርታ ይክፈቱ' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
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
            style={{
              backgroundColor: activeTheme.cardBgHex,
              borderColor: activeTheme.cardBorderHex,
              boxShadow: `0 20px 45px rgba(0,0,0,0.7), 0 0 20px ${activeTheme.glowColor}`,
            }}
            className="rounded-2xl overflow-hidden border shadow-2xl flex flex-col min-h-[420px] relative group transition-all"
          >
            <div
              style={{
                backgroundColor: `${activeTheme.cardBgHex}ee`,
                borderBottomColor: activeTheme.cardBorderHex,
              }}
              className="p-4 border-b flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" style={{ color: activeTheme.accentHex }} />
                <span
                  style={{ color: activeTheme.secondaryTextHex }}
                  className="text-xs font-cinzel font-bold"
                >
                  Google Map • ልደታ መካነየሱስ ቤተክርስቲያን
                </span>
              </div>
              <a
                href="https://maps.app.goo.gl/u7m4CqG7XgL5E12E8"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: activeTheme.accentHex }}
                className="text-xs hover:underline flex items-center space-x-1"
              >
                <span>Full Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 w-full relative min-h-[350px]">
              <iframe
                title="Google Maps Location - Lideta Mekane Yesus Addis Ababa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.548810967399!2d38.7423!3d9.0135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8599f6b47c0b%3A0xb3a82dfdf8b42fbb!2sLideta%20Mekane%20Yesus%20Church!5e0!3m2!1sen!2set!4v1710000000000!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '350px', filter: 'contrast(1.05) saturate(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
