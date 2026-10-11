'use client';

import React from 'react';
import Link from 'next/link';
import { useWedding } from '@/context/WeddingContext';
import { Gauge, Minus, Plus, Zap, CheckCircle2, Eye, RotateCcw } from 'lucide-react';

export const AutoScrollSpeedCard: React.FC = () => {
  const { weddingData, updateWeddingData } = useWedding();
  const currentSpeed = weddingData.autoScrollSpeed || 40;

  const presets = [
    { label: 'Slow', speed: 25, desc: 'Relaxed gentle pace' },
    { label: 'Natural', speed: 40, desc: 'Recommended default' },
    { label: 'Moderate', speed: 55, desc: 'Smooth balanced motion' },
    { label: 'Fast', speed: 75, desc: 'Quick overview' },
    { label: 'Turbo', speed: 100, desc: 'High velocity glide' },
  ];

  const handleSetSpeed = (newSpeed: number) => {
    const clamped = Math.max(10, Math.min(250, Math.round(newSpeed)));
    updateWeddingData({ autoScrollSpeed: clamped });
  };

  return (
    <div className="p-6 rounded-2xl bg-[#141824] border border-amber-500/30 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-cinzel font-bold text-amber-100 flex items-center gap-2">
              <span>Auto-Scroll Speed Control</span>
              <span className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {currentSpeed} px / sec
              </span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Adjust how fast or slow the invitation page glides down automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:bg-amber-500/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Live Site</span>
          </Link>
          <button
            type="button"
            onClick={() => handleSetSpeed(40)}
            className="p-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-400 hover:text-amber-300 transition-colors"
            title="Reset to Default (40 px/s)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speed Meter Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-stone-400">
          <span>10 px/s (Slowest)</span>
          <span className="text-amber-300 font-bold font-mono text-sm">{currentSpeed} px/s</span>
          <span>150 px/s (Fastest)</span>
        </div>
        <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(5, (currentSpeed / 150) * 100))}%` }}
          />
        </div>
      </div>

      {/* Direct Input & Step Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step Buttons */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-300">Quick Step (+/- 5):</span>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleSetSpeed(currentSpeed - 5)}
              disabled={currentSpeed <= 10}
              className="px-3 py-2 rounded-lg bg-stone-900 border border-white/15 text-white hover:border-amber-400 transition-colors flex items-center space-x-1 disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-bold font-mono">-5</span>
            </button>
            <span className="font-mono text-base font-bold text-amber-300 w-12 text-center">
              {currentSpeed}
            </span>
            <button
              type="button"
              onClick={() => handleSetSpeed(currentSpeed + 5)}
              disabled={currentSpeed >= 200}
              className="px-3 py-2 rounded-lg bg-stone-900 border border-white/15 text-white hover:border-amber-400 transition-colors flex items-center space-x-1 disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-bold font-mono">+5</span>
            </button>
          </div>
        </div>

        {/* Custom Exact Number Input */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
          <div>
            <label htmlFor="custom-speed-input" className="block text-xs font-semibold text-stone-300">Custom Speed Input:</label>
            <p className="text-[11px] text-stone-400">Enter exact value in px/second</p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="custom-speed-input"
              type="number"
              min="10"
              max="250"
              value={currentSpeed}
              onChange={(e) => handleSetSpeed(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-lg bg-stone-950 border border-amber-500/40 text-amber-200 font-mono font-bold text-sm text-center focus:outline-none focus:border-amber-400"
            />
            <span className="text-xs text-stone-400 font-mono">px/s</span>
          </div>
        </div>
      </div>

      {/* Preset Speed Buttons */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
          Select Speed Preset:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {presets.map((preset) => {
            const isSelected = currentSpeed === preset.speed;
            return (
              <button
                key={preset.speed}
                type="button"
                onClick={() => handleSetSpeed(preset.speed)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                    : 'bg-black/30 border-white/10 text-stone-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-amber-300">
                    {preset.speed} px/s
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-xs font-semibold mt-1 text-stone-200">{preset.label}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
