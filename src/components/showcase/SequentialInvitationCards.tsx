'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Calendar, BookmarkCheck } from 'lucide-react';
import { SaveTheDateCard } from '../hero/SaveTheDateCard';
import { CoupleStoryCard } from '../invitation-card/CoupleStoryCard';
import { EthiopianCalendarCard } from '../calendar/EthiopianCalendarCard';
import { useWedding } from '@/context/WeddingContext';

export const SequentialInvitationCards: React.FC = () => {
  const { weddingData } = useWedding();

  const cards = [
    {
      id: 'save-the-date',
      number: '01',
      badgeEn: 'SAVE THE DATE',
      badgeAm: 'የክብር የቀጠሮ ቀን',
      icon: BookmarkCheck,
      component: (
        <SaveTheDateCard
          groomFullName={weddingData.groomFullName}
          brideFullName={weddingData.brideFullName}
          bibleVerseAmharic={weddingData.religiousQuoteAmharic}
          bibleVerseSource={weddingData.quoteSource}
          programTitleAmharic="የቃልኪዳን እና የአምልኮ ጊዜ"
          programTimeAmharic="ከ9:00 እስከ 12:00"
          bgImageUrl="/images/ethiopian_wedding_couple.jpg"
        />
      ),
    },
    {
      id: 'our-invitation',
      number: '02',
      badgeEn: 'OUR INVITATION',
      badgeAm: 'የሰርግ ጥሪ መልእክት',
      icon: Heart,
      component: (
        <CoupleStoryCard
          groomName={weddingData.groomName}
          brideName={weddingData.brideName}
          photoUrl="/images/ethiopian_couple_holding_hands.jpg"
          subtitle="With Love & Warm Regards"
          messageEn={weddingData.globalInvitationMessage}
          messageAm={weddingData.globalInvitationMessageAmharic}
        />
      ),
    },
    {
      id: 'ethiopian-calendar',
      number: '03',
      badgeEn: 'ETHIOPIAN CALENDAR',
      badgeAm: 'የኢትዮጵያ የቀን መቁጠሪያ',
      icon: Calendar,
      component: (
        <EthiopianCalendarCard
          monthName="ህዳር"
          year="2019"
          selectedDay={6}
          weekdayText="እሑድ፣ ህዳር 6፣ 2019"
          timeRangeText="ከ9:00 እስከ 12:00"
          quoteText="We can't wait to celebrate with you!"
          weddingDateIso={weddingData.weddingDate}
        />
      ),
    },
  ];

  return (
    <section id="invitation-sequence" className="relative py-12 sm:py-20 px-3 sm:px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0a3a2a]/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Main Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-black/40 backdrop-blur-md mb-3 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#edd58a] font-cinzel font-semibold">
              ዲጂታል የሰርግ መጥሪያ • DIGITAL INVITATION
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif text-[#fff3cb] font-bold">
            {weddingData.groomName} <span className="text-[#d4af37] font-script text-3xl sm:text-5xl">&amp;</span> {weddingData.brideName}
          </h2>
          <p className="font-amharic text-sm sm:text-base text-[#edd58a]/80 mt-1">
            የሰርግ ጥሪ ካርዶች እና የፕሮግራም ዝርዝር
          </p>
        </motion.div>

        {/* 3 Sequential Cards Stacked Vertically */}
        <div className="w-full space-y-16 sm:space-y-24">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="flex flex-col items-center w-full"
              >
                {/* Card Tag Pill */}
                <div className="flex items-center space-x-2 px-4 py-1 rounded-full bg-[#07241c] border border-[#d4af37]/35 text-[#edd58a] text-[11px] font-cinzel mb-4 shadow-md">
                  <Icon className="w-3 h-3 text-[#d4af37]" />
                  <span className="font-bold tracking-widest">{card.number}. {card.badgeEn}</span>
                  <span className="text-stone-500">•</span>
                  <span className="font-amharic">{card.badgeAm}</span>
                </div>

                {/* The Card Component */}
                <div className="w-full max-w-sm">
                  {card.component}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
