'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeddingData, Guest, ThemeId, WishMessage, ScheduleItem, VenueItem, BankAccount } from '@/types/wedding';
import { initialWeddingData } from '@/data/defaultWeddingData';
import { THEME_CONFIGS, ThemeConfig } from '@/styles/themes';

interface WeddingContextType {
  weddingData: WeddingData;
  currentGuest: Guest | null;
  activeTheme: ThemeConfig;
  previewThemeId: ThemeId | null;
  language: 'en' | 'am';
  isEnvelopeOpened: boolean;
  isPlayingMusic: boolean;
  audioRef: React.RefObject<HTMLAudioElement> | null;
  
  // Actions
  setLanguage: (lang: 'en' | 'am') => void;
  openEnvelope: () => void;
  closeEnvelope: () => void;
  toggleMusic: () => void;
  setPlayingMusic: (playing: boolean) => void;
  setActiveGuestBySlug: (slug: string | null) => void;
  setPreviewThemeId: (themeId: ThemeId | null) => void;
  setDefaultTheme: (themeId: ThemeId) => void;
  
  // Admin & Guest Updates
  updateWeddingData: (updater: Partial<WeddingData> | ((prev: WeddingData) => WeddingData)) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => Guest;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  submitGuestRsvp: (guestId: string, rsvp: {
    status: 'attending' | 'declined';
    plusOnes: number;
    dietaryRestrictions?: string;
    notes?: string;
  }) => void;
  
  // Wishes Wall
  addWish: (guestName: string, message: string) => void;
  likeWish: (wishId: string) => void;
  toggleApproveWish: (wishId: string) => void;
  deleteWish: (wishId: string) => void;
  
  // Reset
  resetToDefault: () => void;
}

const LOCAL_STORAGE_KEY = 'yene_serg_wedding_data_v1';

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weddingData, setWeddingData] = useState<WeddingData>(initialWeddingData);
  const [activeGuestSlug, setActiveGuestSlug] = useState<string | null>(null);
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId | null>(null);
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load from local storage with migration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only reset if obsolete 'Abebe' placeholder template was stored
        if (parsed.groomName === 'Abebe' || parsed.brideName === 'Selamawit') {
          setWeddingData(initialWeddingData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialWeddingData));
        } else {
          // Merge defaults with saved user edits so no custom setting is lost
          setWeddingData({
            ...initialWeddingData,
            ...parsed,
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse wedding data from localStorage:', e);
    }
    setIsInitialized(true);

    // Cross-tab real-time synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const freshData = JSON.parse(e.newValue);
          setWeddingData((prev) => ({ ...prev, ...freshData }));
        } catch (err) {
          console.error('Failed to sync storage update:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(weddingData));
      } catch (e) {
        console.error('Failed to save wedding data to localStorage:', e);
      }
    }
  }, [weddingData, isInitialized]);

  // Determine current active guest
  const currentGuest = React.useMemo(() => {
    if (!activeGuestSlug) return null;
    return (
      weddingData.guests.find(
        (g) => g.slug.toLowerCase() === activeGuestSlug.toLowerCase() || g.id === activeGuestSlug
      ) || null
    );
  }, [weddingData.guests, activeGuestSlug]);

  // Determine active theme (Preview Override -> Guest's personal theme -> Wedding default theme -> fallback)
  const activeThemeId: ThemeId =
    previewThemeId || currentGuest?.themeId || weddingData.defaultTheme || 'emerald-velvet';
  const activeTheme: ThemeConfig = THEME_CONFIGS[activeThemeId] || THEME_CONFIGS['emerald-velvet'];

  const setDefaultTheme = (themeId: ThemeId) => {
    updateWeddingData({ defaultTheme: themeId });
  };

  const openEnvelope = () => {
    setIsEnvelopeOpened(true);
    setIsPlayingMusic(true);
  };

  const closeEnvelope = () => {
    setIsEnvelopeOpened(false);
  };

  const toggleMusic = () => {
    setIsPlayingMusic((prev) => !prev);
  };

  const setActiveGuestBySlug = (slug: string | null) => {
    setActiveGuestSlug(slug);
  };

  const updateWeddingData = (updater: Partial<WeddingData> | ((prev: WeddingData) => WeddingData)) => {
    setWeddingData((prev) => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return { ...prev, ...updater };
    });
  };

  const addGuest = (guestData: Omit<Guest, 'id'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      rsvpStatus: guestData.rsvpStatus || 'pending',
      attendingPlusOnes: guestData.attendingPlusOnes ?? guestData.allowedPlusOnes,
    };
    setWeddingData((prev) => ({
      ...prev,
      guests: [newGuest, ...prev.guests],
    }));
    return newGuest;
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    setWeddingData((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  };

  const deleteGuest = (id: string) => {
    setWeddingData((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== id),
    }));
  };

  const submitGuestRsvp = (
    guestId: string,
    rsvp: {
      status: 'attending' | 'declined';
      plusOnes: number;
      dietaryRestrictions?: string;
      notes?: string;
    }
  ) => {
    setWeddingData((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => {
        if (g.id === guestId) {
          return {
            ...g,
            rsvpStatus: rsvp.status,
            attendingPlusOnes: rsvp.plusOnes,
            dietaryRestrictions: rsvp.dietaryRestrictions || g.dietaryRestrictions,
            notes: rsvp.notes || g.notes,
            rsvpUpdatedAt: new Date().toISOString(),
          };
        }
        return g;
      }),
    }));
  };

  const addWish = (guestName: string, message: string) => {
    const newWish: WishMessage = {
      id: `wish-${Date.now()}`,
      guestName: guestName.trim() || 'Well-wisher (እንግዳ)',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      approved: true, // Auto-approved by default
    };
    setWeddingData((prev) => ({
      ...prev,
      wishes: [newWish, ...prev.wishes],
    }));
  };

  const likeWish = (wishId: string) => {
    setWeddingData((prev) => ({
      ...prev,
      wishes: prev.wishes.map((w) => (w.id === wishId ? { ...w, likes: w.likes + 1 } : w)),
    }));
  };

  const toggleApproveWish = (wishId: string) => {
    setWeddingData((prev) => ({
      ...prev,
      wishes: prev.wishes.map((w) => (w.id === wishId ? { ...w, approved: !w.approved } : w)),
    }));
  };

  const deleteWish = (wishId: string) => {
    setWeddingData((prev) => ({
      ...prev,
      wishes: prev.wishes.filter((w) => w.id !== wishId),
    }));
  };

  const resetToDefault = () => {
    setWeddingData(initialWeddingData);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <WeddingContext.Provider
      value={{
        weddingData,
        currentGuest,
        activeTheme,
        previewThemeId,
        language,
        isEnvelopeOpened,
        isPlayingMusic,
        audioRef: null,
        setLanguage,
        openEnvelope,
        closeEnvelope,
        toggleMusic,
        setPlayingMusic: setIsPlayingMusic,
        setActiveGuestBySlug,
        setPreviewThemeId,
        setDefaultTheme,
        updateWeddingData,
        addGuest,
        updateGuest,
        deleteGuest,
        submitGuestRsvp,
        addWish,
        likeWish,
        toggleApproveWish,
        deleteWish,
        resetToDefault,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
