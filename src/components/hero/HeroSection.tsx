'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { Calendar, Clock, Download, Heart, ChevronDown, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { weddingData, language, activeTheme } = useWedding();

  const [calendarOpen, setCalendarOpen] = useState(false);

  // Countdown timer state for Pic 1
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 35, hours: 21, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(weddingData.weddingDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingData.weddingDate]);

  // Calendar Links Generation
  const googleCalendarUrl = () => {
    const title = encodeURIComponent(`${weddingData.groomName} & ${weddingData.brideName}'s Royal Wedding`);
    const details = encodeURIComponent(`Wedding of ${weddingData.groomFullName} and ${weddingData.brideFullName}.\n${weddingData.globalInvitationMessage}`);
    const location = encodeURIComponent(weddingData.weddingLocationCity);
    const startIso = new Date(weddingData.weddingDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(new Date(weddingData.weddingDate).getTime() + 8 * 60 * 60 * 1000);
    const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  const downloadIcsFile = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Yene Serg Digital Wedding//EN
BEGIN:VEVENT
UID:${Date.now()}@yeneserg.com
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}
DTSTART:${new Date(weddingData.weddingDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}
SUMMARY:${weddingData.groomName} & ${weddingData.brideName}'s Wedding
DESCRIPTION:${weddingData.globalInvitationMessage}
LOCATION:${weddingData.weddingLocationCity}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${weddingData.groomName}-${weddingData.brideName}-wedding.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-12 sm:pt-16 pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background Hero Image with Deep Luxury Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.35] scale-105 transition-transform duration-10000"
          style={{ backgroundImage: `url(${weddingData.heroImageUrl})` }}
        />
        <div
          style={{
            background: `linear-gradient(to top, ${activeTheme.cardBgHex}fb 0%, ${activeTheme.cardBgHex}a6 50%, ${activeTheme.cardBgHex}80 100%)`,
          }}
          className="absolute inset-0"
        />
        <div
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, ${activeTheme.cardBgHex}88 65%, ${activeTheme.cardBgHex}f0 100%)`,
          }}
          className="absolute inset-0"
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Top Religious Blessing Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 px-5 py-2 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-6"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          <span className="text-xs sm:text-sm font-amharic text-amber-200">
            {weddingData.religiousQuoteAmharic}
          </span>
          <span className="text-stone-400 text-xs hidden md:inline">|</span>
          <span className="text-stone-300 text-xs font-serif hidden md:inline">
            {weddingData.quoteSource}
          </span>
        </motion.div>

        {/* Wedding Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs sm:text-sm uppercase tracking-[0.35em] text-amber-300 font-cinzel font-semibold mb-3"
        >
          {language === 'am' ? 'የክብር የሰርግ ጥሪ' : 'The Royal Wedding Celebration Of'}
        </motion.p>

        {/* Groom & Bride Royal Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="mb-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-bold tracking-tight text-gold-shimmer">
            {weddingData.groomName} <span className="font-script text-amber-300 text-5xl sm:text-7xl">&</span> {weddingData.brideName}
          </h1>
          <p className="text-xl sm:text-2xl font-amharic text-amber-100/90 font-semibold mt-2">
            {weddingData.groomNameAmharic} እና {weddingData.brideNameAmharic}
          </p>
        </motion.div>



        {/* Live Countdown Timer Cards (Pic 1: COUNTING DOWN TO FOREVER) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="w-full max-w-xl mb-10"
        >
          <div
            style={{ color: activeTheme.accentHex }}
            className="text-[11px] uppercase tracking-[0.25em] font-cinzel font-semibold mb-3 text-center"
          >
            {language === 'am' ? 'የቀረው ጊዜ (ቆጠራ)' : 'COUNTING DOWN TO FOREVER'}
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { value: timeLeft.days, labelEn: 'DAYS', labelAm: 'ቀናት' },
              { value: timeLeft.hours, labelEn: 'HOURS', labelAm: 'ሰዓታት' },
              { value: timeLeft.minutes, labelEn: 'MINUTES', labelAm: 'ደቂቃዎች' },
              { value: timeLeft.seconds, labelEn: 'SECONDS', labelAm: 'ሰከንዶች' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.cardBgHex,
                  borderColor: activeTheme.cardBorderHex,
                  boxShadow: `0 10px 25px rgba(0,0,0,0.5), 0 0 20px ${activeTheme.glowColor}`
                }}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border backdrop-blur-md group transition-all"
              >
                <span
                  style={{ color: activeTheme.accentHex }}
                  className="text-2xl sm:text-4xl font-cinzel font-bold"
                >
                  {String(item.value).padStart(2, '0')}
                </span>
                <span
                  style={{ color: activeTheme.secondaryTextHex }}
                  className="text-[10px] sm:text-xs uppercase tracking-wider mt-1 opacity-80"
                >
                  {language === 'en' ? item.labelEn : item.labelAm}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons: Add to Calendar & RSVP Quick Jump */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 relative"
        >
          {/* Calendar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              style={{
                background: activeTheme.primaryButtonGradient,
                color: activeTheme.primaryButtonTextColor,
                boxShadow: `0 0 25px ${activeTheme.glowColor}`
              }}
              className="flex items-center space-x-2 px-6 py-3 rounded-full font-semibold text-xs sm:text-sm transform hover:-translate-y-0.5 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>{language === 'am' ? 'ቀኑን በመቁጠሪያ መዝግብ' : 'Save To Calendar'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${calendarOpen ? 'rotate-180' : ''}`} />
            </button>

            {calendarOpen && (
              <div
                style={{
                  backgroundColor: activeTheme.cardBgHex,
                  borderColor: activeTheme.cardBorderHex,
                  boxShadow: `0 15px 40px rgba(0,0,0,0.8), 0 0 20px ${activeTheme.glowColor}`
                }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 border rounded-xl p-2 z-30 animate-in fade-in zoom-in-95 duration-200"
              >
                <a
                  href={googleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-stone-200 hover:bg-amber-500/20 hover:text-amber-200 flex items-center justify-between"
                  onClick={() => setCalendarOpen(false)}
                >
                  <span>Google Calendar</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </a>
                <button
                  onClick={() => {
                    downloadIcsFile();
                    setCalendarOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-stone-200 hover:bg-amber-500/20 hover:text-amber-200 flex items-center justify-between"
                >
                  <span>Apple iCal / Outlook (.ics)</span>
                  <Download className="w-3 h-3 text-amber-400" />
                </button>
              </div>
            )}
          </div>

          <a
            href="#rsvp"
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-stone-900/80 border border-amber-500/40 text-amber-200 font-semibold text-xs sm:text-sm hover:bg-amber-500/10 hover:border-amber-400 transition-all"
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>{language === 'am' ? 'የመገኘት ማረጋገጫ (RSVP)' : 'RSVP Now'}</span>
          </a>
        </motion.div>

        {/* Scroll down pulse indicator */}
        <div className="mt-14 animate-bounce">
          <a href="#invitation" className="text-amber-400/60 hover:text-amber-400 transition-colors">
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
};
