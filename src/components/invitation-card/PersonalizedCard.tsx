'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { Sparkles, Crown, Users, MapPin, CheckCircle2, Share2, Copy, Heart, MessageSquareQuote } from 'lucide-react';

export const PersonalizedCard: React.FC = () => {
  const { weddingData, currentGuest, activeTheme, language } = useWedding();
  const [copied, setCopied] = useState(false);

  // Message selection logic (Requirement: Custom per guest OR Global for all)
  const isCustomMessage = currentGuest?.useCustomMessage && (currentGuest?.customMessage || currentGuest?.customMessageAmharic);
  
  const displayMessageEn = isCustomMessage 
    ? currentGuest?.customMessage 
    : weddingData.globalInvitationMessage;

  const displayMessageAm = isCustomMessage
    ? currentGuest?.customMessageAmharic || currentGuest?.customMessage
    : weddingData.globalInvitationMessageAmharic;

  const handleCopyLink = () => {
    const inviteUrl = currentGuest
      ? `${window.location.origin}/invite/${currentGuest.slug}`
      : window.location.href;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="invitation" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decorative Radial Lighting based on active guest theme */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ backgroundColor: activeTheme.sealColor }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-cinzel">
              {language === 'am' ? 'የክብር የግብዣ ካርድ' : 'Personalized Invitation'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-shimmer">
            {language === 'am' ? 'የሰርግ ጥሪ ካርድ' : 'Official Wedding Invitation'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {currentGuest
              ? `Tailored specially for ${currentGuest.name} (${activeTheme.name})`
              : `Official wedding invitation card (${activeTheme.name})`}
          </p>
        </div>

        {/* The Master Invitation Card Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`relative rounded-3xl p-6 sm:p-10 md:p-14 ${activeTheme.cardBg} ${activeTheme.cardBorder} transition-all duration-500`}
        >
          {/* Ornate Corner Accents */}
          <div className="absolute top-3 left-3 text-amber-400/60 text-lg select-none">❖</div>
          <div className="absolute top-3 right-3 text-amber-400/60 text-lg select-none">❖</div>
          <div className="absolute bottom-3 left-3 text-amber-400/60 text-lg select-none">❖</div>
          <div className="absolute bottom-3 right-3 text-amber-400/60 text-lg select-none">❖</div>

          {/* Top Tibetan/Ethiopian Tibeb Gold Stripe */}
          <div className="w-full h-1.5 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 rounded-full mb-8 opacity-80" />

          {/* Couple Monogram Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border-2 border-[#d4af37]/60 flex items-center justify-center bg-black/40 shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-4">
              <span className="font-cinzel text-xl sm:text-2xl font-black text-gold-shimmer">
                {weddingData.groomName[0]} & {weddingData.brideName[0]}
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-cinzel font-medium">
              In The Name Of The Holy Trinity
            </p>
            <p className="text-sm font-amharic text-amber-200 mt-1 font-semibold">
              በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን
            </p>
          </div>

          {/* Recipient Guest Honor Badge */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
              {language === 'am' ? 'የተከበሩ የክብር እንግዳችን' : 'Invited'}
            </p>
            <div className="inline-block py-2.5 px-6 rounded-2xl bg-black/50 border border-amber-500/40 shadow-xl backdrop-blur-md">
              <h3 className="text-xl sm:text-3xl font-cinzel font-bold text-amber-100">
                {currentGuest ? currentGuest.name : `${weddingData.groomName} & ${weddingData.brideName}'s Cherished Guests`}
              </h3>
              {currentGuest?.nameAmharic && (
                <p className="text-sm font-amharic text-amber-300 font-semibold mt-1">
                  {currentGuest.nameAmharic}
                </p>
              )}
            </div>

            {/* Guest Meta Badges (Group, Table Number, Seats) */}
            {currentGuest && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className={`text-[11px] px-3 py-1 rounded-full font-medium border ${activeTheme.badge}`}>
                  {currentGuest.group}
                </span>

                {currentGuest.tableNumber && (
                  <span className="text-[11px] px-3 py-1 rounded-full font-medium bg-amber-500/15 border border-amber-500/30 text-amber-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {currentGuest.tableNumber}
                  </span>
                )}

                <span className="text-[11px] px-3 py-1 rounded-full font-medium bg-blue-500/15 border border-blue-500/30 text-blue-200 flex items-center gap-1">
                  <Users className="w-3 h-3 text-blue-400" />
                  Seats Reserved: {1 + currentGuest.allowedPlusOnes}
                </span>
              </div>
            )}
          </div>

          {/* Invitation Message Body */}
          <div className="max-w-2xl mx-auto text-center space-y-4 my-8 p-6 rounded-2xl bg-black/30 border border-white/5">
            <div className="flex justify-center text-amber-400/50 mb-1">
              <MessageSquareQuote className="w-8 h-8" />
            </div>

            {/* Notice if this message is personalized vs global */}
            {isCustomMessage && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-[11px] text-amber-300 font-medium mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Personal Note from Abebe & Selamawit</span>
              </div>
            )}

            {/* Amharic Message */}
            <p className="text-base sm:text-lg font-amharic leading-relaxed text-amber-100/95 font-medium">
              {displayMessageAm}
            </p>

            {/* English Message */}
            {displayMessageEn && (
              <p className="text-xs sm:text-sm font-sans leading-relaxed text-stone-300/90 italic pt-2 border-t border-white/10">
                "{displayMessageEn}"
              </p>
            )}
          </div>

          {/* Invited Specific Events List */}
          {currentGuest && currentGuest.invitedEvents && currentGuest.invitedEvents.length > 0 && (
            <div className="max-w-xl mx-auto mb-8 p-4 rounded-xl bg-black/40 border border-amber-500/20 text-center">
              <p className="text-[11px] uppercase tracking-widest text-amber-300 font-semibold mb-2.5">
                {language === 'am' ? 'የተጋበዙባቸው ልዩ ፕሮግራሞች' : 'Programs You Are Specifically Invited To:'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {currentGuest.invitedEvents.map((evt) => (
                  <span
                    key={evt}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs bg-amber-500/10 border border-amber-500/30 text-amber-200 capitalize font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {evt === 'church' && (language === 'am' ? 'ሥርዓተ ተክሊል (Holy Matrimony)' : 'Holy Matrimony')}
                      {evt === 'reception' && (language === 'am' ? 'የሰርግ ግብዣ (Grand Reception)' : 'Grand Reception')}
                      {evt === 'melse' && (language === 'am' ? 'ባህላዊ መልስ (Traditional Melse)' : 'Traditional Melse')}
                      {evt === 'kebero' && (language === 'am' ? 'የከበሮ ጭፈራ (Cultural Kebero)' : 'Kebero Celebration')}
                      {evt === 'afterparty' && (language === 'am' ? 'የምሽት ፓርቲ (Evening Afterparty)' : 'VIP Afterparty')}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Card Footer Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-2 text-stone-400">
              <span className="text-amber-400">Theme:</span>
              <span className="font-semibold text-stone-200">{activeTheme.name}</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400 transition-all font-medium"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
              </button>

              <a
                href="#rsvp"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Confirm RSVP</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
