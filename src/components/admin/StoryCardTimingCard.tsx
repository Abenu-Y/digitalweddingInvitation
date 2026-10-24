'use client';

import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { Clock, Minus, Plus, Sparkles, Key, Check, Copy, Sliders, Play, Pause, Hand } from 'lucide-react';

export const StoryCardTimingCard: React.FC = () => {
  const { weddingData, updateWeddingData } = useWedding();
  const currentDuration = weddingData.storyCardDurationSeconds ?? 12;
  const currentTransitionDuration = weddingData.storyCardTransitionDuration ?? 0.75;
  const autoAdvance = weddingData.storyCardAutoAdvance ?? true;
  const pauseOnHover = weddingData.storyCardPauseOnHover ?? true;
  const currentScrollHeight = weddingData.storyCardScrollHeightVh ?? 320;
  const secretPasscode = weddingData.adminPasscode || '772019';

  const [copiedCode, setCopiedCode] = React.useState<boolean>(false);
  const [newPasscode, setNewPasscode] = React.useState<string>(secretPasscode);

  const durationPresets = [
    { label: '8s Quick', seconds: 8, desc: 'Brief glance' },
    { label: '12s Balanced', seconds: 12, desc: 'Recommended' },
    { label: '16s Relaxed', seconds: 16, desc: 'Comfortable reading' },
    { label: '20s Extended', seconds: 20, desc: 'Ample time' },
    { label: '30s Maximum', seconds: 30, desc: 'Slow & leisurely' },
  ];

  const transitionPresets = [
    { label: 'Crisp (0.4s)', value: 0.4 },
    { label: 'Cinematic (0.75s)', value: 0.75 },
    { label: 'Royal (1.0s)', value: 1.0 },
    { label: 'Slow Luxury (1.4s)', value: 1.4 },
  ];

  const handleSetDuration = (sec: number) => {
    const clamped = Math.max(3, Math.min(60, Math.round(sec)));
    updateWeddingData({ storyCardDurationSeconds: clamped });
  };

  const handleSetTransitionDuration = (sec: number) => {
    updateWeddingData({ storyCardTransitionDuration: sec });
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: Invitation Slides Timing & Transition (01. Save The Date, 02. Our Invitation, 03. Calendar) */}
      <div className="p-6 rounded-2xl bg-[#141824] border border-amber-500/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-cinzel font-bold text-amber-100 flex items-center gap-2 flex-wrap">
              <span>Invitation Slides Timing &amp; Speed</span>
              <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {currentDuration}s per slide
              </span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Controls dwell time &amp; transition for <strong>01. Save The Date</strong>, <strong>02. Our Invitation</strong>, and <strong>03. Calendar</strong>.
            </p>
          </div>
        </div>

        {/* 1. Slide Dwell Time Control */}
        <div className="space-y-2">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-stone-200 block">Slide Display Duration:</span>
              <span className="text-[11px] text-stone-400">Seconds each card stays before next slide</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleSetDuration(currentDuration - 5)}
                disabled={currentDuration <= 5}
                className="px-2 py-1.5 rounded-lg bg-stone-900 border border-white/15 text-stone-300 hover:text-white hover:border-amber-400 text-xs font-mono disabled:opacity-40"
                title="-5s"
              >
                -5s
              </button>
              <button
                type="button"
                onClick={() => handleSetDuration(currentDuration - 1)}
                disabled={currentDuration <= 3}
                className="p-1.5 rounded-lg bg-stone-900 border border-white/15 text-white hover:border-amber-400 transition-colors disabled:opacity-40"
                title="-1s"
              >
                <Minus className="w-3.5 h-3.5 text-amber-300" />
              </button>
              <span className="font-mono text-base font-black text-amber-300 w-12 text-center">
                {currentDuration}s
              </span>
              <button
                type="button"
                onClick={() => handleSetDuration(currentDuration + 1)}
                disabled={currentDuration >= 60}
                className="p-1.5 rounded-lg bg-stone-900 border border-white/15 text-white hover:border-amber-400 transition-colors disabled:opacity-40"
                title="+1s"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
              </button>
              <button
                type="button"
                onClick={() => handleSetDuration(currentDuration + 5)}
                disabled={currentDuration >= 55}
                className="px-2 py-1.5 rounded-lg bg-stone-900 border border-white/15 text-stone-300 hover:text-white hover:border-amber-400 text-xs font-mono disabled:opacity-40"
                title="+5s"
              >
                +5s
              </button>
            </div>
          </div>
        </div>

        {/* 2. Presets */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-amber-300 font-semibold mb-2">
            Duration Presets:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
                  <span className="block font-bold">{preset.label}</span>
                  <span className="block text-[9px] text-stone-500 font-normal mt-0.5">{preset.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Slide Transition Animation Speed (Visual Gliding Speed) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Transition Animation Speed:</span>
            </label>
            <span className="text-[11px] font-mono text-amber-400">
              {currentTransitionDuration}s glide
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {transitionPresets.map((t) => {
              const active = currentTransitionDuration === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleSetTransitionDuration(t.value)}
                  className={`py-2 px-2 text-center rounded-xl border text-xs font-semibold transition-all ${
                    active
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                      : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Toggles: Auto-Advance & Pause on Read/Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Auto-Advance Toggle */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {autoAdvance ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-stone-400" />}
              <div>
                <span className="text-xs font-semibold text-stone-200 block">Auto-Advance</span>
                <span className="text-[10px] text-stone-400">{autoAdvance ? 'Slides rotate automatically' : 'Manual < > buttons only'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateWeddingData({ storyCardAutoAdvance: !autoAdvance })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                autoAdvance ? 'bg-amber-500' : 'bg-stone-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-stone-950 transition-transform ${
                  autoAdvance ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Pause on Hover Toggle */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hand className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-stone-200 block">Pause On Read</span>
                <span className="text-[10px] text-stone-400">{pauseOnHover ? 'Pauses while mouse/finger touches' : 'Continuous timer'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateWeddingData({ storyCardPauseOnHover: !pauseOnHover })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                pauseOnHover ? 'bg-amber-500' : 'bg-stone-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-stone-950 transition-transform ${
                  pauseOnHover ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 5. Scroll Travel Height */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">
            Scroll Dwell Distance:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Normal (260vh)', vh: 260 },
              { label: 'Longer (340vh)', vh: 340 },
              { label: 'Maximum (460vh)', vh: 460 },
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
