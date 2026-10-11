import { ThemeId } from '@/types/wedding';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameAmharic: string;
  description: string;
  badge: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  accentGold: string;
  primaryText: string;
  secondaryText: string;
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
    description: 'Traditional Ethiopian luxury with intricate Tibeb patterns and royal gold foil.',
    badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    bgGradient: 'from-[#0b0c10] via-[#121620] to-[#0d0f14]',
    cardBg: 'bg-[#151922]/90 backdrop-blur-xl',
    cardBorder: 'border-[#d4af37]/40 shadow-[0_0_30px_rgba(212,175,55,0.15)]',
    accentGold: 'text-[#e5c158]',
    primaryText: 'text-amber-50',
    secondaryText: 'text-amber-200/70',
    envelopeColor: '#17140e',
    envelopeLining: '#382a14',
    sealColor: '#b8860b',
    sealBorder: '#ffd700',
    glowColor: 'rgba(212, 175, 55, 0.2)',
    patternType: 'tibeb',
  },
  'emerald-velvet': {
    id: 'emerald-velvet',
    name: 'Emerald Velvet & Gold',
    nameAmharic: 'የንግሥት ኤመራልድና ወርቅ',
    description: 'Deep royal emerald velvet tones combined with burnished antique gold accents.',
    badge: 'bg-emerald-950/80 text-[#edd58a] border-[#d4af37]/40',
    bgGradient: 'from-[#051812] via-[#09281f] to-[#051812]',
    cardBg: 'bg-[#09271f]/90 backdrop-blur-xl',
    cardBorder: 'border-[#d4af37]/35 shadow-[0_0_35px_rgba(212,175,55,0.15)]',
    accentGold: 'text-[#edd58a]',
    primaryText: 'text-[#fff3cb]',
    secondaryText: 'text-[#edd58a]/80',
    envelopeColor: '#07241c',
    envelopeLining: '#0f4234',
    sealColor: '#b8860b',
    sealBorder: '#edd58a',
    glowColor: 'rgba(212, 175, 55, 0.25)',
    patternType: 'tibeb',
  },
  'burgundy-luxury': {
    id: 'burgundy-luxury',
    name: 'Burgundy Rose Velvet',
    nameAmharic: 'የፍቅር ቡርጉንዲና ጽጌሬዳ',
    description: 'Passionate deep wine burgundy intertwined with rose gold and floral warmth.',
    badge: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
    bgGradient: 'from-[#1c060d] via-[#2d0a16] to-[#14040a]',
    cardBg: 'bg-[#350d1b]/85 backdrop-blur-xl',
    cardBorder: 'border-rose-400/40 shadow-[0_0_30px_rgba(244,63,94,0.15)]',
    accentGold: 'text-rose-300',
    primaryText: 'text-rose-50',
    secondaryText: 'text-rose-200/75',
    envelopeColor: '#240711',
    envelopeLining: '#4a1125',
    sealColor: '#9f1239',
    sealBorder: '#fda4af',
    glowColor: 'rgba(225, 29, 72, 0.2)',
    patternType: 'floral',
  },
  'midnight-obsidian': {
    id: 'midnight-obsidian',
    name: 'Midnight Obsidian & Platinum',
    nameAmharic: 'የሌሊት ንጋት ኦብሲዲያን',
    description: 'Ultra-modern dark aesthetic with shimmering platinum, silver, and stardust.',
    badge: 'bg-slate-900/80 text-slate-200 border-slate-500/40',
    bgGradient: 'from-[#07080c] via-[#0d1017] to-[#050608]',
    cardBg: 'bg-[#111622]/90 backdrop-blur-xl',
    cardBorder: 'border-cyan-500/30 shadow-[0_0_30px_rgba(56,189,248,0.12)]',
    accentGold: 'text-cyan-300',
    primaryText: 'text-slate-100',
    secondaryText: 'text-slate-300/75',
    envelopeColor: '#090c12',
    envelopeLining: '#1b2233',
    sealColor: '#334155',
    sealBorder: '#94a3b8',
    glowColor: 'rgba(56, 189, 248, 0.15)',
    patternType: 'geometric',
  },
  'champagne-pearl': {
    id: 'champagne-pearl',
    name: 'Champagne Pearl & Silk',
    nameAmharic: 'የሉልና ሻምፓኝ ሐር',
    description: 'Soft ethereal champagne tones, warm candlelit pearl, and refined modern typography.',
    badge: 'bg-stone-900/80 text-amber-200 border-amber-300/40',
    bgGradient: 'from-[#141210] via-[#201c18] to-[#12100e]',
    cardBg: 'bg-[#26211c]/85 backdrop-blur-xl',
    cardBorder: 'border-[#ebd896]/40 shadow-[0_0_30px_rgba(235,216,150,0.15)]',
    accentGold: 'text-[#f5e2a3]',
    primaryText: 'text-stone-100',
    secondaryText: 'text-stone-300/75',
    envelopeColor: '#1c1712',
    envelopeLining: '#3d3226',
    sealColor: '#c29b38',
    sealBorder: '#fae392',
    glowColor: 'rgba(235, 216, 150, 0.2)',
    patternType: 'minimal',
  },
};
