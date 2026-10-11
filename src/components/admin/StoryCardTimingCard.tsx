'use client';

import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { Clock, Minus, Plus, Sparkles, Key, Check, Copy } from 'lucide-react';

export const StoryCardTimingCard: React.FC = () => {
  const { weddingData, updateWeddingData } = useWedding();
  const currentDuration = weddingData.storyCardDurationSeconds ?? 6;
  const currentScrollHeight = weddingData.storyCardScrollHeightVh ?? 260;
  const secretPasscode = weddingData.adminPasscode || '772019';

  const [copiedCode, setCopiedCode] = React.useState<boolean>(false);
  const [newPasscode, setNewPasscode] = React.useState<string>(secretPasscode);

  const durationPresets = [
    { label: '3s Fast', seconds: 3 },
    { label: '5s Balanced', seconds: 5 },
    { label: '7s Natural', seconds: 7 },
    { label: '10s Relaxed', seconds: 10 },
    { label: '14s Extended', seconds: 14 },
  ];

  const handleSetDuration = (sec: number) => {
    const clamped = Math.max(1, Math.min(60, Math.round(sec)));
    updateWeddingData({ storyCardDurationSeconds: clamped });
  };

  const handleSetScrollHeight = (vh: number) => {
    updateWeddingData({ storyCardScrollHeightVh: vh });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(secretPasscode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSavePasscode = () => {
    const clean = newPasscode.trim();
    if (clean) {
      updateWeddingData({ adminPasscode: clean });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card 1: Save The Date Story Transition Timing */}
      <div className="p-6 rounded-2xl bg-[#141824] border border-amber-500/30 shadow-2xl space-y-5">
        <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-cinzel font-bold text-amber-100 flex items-center gap-2">
              <span>Save The Date Card Timing</span>
              <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {currentDuration}s per card
              </span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Control how long each card (1 → 2 → 3) stays before moving to the next.
            </p>
          </div>
        </div>

        {/* Step Controls */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-300 block">Dwell Time Per Card:</span>
            <span className="text-[11px] text-stone-500">Auto-transition interval</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleSetDuration(currentDuration - 1)}
              disabled={currentDuration <= 1}
              className="px-3 py-2 rounded-lg bg-stone-900 border border-white/15 text-white hover:border-amber-400 transition-colors flex items-center space-x-1 disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-bold font-mono">-1s</span>
            </button>
            <span className="font-mono text-base font-bold text-amber-300 w-12 text-center">
              {currentDuration}s
            </span>
            <button
              type="button"
              onClick={() => handleSetDuration(currentDuration + 1)}
              disabled={currentDuration >= 45}
              className="px-3 py-2 rounded-lg bg-stone-900 border border-white/15 text-white hover:border-amber-400 transition-colors flex items-center space-x-1 disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-bold font-mono">+1s</span>
            </button>
          </div>
        </div>

        {/* Presets */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-amber-300 font-semibold mb-2">
            Preset Duration:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {durationPresets.map((preset) => {
              const active = currentDuration === preset.seconds;
              return (
                <button
                  key={preset.seconds}
                  type="button"
                  onClick={() => handleSetDuration(preset.seconds)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all ${
                    active
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                      : 'bg-black/30 border-white/10 text-stone-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll Travel Height */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">
            Scroll Dwell Distance:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Normal (220vh)', vh: 220 },
              { label: 'Longer (320vh)', vh: 320 },
              { label: 'Maximum (450vh)', vh: 450 },
            ].map((p) => (
              <button
                key={p.vh}
                type="button"
                onClick={() => handleSetScrollHeight(p.vh)}
                className={`py-2 px-2 text-center rounded-xl border text-xs font-semibold transition-all ${
                  currentScrollHeight === p.vh
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card 2: Secret Couple Passcode (Known only to You, Bride & Groom) */}
      <div className="p-6 rounded-2xl bg-[#141824] border border-amber-500/30 shadow-2xl space-y-5">
        <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
            <Key className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-cinzel font-bold text-amber-100 flex items-center gap-2">
              <span>Secret Couple Passcode</span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                Private Access
              </span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Unique passcode known strictly to You, Hosni, &amp; Jerusalem.
            </p>
          </div>
        </div>

        {/* Current Active Passcode Display */}
        <div className="p-4 rounded-xl bg-black/50 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Your Unique Passcode:</span>
            <span className="font-mono text-2xl font-black text-amber-300 tracking-[0.25em]">{secretPasscode}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:bg-amber-500/10 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Change Passcode Option */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold">
            Change / Set New Secret Passcode:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              placeholder="e.g. 772019"
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-amber-200 font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleSavePasscode}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              Save Passcode
            </button>
          </div>
          <p className="text-[11px] text-stone-500">
            Use this 6-digit code on the Settings lock screen to access your admin portal.
          </p>
        </div>
      </div>
    </div>
  );
};
