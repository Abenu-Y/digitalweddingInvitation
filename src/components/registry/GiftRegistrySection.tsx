'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { Gift, Copy, Check, QrCode, CreditCard, Sparkles, Building } from 'lucide-react';

export const GiftRegistrySection: React.FC = () => {
  const { weddingData, language } = useWedding();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="registry" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md mb-3">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-cinzel">
              {language === 'am' ? 'የስጦታና ድጋፍ ማስተላለፊያ' : 'Gift Registry & Blessings'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-shimmer">
            {language === 'am' ? 'የባንክ አካውንቶችና ስጦታ' : 'Wedding Gift Registry'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300/80 mt-2 max-w-xl mx-auto leading-relaxed">
            {language === 'am'
              ? 'የእናንተ መገኘትና ጸሎት ከምንም በላይ ታላቅ ስጦታችን ነው! ለምትሹ ወዳጆቻችን የባንክና ቴሌብር አካውንቶች ከዚህ በታች ተዘጋጅተዋል።'
              : 'Your warm presence and heartfelt prayers are the greatest gifts we could ever ask for. For friends wishing to bless us with a monetary gift, our bank details are below.'}
          </p>
        </div>

        {/* Bank Accounts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {weddingData.bankAccounts.map((account, idx) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-[#141824]/90 border border-amber-500/25 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-amber-400/60 transition-all flex flex-col justify-between"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-amber-400" />
                    <h3 className="font-cinzel font-bold text-base text-amber-100">
                      {account.bankName}
                    </h3>
                  </div>
                  {account.branch && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-stone-400">
                      {account.branch}
                    </span>
                  )}
                </div>

                <div className="space-y-1 my-3">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400">
                    Account Holder:
                  </p>
                  <p className="text-xs font-semibold text-stone-200">{account.accountName}</p>
                </div>
              </div>

              {/* Account Number with 1-Click Copy */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="font-mono text-sm sm:text-base font-bold text-amber-300 tracking-wider">
                  {account.accountNumber}
                </div>
                <button
                  onClick={() => handleCopy(account.id, account.accountNumber)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:bg-amber-500/30 hover:border-amber-400 transition-all"
                >
                  {copiedId === account.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
