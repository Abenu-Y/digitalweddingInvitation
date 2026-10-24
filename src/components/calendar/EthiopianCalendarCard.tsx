'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Sparkles, ChevronDown, Check } from 'lucide-react';
import { GoldArtDecoCorners } from '../common/GoldArtDecoCorners';
import { useWedding } from '@/context/WeddingContext';

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
  const { activeTheme, weddingData } = useWedding();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Amharic days of week abbreviations: ሰኞ, ማክሰኞ, ረቡዕ, ሐሙስ, አርብ, ቅዳሜ, እሁድ
  const weekDays = ['ሰ', 'ማ', 'ረ', 'ሐ', 'አ', 'ቅ', 'እ'];

  // Hidar 2019 calendar starts on Tuesday (ማክሰኞ), which is index 1 in a Monday-first week:
  const offset = 1;
  const daysInMonth = 30;

  const googleCalendarUrl = () => {
    const title = encodeURIComponent(`${weddingData.groomName} & ${weddingData.brideName}'s Wedding (የ${weddingData.groomNameAmharic || 'ሆስኒ'} እና ${weddingData.brideNameAmharic || 'እየሩሳሌም'} ሰርግ)`);
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
SUMMARY:${weddingData.groomName} & ${weddingData.brideName}'s Wedding
DESCRIPTION:እሑድ ህዳር 6 2019 - የ${weddingData.groomNameAmharic || 'ሆስኒ'} እና ${weddingData.brideNameAmharic || 'እየሩሳሌም'} የሰርግ ጥሪ
LOCATION:ልደታ መካነየሱስ, Addis Ababa, Ethiopia
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${weddingData.groomName}-${weddingData.brideName}-Wedding.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Outer Card Frame with Dynamic Theme Styling */}
      <div
        style={{
          backgroundColor: activeTheme.cardBgHex,
          borderColor: activeTheme.cardBorderHex,
          boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 25px ${activeTheme.glowColor}`,
        }}
        className="relative rounded-2xl p-6 sm:p-8 border backdrop-blur-xl overflow-hidden transition-all duration-500"
      >
        <GoldArtDecoCorners borderColor={activeTheme.highlightHex} />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Calendar Month & Year */}
          <div className="text-center mb-6">
            <h3
              style={{ color: activeTheme.accentHex }}
              className="font-amharic text-3xl sm:text-4xl font-bold tracking-wider drop-shadow-md"
            >
              {monthName}{' '}
              <span
                style={{ color: activeTheme.secondaryTextHex }}
                className="font-serif font-light text-2xl sm:text-3xl opacity-90"
              >
                {year}
              </span>
            </h3>
            <div
              style={{
                background: `linear-gradient(to right, transparent, ${activeTheme.accentHex}, transparent)`,
              }}
              className="w-20 h-[1px] mx-auto mt-3"
            />
          </div>

          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full text-center mb-4">
            {weekDays.map((d, i) => (
              <span
                key={i}
                style={{ color: activeTheme.secondaryTextHex }}
                className="font-amharic text-sm sm:text-base font-semibold py-1 opacity-80"
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
                      style={{
                        backgroundColor: activeTheme.accentHex,
                        borderColor: activeTheme.highlightHex,
                        boxShadow: `0 0 16px ${activeTheme.glowColor}`,
                      }}
                      className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center"
                    >
                      <span
                        style={{ color: activeTheme.primaryButtonTextColor }}
                        className="font-serif text-sm sm:text-base font-bold"
                      >
                        {day}
                      </span>
                    </motion.div>
                  ) : (
                    <span
                      style={{ color: activeTheme.secondaryTextHex }}
                      className="font-serif text-xs sm:text-sm opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div
            style={{
              background: `linear-gradient(to right, transparent, ${activeTheme.cardBorderHex}, transparent)`,
            }}
            className="w-full h-[1px] my-4"
          />

          {/* Date & Time Highlights */}
          <div className="text-center space-y-1 mb-5">
            <p
              style={{ color: activeTheme.accentHex }}
              className="font-amharic text-lg sm:text-xl font-semibold tracking-wide"
            >
              {weekdayText}
            </p>
            <p
              style={{ color: activeTheme.secondaryTextHex }}
              className="font-amharic text-sm sm:text-base font-medium opacity-90"
            >
              {timeRangeText}
            </p>
          </div>

          {/* Romantic Note */}
          <p
            style={{ color: activeTheme.secondaryTextHex }}
            className="font-serif italic text-xs sm:text-sm text-center tracking-wide mb-6 opacity-80"
          >
            "{quoteText}"
          </p>

          {/* Add to Calendar Dropdown Button */}
          <div className="relative w-full max-w-xs">
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              style={{
                background: activeTheme.primaryButtonGradient,
                color: activeTheme.primaryButtonTextColor,
                boxShadow: `0 0 20px ${activeTheme.glowColor}`,
              }}
              className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>ቀኑን በመቁጠሪያ መዝግብ (Save Date)</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  calendarOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {calendarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: activeTheme.cardBgHex,
                  borderColor: activeTheme.cardBorderHex,
                }}
                className="absolute top-full left-0 right-0 mt-2 border rounded-xl shadow-2xl p-2 z-30 backdrop-blur-xl"
              >
                <a
                  href={googleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCalendarOpen(false)}
                  style={{ color: activeTheme.secondaryTextHex }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 flex items-center justify-between transition-colors"
                >
                  <span>Google Calendar</span>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: activeTheme.accentHex }} />
                </a>
                <button
                  onClick={() => {
                    downloadIcsFile();
                    setCalendarOpen(false);
                  }}
                  style={{ color: activeTheme.secondaryTextHex }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 flex items-center justify-between transition-colors"
                >
                  <span>Apple iCal / Outlook (.ics)</span>
                  <Download className="w-3.5 h-3.5" style={{ color: activeTheme.accentHex }} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
