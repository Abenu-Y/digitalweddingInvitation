'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Sparkles, ChevronDown, Check } from 'lucide-react';
import { GoldArtDecoCorners } from '../common/GoldArtDecoCorners';

interface EthiopianCalendarCardProps {
  monthName?: string;
  year?: string;
  selectedDay?: number;
  weekdayText?: string;
  timeRangeText?: string;
  quoteText?: string;
  weddingDateIso?: string;
}

export const EthiopianCalendarCard: React.FC<EthiopianCalendarCardProps> = ({
  monthName = 'ህዳር',
  year = '2019',
  selectedDay = 6,
  weekdayText = 'እሑድ፣ ህዳር 6፣ 2019',
  timeRangeText = 'ከ9:00 እስከ 12:00',
  quoteText = "We can't wait to celebrate with you!",
  weddingDateIso = '2026-11-15T15:00:00',
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Amharic days of week abbreviations: ሰኞ, ማክሰኞ, ረቡዕ, ሐሙስ, አርብ, ቅዳሜ, እሁድ
  const weekDays = ['ሰ', 'ማ', 'ረ', 'ሐ', 'አ', 'ቅ', 'እ'];

  // Hidar 2019 calendar starts on Tuesday (ማክሰኞ), which is index 1 in a Monday-first week:
  // Offset of 1 empty cell, then 1 through 30. Day 6 falls on Sunday (እሑድ).
  const offset = 1;
  const daysInMonth = 30;

  const googleCalendarUrl = () => {
    const title = encodeURIComponent("Hosni & Jerusalem's Wedding (የሆስኒ እና እየሩሳሌም ሰርግ)");
    const details = encodeURIComponent(
      `እሑድ፣ ህዳር 6፣ 2019 ዓ.ም (November 15, 2026)\nቦታ: ልደታ መካነየሱስ (ከዲአፍሪክ ሆቴል ወረድ ብሎ 5ኛ ፖሊስ ጣቢያ)\nየቃልኪዳን እና የአምልኮ ጊዜ: ከ9:00 እስከ 12:00\nWe would be honored to have you join us!`
    );
    const location = encodeURIComponent('ልደታ መካነየሱስ, Addis Ababa, Ethiopia');
    const startIso = new Date(weddingDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(new Date(weddingDateIso).getTime() + 6 * 60 * 60 * 1000);
    const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  const downloadIcsFile = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Yene Serg Digital Wedding//EN
BEGIN:VEVENT
UID:${Date.now()}@yeneserg.com
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, '')}
DTSTART:${new Date(weddingDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '')}
SUMMARY:Hosni & Jerusalem's Wedding
DESCRIPTION:እሑድ ህዳር 6 2019 - የሆስኒ እና እየሩሳሌም የሰርግ ጥሪ
LOCATION:ልደታ መካነየሱስ, Addis Ababa, Ethiopia
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Fitsum-Bethelhem-Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Outer Card Frame with Emerald Background & Art Deco Gold Lines */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0a271f] via-[#09221b] to-[#061914] p-6 sm:p-8 border border-[#d4af37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(212,175,55,0.12)] backdrop-blur-xl overflow-hidden">
        <GoldArtDecoCorners borderColor="#d4af37" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Calendar Month & Year */}
          <div className="text-center mb-6">
            <h3 className="font-amharic text-3xl sm:text-4xl font-bold tracking-wider text-[#edd58a] drop-shadow-md">
              {monthName} <span className="font-serif font-light text-2xl sm:text-3xl text-[#edd58a]/90">{year}</span>
            </h3>
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent mx-auto mt-3" />
          </div>

          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full text-center mb-4">
            {weekDays.map((d, i) => (
              <span
                key={i}
                className="font-amharic text-sm sm:text-base font-semibold text-[#edd58a]/80 py-1"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full text-center mb-6">
            {/* Empty slots before first day */}
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8 sm:w-9 sm:h-9" />
            ))}

            {/* Days 1 to 30 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDay;

              return (
                <div
                  key={day}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 mx-auto"
                >
                  {isSelected ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#edd58a] bg-[#d4af37]/25 flex items-center justify-center shadow-[0_0_15px_rgba(237,213,138,0.4)]"
                    >
                      <span className="font-serif text-sm sm:text-base font-bold text-[#fff3cb]">
                        {day}
                      </span>
                    </motion.div>
                  ) : (
                    <span className="font-serif text-xs sm:text-sm text-[#edd58a]/70 hover:text-amber-200 transition-colors">
                      {day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent my-4" />

          {/* Date & Time Highlights */}
          <div className="text-center space-y-1 mb-5">
            <p className="font-amharic text-lg sm:text-xl font-semibold text-[#edd58a] tracking-wide">
              {weekdayText}
            </p>
            <p className="font-amharic text-sm sm:text-base text-[#edd58a]/85 font-medium">
              {timeRangeText}
            </p>
          </div>

          {/* Romantic Note */}
          <p className="font-serif italic text-xs sm:text-sm text-[#edd58a]/80 text-center tracking-wide mb-6">
            "{quoteText}"
          </p>

          {/* Add to Calendar Dropdown */}
          <div className="relative w-full max-w-xs">
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37]/35 to-[#d4af37]/20 border border-[#d4af37]/60 text-[#fef3c7] font-medium text-xs sm:text-sm hover:border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all"
            >
              <Calendar className="w-4 h-4 text-[#edd58a]" />
              <span>ቀኑን በመቁጠሪያ መዝግብ (Save Date)</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#edd58a] transition-transform ${
                  calendarOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {calendarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#08221b] border border-[#d4af37]/50 rounded-xl shadow-2xl p-2 z-30 backdrop-blur-xl"
              >
                <a
                  href={googleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCalendarOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#edd58a] hover:bg-[#d4af37]/20 flex items-center justify-between transition-colors"
                >
                  <span>Google Calendar</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#edd58a]" />
                </a>
                <button
                  onClick={() => {
                    downloadIcsFile();
                    setCalendarOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#edd58a] hover:bg-[#d4af37]/20 flex items-center justify-between transition-colors"
                >
                  <span>Apple iCal / Outlook (.ics)</span>
                  <Download className="w-3.5 h-3.5 text-[#edd58a]" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
