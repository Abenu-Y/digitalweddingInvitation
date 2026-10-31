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
  submitRsvpByName: (rsvp: {
    name: string;
    phone?: string;
    status?: 'attending' | 'declined';
    attendingCount?: number;
    notes?: string;
  }) => Promise<{ success: boolean; source: string; rsvp: any }>;
  
  // Wishes Wall
  addWish: (guestName: string, message: string) => void;
  updateWish: (id: string, updates: Partial<WishMessage>) => void;
  likeWish: (wishId: string) => void;
  toggleApproveWish: (wishId: string) => void;
  deleteWish: (wishId: string) => void;
  
  // Database Status
  mongoStatus: { connected: boolean; latencyMs: number; database: string; error?: string } | null;

  // Reset & Code Synchronization
  resetToDefault: () => void;
  forceSyncCodeDefaults: () => void;
}

const LOCAL_STORAGE_KEY = 'yene_serg_wedding_data_v2';
const LEGACY_STORAGE_KEY = 'yene_serg_wedding_data_v1';

// Helper to compute a signature of the current code defaults
export const computeWeddingDataSignature = (data: WeddingData): string => {
  return [
    data.dataVersion ?? 2,
    data.groomName,
    data.brideName,
    data.groomFullName,
    data.brideFullName,
    data.weddingDate,
    data.weddingLocationCity,
    data.backgroundMusicTitle,
    data.storyCardDurationSeconds,
    data.storyCardTransitionDuration,
    data.bankAccounts?.map((b) => `${b.id}:${b.accountName}:${b.accountNumber}`).join('|'),
  ].join(':::');
};

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weddingData, setWeddingData] = useState<WeddingData>(initialWeddingData);
  const [activeGuestSlug, setActiveGuestSlug] = useState<string | null>(null);
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId | null>(null);
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [mongoStatus, setMongoStatus] = useState<{
    connected: boolean;
    latencyMs: number;
    database: string;
    error?: string;
  } | null>(null);

  // Background SWR fetch from MongoDB (Status & Wishes)
  useEffect(() => {
    // 1. Live status check
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data?.status) {
          setMongoStatus(data.status);
        }
      })
      .catch((err) => {
        console.warn('MongoDB status check fallback:', err);
      });

    // 2. Fetch fresh wishes from MongoDB
    fetch('/api/wishes')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.wishes)) {
          // Remove any legacy mock/sample wishes
          const cleanWishes = data.wishes.filter(
            (w: WishMessage) =>
              !['w-1', 'w-2', 'w-3'].includes(w.id) &&
              w.guestName !== 'Dr. Dawit Solomon' &&
              w.guestName !== 'Ato Yohannes Bekele' &&
              w.guestName !== 'Samuel Kebede' &&
              !w.message?.includes('Abebe & Selamawit')
          );
          setWeddingData((prev) => {
            const updated = {
              ...prev,
              wishes: cleanWishes,
            };
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      })
      .catch((err) => {
        console.warn('Wishes fetch fallback:', err);
      });

    // 3. Fetch fresh RSVPs from MongoDB in background
    fetch('/api/rsvp')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.rsvps) && data.rsvps.length > 0) {
          setWeddingData((prev) => {
            const guestMap = new Map(prev.guests.map((g) => [g.name.toLowerCase().trim(), g]));
            data.rsvps.forEach((r: any) => {
              const key = String(r.name || '').toLowerCase().trim();
              if (guestMap.has(key)) {
                const existing = guestMap.get(key)!;
                guestMap.set(key, {
                  ...existing,
                  rsvpStatus: r.status,
                  phone: r.phone || existing.phone,
                  notes: r.notes || existing.notes,
                  rsvpUpdatedAt: r.createdAt,
                });
              } else {
                guestMap.set(key, {
                  id: r.id || `guest-${Date.now()}`,
                  slug: key.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `guest-${Date.now()}`,
                  name: r.name,
                  phone: r.phone,
                  group: 'Special Guests',
                  allowedPlusOnes: Math.max(0, (r.attendingCount || 1) - 1),
                  attendingPlusOnes: Math.max(0, (r.attendingCount || 1) - 1),
                  useCustomMessage: false,
                  themeId: 'habesha-gold',
                  invitedEvents: ['church'],
                  rsvpStatus: r.status,
                  notes: r.notes,
                  rsvpUpdatedAt: r.createdAt,
                });
              }
            });
            const updated = { ...prev, guests: Array.from(guestMap.values()) };
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      })
      .catch((err) => {
        console.warn('RSVP fetch fallback:', err);
      });
  }, []);

  // Helper to remove any legacy sample wishes from cached state
  const filterOutSampleWishes = (wishesList: WishMessage[]): WishMessage[] => {
    if (!Array.isArray(wishesList)) return [];
    return wishesList.filter(
      (w) =>
        !['w-1', 'w-2', 'w-3'].includes(w.id) &&
        w.guestName !== 'Dr. Dawit Solomon' &&
        w.guestName !== 'Ato Yohannes Bekele' &&
        w.guestName !== 'Samuel Kebede' &&
        !w.message?.includes('Abebe & Selamawit')
    );
  };

  // Load from local storage with automated code update detection & migration
  useEffect(() => {
    try {
      const currentSignature = computeWeddingDataSignature(initialWeddingData);
      
      // Check if URL has ?reset=true or ?refresh=1 to forcefully reload fresh code
      const isResetRequested =
        typeof window !== 'undefined' &&
        (window.location.search.includes('reset=true') ||
          window.location.search.includes('refresh=1') ||
          window.location.search.includes('clear=1'));

      if (isResetRequested) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        const freshData: WeddingData = {
          ...initialWeddingData,
          wishes: [],
          _contentSignature: currentSignature,
          dataVersion: initialWeddingData.dataVersion ?? 3,
        };
        setWeddingData(freshData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshData));
        setIsInitialized(true);
        return;
      }

      // Check current v2/v3 storage, or fallback to legacy v1 storage
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        // Check if code defaults were updated, or legacy placeholder name was stored
        const isCodeUpdated =
          !parsed._contentSignature ||
          parsed._contentSignature !== currentSignature ||
          (parsed.dataVersion ?? 1) < (initialWeddingData.dataVersion ?? 3) ||
          parsed.brideName === 'Jerusalem' ||
          parsed.groomName === 'Abebe';

        const cleanedWishes = filterOutSampleWishes(parsed.wishes || []);

        if (isCodeUpdated) {
          // Code has new updates
          const syncedData: WeddingData = {
            ...parsed,
            ...initialWeddingData,
            guests: parsed.guests && parsed.guests.length > 0 ? parsed.guests : initialWeddingData.guests,
            wishes: cleanedWishes,
            adminPasscode: parsed.adminPasscode || initialWeddingData.adminPasscode,
            defaultTheme: parsed.defaultTheme || initialWeddingData.defaultTheme,
            _contentSignature: currentSignature,
            dataVersion: initialWeddingData.dataVersion ?? 3,
          };

          setWeddingData(syncedData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncedData));
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        } else {
          // Data is already up-to-date with code
          setWeddingData({
            ...initialWeddingData,
            ...parsed,
            wishes: cleanedWishes,
            _contentSignature: currentSignature,
          });
        }
      } else {
        // First visit
        const freshData: WeddingData = {
          ...initialWeddingData,
          wishes: [],
          _contentSignature: currentSignature,
          dataVersion: initialWeddingData.dataVersion ?? 3,
        };
        setWeddingData(freshData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshData));
      }
    } catch (e) {
      console.error('Failed to parse wedding data from localStorage:', e);
      setWeddingData(initialWeddingData);
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
    previewThemeId || currentGuest?.themeId || weddingData.defaultTheme || 'habesha-gold';
  const activeTheme: ThemeConfig = THEME_CONFIGS[activeThemeId] || THEME_CONFIGS['habesha-gold'];

  const setDefaultTheme = (themeId: ThemeId) => {
    setPreviewThemeId(null);
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

  const submitRsvpByName = async (rsvp: {
    name: string;
    phone?: string;
    status?: 'attending' | 'declined';
    attendingCount?: number;
    notes?: string;
  }) => {
    const cleanName = rsvp.name.trim();
    if (!cleanName) {
      return { success: false, source: 'validation', rsvp: null };
    }

    const rsvpStatus = rsvp.status === 'declined' ? 'declined' : 'attending';
    const count = Math.max(1, Number(rsvp.attendingCount || 1));
    const rsvpPayload = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      phone: rsvp.phone?.trim() || '',
      status: rsvpStatus,
      attendingCount: count,
      notes: rsvp.notes?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    // 1. Instant optimistic update in local state & localStorage
    setWeddingData((prev) => {
      const guestKey = cleanName.toLowerCase();
      const existingIdx = prev.guests.findIndex((g) => g.name.toLowerCase().trim() === guestKey);
      let updatedGuests: Guest[];

      if (existingIdx >= 0) {
        updatedGuests = prev.guests.map((g, idx) =>
          idx === existingIdx
            ? {
                ...g,
                rsvpStatus,
                phone: rsvpPayload.phone || g.phone,
                attendingPlusOnes: count - 1,
                notes: rsvpPayload.notes || g.notes,
                rsvpUpdatedAt: rsvpPayload.createdAt,
              }
            : g
        );
      } else {
        const newGuest: Guest = {
          id: rsvpPayload.id,
          slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `guest-${Date.now()}`,
          name: cleanName,
          phone: rsvpPayload.phone,
          group: 'Special Guests',
          allowedPlusOnes: count - 1,
          attendingPlusOnes: count - 1,
          useCustomMessage: false,
          themeId: 'habesha-gold',
          invitedEvents: ['church', 'reception'],
          rsvpStatus,
          notes: rsvpPayload.notes,
          rsvpUpdatedAt: rsvpPayload.createdAt,
        };
        updatedGuests = [newGuest, ...prev.guests];
      }

      const updatedWeddingData = {
        ...prev,
        guests: updatedGuests,
      };

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedWeddingData));
      } catch (e) {
        console.warn('Local storage write warning:', e);
      }

      return updatedWeddingData;
    });

    // 2. Direct persistence to MongoDB via /api/rsvp
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpPayload),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('RSVP MongoDB sync error, saved locally:', err);
      return { success: true, source: 'local', rsvp: rsvpPayload };
    }
  };

  const addWish = (guestName: string, message: string) => {
    const newWish: WishMessage = {
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      guestName: guestName.trim() || 'Well-wisher (የክብር እንግዳ)',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      approved: true, // Auto-approved by default
    };

    // 1. Instant optimistic local update (0ms UI latency!)
    setWeddingData((prev) => ({
      ...prev,
      wishes: [newWish, ...prev.wishes],
    }));

    // 2. Background sync to MongoDB API
    fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWish),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.wish?.id) {
          setWeddingData((prev) => ({
            ...prev,
            wishes: prev.wishes.map((w) => (w.id === newWish.id ? data.wish : w)),
          }));
        }
      })
      .catch((err) => {
        console.warn('Wishes background POST fallback to local cache:', err);
      });
  };

  const updateWish = (id: string, updates: Partial<WishMessage>) => {
    // 1. Instant optimistic local update
    setWeddingData((prev) => ({
      ...prev,
      wishes: prev.wishes.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }));

    // 2. Background sync to MongoDB
    fetch('/api/wishes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    }).catch((err) => {
      console.warn('Wishes update fallback to local cache:', err);
    });
  };

  const likeWish = (wishId: string) => {
    let nextLikes = 1;
    setWeddingData((prev) => {
      const updated = prev.wishes.map((w) => {
        if (w.id === wishId) {
          nextLikes = w.likes + 1;
          return { ...w, likes: nextLikes };
        }
        return w;
      });
      return { ...prev, wishes: updated };
    });

    fetch('/api/wishes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: wishId, likes: nextLikes }),
    }).catch(() => {});
  };

  const toggleApproveWish = (wishId: string) => {
    let newApprovedState = true;
    setWeddingData((prev) => {
      const updated = prev.wishes.map((w) => {
        if (w.id === wishId) {
          newApprovedState = !w.approved;
          return { ...w, approved: newApprovedState };
        }
        return w;
      });
      return { ...prev, wishes: updated };
    });

    fetch('/api/wishes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: wishId, approved: newApprovedState }),
    }).catch((err) => {
      console.warn('Wishes toggleApprove fallback to local cache:', err);
    });
  };

  const deleteWish = (wishId: string) => {
    setWeddingData((prev) => ({
      ...prev,
      wishes: prev.wishes.filter((w) => w.id !== wishId),
    }));

    fetch(`/api/wishes?id=${encodeURIComponent(wishId)}`, {
      method: 'DELETE',
    }).catch((err) => {
      console.warn('Wishes delete fallback to local cache:', err);
    });
  };

  const resetToDefault = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    const fresh = {
      ...initialWeddingData,
      _contentSignature: computeWeddingDataSignature(initialWeddingData),
      dataVersion: initialWeddingData.dataVersion ?? 2,
    };
    setWeddingData(fresh);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fresh));
  };

  const forceSyncCodeDefaults = () => {
    resetToDefault();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
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
        submitRsvpByName,
        addWish,
        updateWish,
        likeWish,
        toggleApproveWish,
        deleteWish,
        mongoStatus,
        resetToDefault,
        forceSyncCodeDefaults,
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
