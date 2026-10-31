'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useWedding } from '@/context/WeddingContext';
import {
  Heart,
  CheckCircle2,
  Send,
  User,
  Phone,
  Users,
  MessageSquare,
  Loader2,
  XCircle,
  Database,
  Sparkles,
} from 'lucide-react';

export const RsvpSection: React.FC = () => {
  const { weddingData, currentGuest, submitRsvpByName, language, activeTheme } = useWedding();

  const [guestName, setGuestName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [attendingCount, setAttendingCount] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    status: 'attending' | 'declined';
    attendingCount: number;
  } | null>(null);

  // Sync with currentGuest if active (from personalized invite link)
  useEffect(() => {
    if (currentGuest) {
      if (currentGuest.name) setGuestName(currentGuest.name);
      if (currentGuest.phone) setPhone(currentGuest.phone);
      if (currentGuest.notes) setNotes(currentGuest.notes);
      if (currentGuest.rsvpStatus === 'declined') {
        setStatus('declined');
      } else if (currentGuest.rsvpStatus === 'attending') {
        setStatus('attending');
        setAttendingCount(Math.max(1, (currentGuest.attendingPlusOnes || 0) + 1));
      }
    }
  }, [currentGuest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = guestName.trim();
    if (!cleanName || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitRsvpByName({
        name: cleanName,
        phone: phone.trim(),
        status,
        attendingCount: status === 'attending' ? attendingCount : 0,
        notes: notes.trim(),
      });

      if (status === 'attending') {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#d4af37', '#ffffff', '#f59e0b'],
          });
        } catch (err) {
          console.error(err);
        }
      }

      setSubmittedData({
        name: cleanName,
        status,
        attendingCount: status === 'attending' ? attendingCount : 0,
      });
    } catch (err) {
      console.error('Error submitting RSVP:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedData(null);
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
            {language === 'am' ? 'የሰርግ RSVP ምላሽ' : 'Wedding RSVP'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-md mx-auto">
            {language === 'am'
              ? 'እባክዎ ሙሉ ስምዎን በማስገባት በሰርጋችን ላይ መገኘትዎን ያረጋግጡ'
              : `Kindly enter your name to confirm your presence celebrating ${weddingData.groomName} & ${weddingData.brideName}’s wedding.`}
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
          {submittedData ? (
            /* Success View */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-cinzel font-bold text-emerald-300">
                  {language === 'am' ? 'ምላሽዎ በተሳካ ሁኔታ ተመዝግቧል!' : 'RSVP Saved Successfully!'}
                </h3>
                <div className="inline-flex items-center space-x-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300">
                  <Database className="w-3 h-3" />
                  <span>{language === 'am' ? 'በዳታቤዝ ተቀምጧል (Saved to DB)' : 'Persisted to Database'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 max-w-md mx-auto text-stone-200 text-sm leading-relaxed">
                {submittedData.status === 'attending' ? (
                  <>
                    <p className="font-semibold text-amber-200">{submittedData.name}</p>
                    <p className="mt-1 text-xs text-stone-300">
                      {language === 'am'
                        ? `እናመሰግናለን! ለ ${submittedData.attendingCount} እንግዳ የመገኘት ማረጋገጫዎ ተመዝግቧል። በሰርጉ ቀን በደስታ እንጠብቆታለን!`
                        : `Thank you! Your attendance has been confirmed for ${submittedData.attendingCount} guest${
                            submittedData.attendingCount > 1 ? 's' : ''
                          }. We eagerly look forward to celebrating together in Addis Ababa!`}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-stone-200">{submittedData.name}</p>
                    <p className="mt-1 text-xs text-stone-400">
                      {language === 'am'
                        ? 'ምላሽዎን ስላሳወቁን እናመሰግናለን። በጸሎት እና በምኞትዎ ከእኛ ጋር ስለሆኑ ከልብ እናመሰግናለን!'
                        : 'Thank you for letting us know. You will be warmly remembered in our celebration!'}
                    </p>
                  </>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-full bg-stone-900 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:bg-amber-500/10 transition-colors"
                >
                  {language === 'am' ? 'ምላሽ አስተካክል / አዲስ አስገባ' : 'Edit Response / Submit Another'}
                </button>
              </div>
            </div>
          ) : (
            /* Form View: Direct Name Entry (NO dropdown) */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="flex items-center justify-between text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
                  <span className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'am' ? 'ሙሉ ስምዎ (ተጋባዥ)' : 'Your Full Name'}</span>
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-normal">
                    {language === 'am' ? '* አስፈላጊ ነው' : '* Required'}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={
                      language === 'am' ? 'ለምሳሌ፡ አበበ ከበደ ወይም ዶ/ር ዳዊት' : 'e.g. John Doe / Samuel Bekele'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                  />
                </div>
              </div>

              {/* [COMMENTED OUT AS REQUESTED] Phone Input (Optional)
              <div>
                <label className="flex items-center space-x-1.5 text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'am' ? 'ስልክ ቁጥር (ከተፈለገ)' : 'Phone Number (Optional)'}</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={language === 'am' ? '09... ወይም +251 9...' : '09... or +251 9...'}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
              </div>
              */}

              {/* [COMMENTED OUT AS REQUESTED] Attendance Choice: Will You Be Attending / Regretfully Declines
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
                  {language === 'am' ? 'በሰርጉ ላይ ይገኛሉ?' : 'Will You Be Attending?'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('attending')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start space-x-2.5 cursor-pointer ${
                      status === 'attending'
                        ? 'bg-emerald-950/70 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : 'bg-black/40 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        status === 'attending' ? 'text-emerald-400' : 'text-stone-500'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-bold">
                        {language === 'am' ? 'አዎ፡ በደስታ እገኛለሁ' : 'Joyfully Accepts'}
                      </p>
                      <p className="text-[10px] opacity-75 mt-0.5">
                        {language === 'am' ? 'በክብር እገኛለሁ' : 'Will attend with joy'}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('declined')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start space-x-2.5 cursor-pointer ${
                      status === 'declined'
                        ? 'bg-rose-950/70 border-rose-400 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                        : 'bg-black/40 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <XCircle
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        status === 'declined' ? 'text-rose-400' : 'text-stone-500'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-bold">
                        {language === 'am' ? 'ይቅርታ፡ አልችልም' : 'Regretfully Declines'}
                      </p>
                      <p className="text-[10px] opacity-75 mt-0.5">
                        {language === 'am' ? 'በሩቅ እጸልያለሁ' : 'Cannot attend'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
              */}

              {/* [COMMENTED OUT AS REQUESTED] Attending Count (Only if Attending)
              {status === 'attending' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2"
                >
                  <label className="flex items-center space-x-1.5 text-xs uppercase tracking-widest text-amber-300 font-semibold">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'am' ? 'የሚመጡ ሰዎች ብዛት' : 'Total Guests Attending'}</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAttendingCount(num)}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                          attendingCount === num
                            ? 'bg-amber-500 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                            : 'bg-black/40 border border-amber-500/20 text-amber-200 hover:border-amber-400/40'
                        }`}
                      >
                        {num === 5 ? '5+' : num}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              */}

              {/* [COMMENTED OUT AS REQUESTED] Optional Message / Notes
              <div>
                <label className="flex items-center space-x-1.5 text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {language === 'am'
                      ? 'ለሙሽሮቹ ማስታወሻ / መልካም ምኞት (ከተፈለገ)'
                      : 'Warm Note / Blessings for Couple (Optional)'}
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    language === 'am'
                      ? 'የሰርግ መልካም ምኞትዎን ወይም ማስታወሻዎን እዚህ ይጻፉ...'
                      : 'Share a sweet wish or dietary note for Hosni & Jerry...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 placeholder:text-stone-500 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all resize-none"
                />
              </div>
              */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!guestName.trim() || isSubmitting}
                style={{
                  background: activeTheme.primaryButtonGradient,
                  color: activeTheme.primaryButtonTextColor,
                  boxShadow: `0 0 25px ${activeTheme.glowColor}`,
                }}
                className={`w-full py-3.5 rounded-full font-bold text-sm transform transition-all flex items-center justify-center space-x-2 ${
                  !guestName.trim() || isSubmitting
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:-translate-y-0.5 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'am' ? 'በመመዝገብ ላይ...' : 'Saving RSVP...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {language === 'am'
                        ? 'መገኘቴን አረጋግጥ (Submit RSVP)'
                        : 'Submit Wedding RSVP'}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-stone-400 pt-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>
                  {language === 'am'
                    ? 'ቀጥታ በሰርጉ ዳታቤዝ ይቀመጣል'
                    : 'Saves directly to MongoDB database'}
                </span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
