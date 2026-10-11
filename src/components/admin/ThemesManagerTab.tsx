'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { THEME_CONFIGS, ThemeConfig } from '@/styles/themes';
import { ThemeId } from '@/types/wedding';
import {
  Palette,
  Check,
  ExternalLink,
  Copy,
  Sparkles,
  Share2,
  Send,
  MessageCircle,
  Eye,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { AutoScrollSpeedCard } from '@/components/admin/AutoScrollSpeedCard';

export const ThemesManagerTab: React.FC = () => {
  const { weddingData, setDefaultTheme, updateWeddingData } = useWedding();

  const [copiedThemeId, setCopiedThemeId] = useState<string | null>(null);
  const [shareRecipientName, setShareRecipientName] = useState<string>('');
  const [selectedShareTheme, setSelectedShareTheme] = useState<ThemeId>('emerald-velvet');
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);

  const themeList = Object.values(THEME_CONFIGS) as ThemeConfig[];
  const currentDefaultTheme = THEME_CONFIGS[weddingData.defaultTheme] || THEME_CONFIGS['emerald-velvet'];

  const getThemeUrl = (themeId: ThemeId) => {
    if (typeof window === 'undefined') return `/?theme=${themeId}`;
    return `${window.location.origin}/?theme=${themeId}`;
  };

  const handleCopyThemeLink = (themeId: ThemeId) => {
    const url = getThemeUrl(themeId);
    navigator.clipboard.writeText(url);
    setCopiedThemeId(themeId);
    setTimeout(() => setCopiedThemeId(null), 2500);
  };

  // Pre-formatted message for WhatsApp / Telegram
  const generateShareMessage = () => {
    const recipient = shareRecipientName.trim() ? `ሰላም ${shareRecipientName.trim()}፣ ` : 'ሰላም፣ ';
    const url = getThemeUrl(selectedShareTheme);
    return `${recipient}የ${weddingData.groomFullName} እና የ${weddingData.brideFullName} የሰርግ ጥሪ ካርድዎን በዚህ ሊንክ ይመልከቱ፦\n${url}`;
  };

  const handleCopyShareMessage = () => {
    navigator.clipboard.writeText(generateShareMessage());
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2500);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(generateShareMessage());
    window.open(`https://t.me/share/url?url=${encodeURIComponent(getThemeUrl(selectedShareTheme))}&text=${text}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateShareMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Auto-Scroll Speed Control */}
      <AutoScrollSpeedCard />

      {/* Top Banner: Current Default Theme */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#07241c] via-[#093527] to-[#07241c] border-2 border-[#d4af37]/60 shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(212,175,55,0.2)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#997920] flex items-center justify-center text-stone-950 shadow-lg shrink-0">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest text-[#edd58a] font-cinzel font-semibold">
                Current Default Theme
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#fff3cb] text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mt-1">
              {currentDefaultTheme.name}
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-xl">
              This is the default royal theme loaded when guests open your invitation link. You can change this at any time by selecting another theme below.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <a
            href="/"
            target="_blank"
            className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-black/40 border border-[#d4af37]/50 text-[#edd58a] hover:bg-[#d4af37]/20 text-xs font-semibold transition-all shadow"
          >
            <Eye className="w-4 h-4" />
            <span>View Live Site</span>
          </a>
        </div>
      </div>

      {/* Public Page Sections Visibility Controls (Pic 2: Love Story & Pic 3: Photo Gallery) */}
      <div className="p-6 rounded-3xl bg-[#10141e] border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-cinzel font-bold text-amber-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              Public Invitation Sections Visibility
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Choose which story sections your guests can see on the public invitation page. Both are kept hidden until you enable them.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Toggle 1: Love Story (Pic 2) */}
          <div className={`p-4 rounded-2xl border transition-all ${weddingData.showLoveStory ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-black/30 border-white/10'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-stone-200">Love Story (Pic 2)</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${weddingData.showLoveStory ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'}`}>
                    {weddingData.showLoveStory ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 mt-0.5">Journey chapters ("How It All Began")</p>
                <p className="text-[11px] text-stone-400 mt-1">Shows your relationship journey & milestones.</p>
              </div>

              <button
                type="button"
                onClick={() => updateWeddingData({ showLoveStory: !weddingData.showLoveStory })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${weddingData.showLoveStory ? 'bg-emerald-500' : 'bg-stone-700'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${weddingData.showLoveStory ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Toggle 2: Photo Gallery (Pic 3) */}
          <div className={`p-4 rounded-2xl border transition-all ${weddingData.showGallery ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-black/30 border-white/10'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-stone-200">Photo Gallery (Pic 3)</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${weddingData.showGallery ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'}`}>
                    {weddingData.showGallery ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
                <p className="font-amharic text-xs text-amber-200/80 mt-0.5">የፎቶ ማዕከል ገጽ ("Pre-Wedding Moments")</p>
                <p className="text-[11px] text-stone-400 mt-1">High-resolution pre-wedding photos.</p>
              </div>

              <button
                type="button"
                onClick={() => updateWeddingData({ showGallery: !weddingData.showGallery })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${weddingData.showGallery ? 'bg-emerald-500' : 'bg-stone-700'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${weddingData.showGallery ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All 5 Luxury Themes */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-cinzel font-bold text-amber-200 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            Available Themes for Hosni & Jerusalem
          </h3>
          <p className="text-xs text-stone-400">
            Click &ldquo;Set as Default&rdquo; to make a theme the default for everyone, or click &ldquo;Copy Link&rdquo; to send a specific theme to certain guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themeList.map((theme) => {
            const isCurrentDefault = weddingData.defaultTheme === theme.id;

            return (
              <div
                key={theme.id}
                style={{
                  backgroundColor: `${theme.cardBgHex}f5`,
                  borderColor: isCurrentDefault ? theme.highlightHex : theme.cardBorderHex,
                  boxShadow: isCurrentDefault
                    ? `0 12px 35px ${theme.glowColor}, 0 0 25px ${theme.glowColor}`
                    : 'none',
                }}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 border ${
                  isCurrentDefault ? 'ring-2 ring-white/30' : 'hover:border-white/40'
                }`}
              >
                <div>
                  {/* Theme Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-serif font-bold text-base text-white">
                        {theme.name}
                      </h4>
                      <p className="text-xs font-amharic font-medium mt-0.5" style={{ color: theme.accentHex }}>
                        {theme.nameAmharic}
                      </p>
                    </div>

                    {isCurrentDefault && (
                      <span
                        style={{
                          backgroundColor: theme.accentHex,
                          color: theme.primaryButtonTextColor,
                        }}
                        className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] shrink-0 shadow"
                      >
                        <Check className="w-3 h-3" />
                        <span>ACTIVE</span>
                      </span>
                    )}
                  </div>

                  {/* Theme Color Swatches Preview */}
                  <div className="mb-4 p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                      Color Palette & Texture:
                    </span>
                    <div className="flex items-center space-x-2">
                      {/* Background sample */}
                      <div
                        className="w-8 h-8 rounded-lg border border-white/20 shadow-inner"
                        style={{ backgroundColor: theme.cardBgHex }}
                        title="Background Surface"
                      />
                      {/* Card surface sample */}
                      <div
                        className="w-8 h-8 rounded-lg border border-white/20 shadow-inner"
                        style={{ backgroundColor: theme.envelopeLining }}
                        title="Envelope Lining"
                      />
                      {/* Metallic accent sample */}
                      <div
                        className="w-8 h-8 rounded-lg border border-white/20 shadow-inner flex items-center justify-center font-bold text-[10px]"
                        style={{ backgroundColor: theme.accentHex, color: theme.primaryButtonTextColor }}
                        title="Metallic Accent"
                      >
                        ✦
                      </div>
                      {/* Seal stamp sample */}
                      <div
                        className="w-8 h-8 rounded-full border border-white/30 shadow-md flex items-center justify-center text-white text-[9px] font-serif"
                        style={{ backgroundColor: theme.sealColor }}
                        title="Wax Seal Color"
                      >
                        H&J
                      </div>
                    </div>
                  </div>

                  {/* Theme Description */}
                  <p className="text-xs text-stone-300 leading-relaxed mb-5">
                    {theme.description}
                  </p>
                </div>

                {/* Theme Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {/* Set As Default Button */}
                  {isCurrentDefault ? (
                    <div
                      style={{
                        backgroundColor: `${theme.cardBgHex}`,
                        borderColor: theme.highlightHex,
                        color: theme.accentHex,
                        boxShadow: `0 0 15px ${theme.glowColor}`,
                      }}
                      className="w-full py-2 rounded-xl border text-xs font-bold text-center flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ዋናው ገጽታ ነው (Currently Active)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDefaultTheme(theme.id)}
                      style={{
                        background: theme.primaryButtonGradient,
                        color: theme.primaryButtonTextColor,
                        boxShadow: `0 0 15px ${theme.glowColor}`,
                      }}
                      className="w-full py-2 rounded-xl font-bold text-xs hover:opacity-95 transition-all shadow cursor-pointer"
                    >
                      ዋናው ገጽታ አድርግ (Make Default)
                    </button>
                  )}

                  {/* Secondary Actions: Preview & Copy Link */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`/?theme=${theme.id}`}
                      target="_blank"
                      className="py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-[11px] font-semibold text-center flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </a>

                    <button
                      onClick={() => handleCopyThemeLink(theme.id)}
                      className="py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-[11px] font-semibold text-center flex items-center justify-center space-x-1 transition-colors"
                    >
                      {copiedThemeId === theme.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share With Different Guests Feature */}
      <div className="p-6 rounded-3xl bg-[#141824] border border-white/10 space-y-5">
        <div>
          <h3 className="text-base font-cinzel font-bold text-amber-200 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            Send Different Themes to Specific Guests
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Select a tailored royal theme for specific guests and send their personalized invitation link via Telegram or WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Recipient Name (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Dawit or Martha"
              value={shareRecipientName}
              onChange={(e) => setShareRecipientName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Select Theme to Send:
            </label>
            <select
              value={selectedShareTheme}
              onChange={(e) => setSelectedShareTheme(e.target.value as ThemeId)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {themeList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message Preview */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
            Invitation Message Preview:
          </span>
          <p className="text-xs text-amber-100 whitespace-pre-line bg-black/30 p-3 rounded-lg border border-white/5">
            {generateShareMessage()}
          </p>
        </div>

        {/* Direct Action Share Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyShareMessage}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-stone-900 border border-white/20 text-white text-xs font-semibold hover:border-amber-400 transition-colors"
          >
            {copiedShareText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Message Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-300" />
                <span>Copy Message</span>
              </>
            )}
          </button>

          <button
            onClick={handleShareTelegram}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#229ED9] text-white text-xs font-bold hover:brightness-110 transition-all shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Share on Telegram</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#25D366] text-stone-950 text-xs font-bold hover:brightness-110 transition-all shadow"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
