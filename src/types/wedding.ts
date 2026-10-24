export type ThemeId = 
  | 'habesha-gold' 
  | 'emerald-velvet' 
  | 'burgundy-luxury' 
  | 'midnight-obsidian' 
  | 'champagne-pearl';

export type EventType = 
  | 'church' 
  | 'reception' 
  | 'melse' 
  | 'kebero' 
  | 'afterparty';

export interface EventDetail {
  id: EventType;
  title: string;
  titleAmharic: string;
  time: string;
  locationName: string;
  address: string;
  description: string;
  iconName: string;
}

export interface Guest {
  id: string;
  slug: string;
  name: string;
  nameAmharic?: string;
  phone?: string;
  email?: string;
  group: 'Bride Family' | 'Groom Family' | 'VIP Guests' | 'Friends' | 'Colleagues' | 'Special Guests';
  allowedPlusOnes: number;
  tableNumber?: string;
  // Personalization requirements
  useCustomMessage: boolean;
  customMessage?: string;
  customMessageAmharic?: string;
  themeId: ThemeId; // Per-guest custom theme
  invitedEvents: EventType[]; // Specific events this guest is invited to
  // RSVP State
  rsvpStatus: 'attending' | 'declined' | 'pending';
  attendingPlusOnes: number;
  dietaryRestrictions?: string;
  notes?: string;
  rsvpUpdatedAt?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  titleAmharic: string;
  description: string;
  location: string;
  icon: string;
  eventType: EventType;
}

export interface VenueItem {
  id: string;
  name: string;
  nameAmharic: string;
  tag: string; // e.g. "Holy Matrimony" or "Grand Reception"
  address: string;
  time: string;
  imageUrl: string;
  googleMapsUrl: string;
  coordinates?: { lat: number; lng: number };
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  logoType: 'telebirr' | 'cbe' | 'awash' | 'abyssinia' | 'zemen' | 'other';
  qrImageUrl?: string;
  branch?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category: 'prewedding' | 'ceremony' | 'cultural' | 'story';
}

export interface LoveStoryMilestone {
  id: string;
  year: string;
  title: string;
  titleAmharic: string;
  description: string;
  imageUrl?: string;
}

export interface WishMessage {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
  likes: number;
  approved: boolean;
}

export interface WeddingData {
  groomName: string;
  groomNameAmharic: string;
  groomFullName: string;
  groomFullNameAmharic: string;
  groomParents: string;
  
  brideName: string;
  brideNameAmharic: string;
  brideFullName: string;
  brideFullNameAmharic: string;
  brideParents: string;

  weddingDate: string; // ISO date string e.g. "2026-11-20T14:00:00"
  weddingDateAmharic: string;
  weddingLocationCity: string;
  
  religiousQuote: string;
  religiousQuoteAmharic: string;
  quoteSource: string;

  globalInvitationMessage: string;
  globalInvitationMessageAmharic: string;

  defaultTheme: ThemeId;
  backgroundMusicUrl: string;
  backgroundMusicTitle: string;
  
  heroImageUrl: string;
  coupleAvatarUrl: string;

  dressCode: {
    title: string;
    titleAmharic: string;
    description: string;
    colors: { name: string; hex: string }[];
    guidelines: string[];
  };

  schedule: ScheduleItem[];
  venues: VenueItem[];
  bankAccounts: BankAccount[];
  gallery: GalleryPhoto[];
  loveStory: LoveStoryMilestone[];
  guests: Guest[];
  wishes: WishMessage[];
  showLoveStory?: boolean;
  showGallery?: boolean;
  autoScrollSpeed?: number;
  adminPasscode?: string;
  storyCardDurationSeconds?: number;
  storyCardScrollHeightVh?: number;
  storyCardTransitionDuration?: number;
  storyCardAutoAdvance?: boolean;
  storyCardPauseOnHover?: boolean;
  dataVersion?: number;
  _contentSignature?: string;
}
