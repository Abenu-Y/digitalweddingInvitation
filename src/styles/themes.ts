import { ThemeId } from '@/types/wedding';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameAmharic: string;
  description: string;
  badge: string;
  bgGradient: string;
  heroOverlayGradient: string;
  cardBg: string;
  cardBorder: string;
  accentGold: string;
  accentHex: string;
  accentSecondaryHex: string;
  cardBgHex: string;
  cardBorderHex: string;
  primaryButtonGradient: string;
  primaryButtonTextColor: string;
  highlightHex: string;
  primaryText: string;
  secondaryText: string;
  secondaryTextHex: string;
  envelopeColor: string;
  envelopeLining: string;
  sealColor: string;
  sealBorder: string;
  glowColor: string;
  patternType: 'tibeb' | 'damask' | 'floral' | 'geometric' | 'minimal';
}

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  'habesha-gold': {
    id: 'habesha-gold',
    name: 'Habesha Royal Gold',
    nameAmharic: 'ባህላዊ የሀበሻ ወርቃማ',
    description: 'Traditional Ethiopian imperial luxury with intricate royal Tibeb patterns and high-voltage gold foil.',
    badge: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
    bgGradient: 'from-[#080a12] via-[#121626] to-[#090b14]',
    heroOverlayGradient: 'from-[#080a12]/90 via-[#121626]/80 to-[#080a12]',
    cardBg: 'bg-[#12182b]/95 backdrop-blur-xl',
    cardBorder: 'border-[#f59e0b]/50 shadow-[0_0_35px_rgba(245,158,11,0.2)]',
    accentGold: 'text-[#fbbf24]',
    accentHex: '#ffd700',
    accentSecondaryHex: '#fcd34d',
    cardBgHex: '#12182b',
    cardBorderHex: 'rgba(245, 158, 11, 0.45)',
    primaryButtonGradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #d97706 100%)',
    primaryButtonTextColor: '#000000',
    highlightHex: '#ffd700',
    primaryText: 'text-amber-50',
    secondaryText: 'text-amber-200/80',
    secondaryTextHex: '#fef3c7',
    envelopeColor: '#17140e',
    envelopeLining: '#382a14',
    sealColor: '#b8860b',
    sealBorder: '#ffd700',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    patternType: 'tibeb',
  },
  'emerald-velvet': {
    id: 'emerald-velvet',
    name: 'Emerald Velvet & Gold',
    nameAmharic: 'የንግሥት ኤመራልድና ወርቅ',
    description: 'Deep royal emerald velvet tones combined with burnished antique gold and lush forest elegance.',
    badge: 'bg-emerald-950/80 text-[#6ee7b7] border-emerald-500/50',
    bgGradient: 'from-[#031d14] via-[#063826] to-[#021810]',
    heroOverlayGradient: 'from-[#031d14]/90 via-[#063826]/80 to-[#021810]',
    cardBg: 'bg-[#063323]/95 backdrop-blur-xl',
    cardBorder: 'border-emerald-400/50 shadow-[0_0_35px_rgba(16,185,129,0.25)]',
    accentGold: 'text-[#6ee7b7]',
    accentHex: '#34d399',
    accentSecondaryHex: '#a7f3d0',
    cardBgHex: '#063323',
    cardBorderHex: 'rgba(52, 211, 153, 0.45)',
    primaryButtonGradient: 'linear-gradient(135deg, #047857 0%, #10b981 50%, #059669 100%)',
    primaryButtonTextColor: '#022c22',
    highlightHex: '#34d399',
    primaryText: 'text-emerald-50',
    secondaryText: 'text-emerald-200/85',
    secondaryTextHex: '#d1fae5',
    envelopeColor: '#07241c',
    envelopeLining: '#0f4234',
    sealColor: '#064e3b',
    sealBorder: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    patternType: 'tibeb',
  },
  'burgundy-luxury': {
    id: 'burgundy-luxury',
    name: 'Burgundy Rose Velvet',
    nameAmharic: 'የፍቅር ቡርጉንዲና ጽጌሬዳ',
    description: 'Passionate deep wine burgundy intertwined with romantic rose gold, velvety crimson, and floral warmth.',
    badge: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
    bgGradient: 'from-[#22030e] via-[#3a0619] to-[#19020a]',
    heroOverlayGradient: 'from-[#22030e]/90 via-[#3a0619]/80 to-[#19020a]',
    cardBg: 'bg-[#40081d]/95 backdrop-blur-xl',
    cardBorder: 'border-rose-400/50 shadow-[0_0_35px_rgba(244,63,94,0.3)]',
    accentGold: 'text-rose-300',
    accentHex: '#fb7185',
    accentSecondaryHex: '#fecdd3',
    cardBgHex: '#40081d',
    cardBorderHex: 'rgba(251, 113, 133, 0.45)',
    primaryButtonGradient: 'linear-gradient(135deg, #be123c 0%, #f43f5e 50%, #e11d48 100%)',
    primaryButtonTextColor: '#ffffff',
    highlightHex: '#fda4af',
    primaryText: 'text-rose-50',
    secondaryText: 'text-rose-200/85',
    secondaryTextHex: '#ffe4e6',
    envelopeColor: '#240711',
    envelopeLining: '#4a1125',
    sealColor: '#9f1239',
    sealBorder: '#fda4af',
    glowColor: 'rgba(244, 63, 94, 0.32)',
    patternType: 'floral',
  },
  'midnight-obsidian': {
    id: 'midnight-obsidian',
    name: 'Midnight Obsidian & Platinum',
    nameAmharic: 'የሌሊት ንጋት ኦብሲዲያን',
    description: 'Ultra-modern deep obsidian aesthetic shimmering with electric starlight cyan, platinum, and silver.',
    badge: 'bg-slate-900/80 text-cyan-300 border-cyan-500/50',
    bgGradient: 'from-[#04060c] via-[#091122] to-[#04050a]',
    heroOverlayGradient: 'from-[#04060c]/90 via-[#091122]/80 to-[#04050a]',
    cardBg: 'bg-[#0d162a]/95 backdrop-blur-xl',
    cardBorder: 'border-cyan-400/50 shadow-[0_0_35px_rgba(56,189,248,0.25)]',
    accentGold: 'text-cyan-300',
    accentHex: '#38bdf8',
    accentSecondaryHex: '#bae6fd',
    cardBgHex: '#0d162a',
    cardBorderHex: 'rgba(56, 189, 248, 0.45)',
    primaryButtonGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #0369a1 100%)',
    primaryButtonTextColor: '#082f49',
    highlightHex: '#38bdf8',
    primaryText: 'text-slate-100',
    secondaryText: 'text-slate-300/85',
    secondaryTextHex: '#e0f2fe',
    envelopeColor: '#090c12',
    envelopeLining: '#1b2233',
    sealColor: '#0f172a',
    sealBorder: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    patternType: 'geometric',
  },
  'champagne-pearl': {
    id: 'champagne-pearl',
    name: 'Champagne Pearl & Silk',
    nameAmharic: 'የሉልና ሻምፓኝ ሐር',
    description: 'Warm candlelit champagne tones, cashmere velvet, and soft luminous pearl ivory elegance.',
    badge: 'bg-stone-900/80 text-amber-200 border-yellow-300/50',
    bgGradient: 'from-[#1a130c] via-[#2d2015] to-[#150f09]',
    heroOverlayGradient: 'from-[#1a130c]/90 via-[#2d2015]/80 to-[#150f09]',
    cardBg: 'bg-[#332418]/95 backdrop-blur-xl',
    cardBorder: 'border-[#fef08a]/50 shadow-[0_0_35px_rgba(254,240,138,0.22)]',
    accentGold: 'text-[#fef08a]',
    accentHex: '#fde047',
    accentSecondaryHex: '#fef9c3',
    cardBgHex: '#332418',
    cardBorderHex: 'rgba(254, 240, 138, 0.45)',
    primaryButtonGradient: 'linear-gradient(135deg, #a16207 0%, #eab308 50%, #ca8a04 100%)',
    primaryButtonTextColor: '#1c1917',
    highlightHex: '#fef08a',
    primaryText: 'text-stone-100',
    secondaryText: 'text-stone-200/85',
    secondaryTextHex: '#fefce8',
    envelopeColor: '#1c1712',
    envelopeLining: '#3d3226',
    sealColor: '#78350f',
    sealBorder: '#fef08a',
    glowColor: 'rgba(254, 240, 138, 0.28)',
    patternType: 'minimal',
  },
};
