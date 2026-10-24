'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useWedding } from '@/context/WeddingContext';
import { Heart, CheckCircle2, Send } from 'lucide-react';

export const RsvpSection: React.FC = () => {
  const { weddingData, currentGuest, submitGuestRsvp, language, activeTheme } = useWedding();

  const [selectedGuestId, setSelectedGuestId] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Sync with currentGuest if active
  useEffect(() => {
    if (currentGuest) {
      setSelectedGuestId(currentGuest.id);
    } else if (weddingData.guests.length > 0) {
      setSelectedGuestId(weddingData.guests[0].id);
    }
  }, [currentGuest, weddingData.guests]);

  const activeTargetGuest = weddingData.guests.find((g) => g.id === selectedGuestId) || currentGuest;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTargetGuest) return;

    submitGuestRsvp(activeTargetGuest.id, {
      status: 'attending',
      plusOnes: 0,
      dietaryRestrictions: '',
      notes: '',
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#d4af37', '#ffffff'],
      });
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="py-20 px-4 sm:px-6 relative bg-black/40">
      <div className="max-w-xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-cinzel">
              {language === 'am' ? 'የመገኘት ማረጋገጫ' : 'Confirm Attendance'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-shimmer">
            {language === 'am' ? 'የሰርግ RSVP ምላሽ' : 'RSVP Your Attendance'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-md mx-auto">
            {language === 'am'
              ? 'እባክዎ በሰርጋችን ላይ መገኘትዎን አስቀድመው በማረጋገጥ እንድንዘጋጅ ይርዱን'
              : `Kindly confirm your presence with joy to celebrate ${weddingData.groomName} & ${weddingData.brideName}’s holy union.`}
          </p>
        </div>

        {/* RSVP Card Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            backgroundColor: activeTheme.cardBgHex,
            borderColor: activeTheme.cardBorderHex,
            boxShadow: `0 25px 60px rgba(0,0,0,0.8), 0 0 35px ${activeTheme.glowColor}`,
          }}
          className="rounded-3xl p-6 sm:p-10 border backdrop-blur-xl transition-all"
        >
          {submitted ? (
            /* Success View */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-cinzel font-bold text-emerald-300">
                {language === 'am' ? 'ምላሽዎ በተሳካ ሁኔታ ተመዝግቧል!' : 'RSVP Confirmed with Joy!'}
              </h3>
              <p className="text-sm text-stone-300 max-w-md mx-auto">
                {language === 'am'
                  ? `እናመሰግናለን ${activeTargetGuest?.name}፣ በሰርጉ ቀን በደስታ እንጠብቆታለን!`
                  : `Thank you, ${activeTargetGuest?.name}! We look forward to celebrating together in Addis Ababa!`}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-stone-900 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:bg-amber-500/10 transition-colors"
                >
                  Edit Response
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Selector if not locked */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
                  {language === 'am' ? 'የእንግዳ ስም (ተጋባዥ)' : 'Invited Guest / Household'}
                </label>
                {currentGuest ? (
                  <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold font-cinzel">
                        {currentGuest.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-100">{currentGuest.name}</p>
                        <p className="text-xs text-stone-400">{currentGuest.group} • {currentGuest.tableNumber || 'Assigned Table'}</p>
                      </div>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      Verified Guest
                    </span>
                  </div>
                ) : (
                  <select
                    value={selectedGuestId}
                    onChange={(e) => setSelectedGuestId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  >
                    {weddingData.guests.map((g) => (
                      <option key={g.id} value={g.id} className="bg-[#141824] text-white">
                        {g.name} ({g.group})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Attendance Confirmation Button / Card */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
                  {language === 'am' ? 'በሰርጉ ላይ ይገኛሉ?' : 'Will You Be Attending?'}
                </label>
                <div className="w-full p-4 rounded-2xl border bg-emerald-950/60 border-emerald-400/80 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">{language === 'am' ? 'አዎ፡ በደስታ እገኛለሁ!' : 'Joyfully Accepts'}</p>
                    <p className="text-[11px] text-stone-300">{language === 'am' ? 'በክብር ተገኝቼ አደምቃለሁ' : 'I will attend with joy'}</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  background: activeTheme.primaryButtonGradient,
                  color: activeTheme.primaryButtonTextColor,
                  boxShadow: `0 0 25px ${activeTheme.glowColor}`,
                }}
                className="w-full py-3.5 rounded-full font-bold text-sm transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'am' ? 'መገኘቴን አረጋግጥ (Confirm RSVP)' : 'Submit Wedding RSVP'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
