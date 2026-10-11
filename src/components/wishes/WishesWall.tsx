'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { MessageSquare, Heart, Send, Sparkles, User, ThumbsUp } from 'lucide-react';

export const WishesWall: React.FC = () => {
  const { weddingData, currentGuest, addWish, likeWish, language } = useWedding();

  const [name, setName] = useState(currentGuest ? currentGuest.name : '');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addWish(name.trim() || 'Well-wisher (የክብር እንግዳ)', message.trim());
    setMessage('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const approvedWishes = weddingData.wishes.filter((w) => w.approved);

  return (
    <section id="wishes" className="py-20 px-4 sm:px-6 relative bg-black/30">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-cinzel">
              {language === 'am' ? 'የእንግዶች መልካም ምኞት' : 'Live Guestbook'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-shimmer">
            {language === 'am' ? 'የፍቅርና የበረከት ቃላት' : 'Wishes & Blessings'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-lg mx-auto">
            {language === 'am'
              ? 'ለአበበ እና ሰላማዊት የልብዎን መልካም ምኞትና ጸሎት ያጋሩ'
              : 'Leave a warm blessing, memory, or congratulatory note for the bride & groom.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Wish Submission Form */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#141824]/90 border border-amber-500/30 shadow-2xl backdrop-blur-md sticky top-28">
              <h3 className="text-base font-cinzel font-bold text-amber-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {language === 'am' ? 'ምኞትዎን ይፃፉ' : 'Write Your Blessing'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Your Message / Blessing:
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Wishing you a marriage filled with faith, happiness and everlasting joy..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-stone-200 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {success && (
                  <p className="text-xs text-emerald-400 font-medium animate-pulse">
                    ✨ Thank you! Your blessing has been published to the guestbook wall.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'am' ? 'ምኞቴን አጋራ (Post Blessing)' : 'Send Blessing'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Live Wishes Feed */}
          <div className="lg:col-span-7 space-y-4">
            {approvedWishes.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-black/20 border border-white/5 text-stone-400 text-xs">
                No wishes posted yet. Be the first to leave a blessing!
              </div>
            ) : (
              approvedWishes.map((w, idx) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-5 rounded-2xl bg-[#121622]/90 border border-white/10 shadow-lg backdrop-blur-md hover:border-amber-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold text-xs">
                        {w.guestName[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-200">{w.guestName}</h4>
                        <span className="text-[10px] text-stone-500">
                          {new Date(w.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => likeWish(w.id)}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-rose-500/20 text-stone-400 hover:text-rose-300 border border-white/5 hover:border-rose-500/30 transition-colors text-[11px]"
                    >
                      <Heart className="w-3 h-3 fill-current text-rose-400" />
                      <span>{w.likes}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200/90 mt-3 leading-relaxed font-sans">
                    {w.message}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
