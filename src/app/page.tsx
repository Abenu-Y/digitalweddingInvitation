'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWedding } from '@/context/WeddingContext';
import { AudioPlayer } from '@/components/common/AudioPlayer';
import { AutoScrollController } from '@/components/common/AutoScrollController';
import { WaxSealEnvelope } from '@/components/envelope/WaxSealEnvelope';
import { HeroSection } from '@/components/hero/HeroSection';
import { ScrollLockedStoryCard } from '@/components/showcase/ScrollLockedStoryCard';
import { BoldScrollCountdown } from '@/components/countdown/BoldScrollCountdown';
import { ScheduleTimeline } from '@/components/schedule/ScheduleTimeline';
import { VenuesSection } from '@/components/venues/VenuesSection';
import { LoveStorySection } from '@/components/story/LoveStorySection';
import { PhotoGallery } from '@/components/gallery/PhotoGallery';
import { RsvpSection } from '@/components/rsvp/RsvpSection';
import { WishesWall } from '@/components/wishes/WishesWall';
import { Footer } from '@/components/common/Footer';
import { ThemeId } from '@/types/wedding';
import { THEME_CONFIGS } from '@/styles/themes';

function WeddingContent() {
  const searchParams = useSearchParams();
  const guestParam = searchParams.get('guest');
  const themeParam = searchParams.get('theme') as ThemeId | null;
  const { setActiveGuestBySlug, setPreviewThemeId, activeTheme, weddingData } = useWedding();

  useEffect(() => {
    if (guestParam) {
      setActiveGuestBySlug(guestParam);
    }
    if (themeParam && THEME_CONFIGS[themeParam]) {
      setPreviewThemeId(themeParam);
    }
  }, [guestParam, themeParam, setActiveGuestBySlug, setPreviewThemeId]);

  return (
    <main
      className={`min-h-screen bg-gradient-to-b ${activeTheme.bgGradient} transition-colors duration-700 relative`}
    >
      {/* Royal 3D Wax Seal Envelope Entrance Overlay */}
      <WaxSealEnvelope />

      {/* Background Audio Player and Natural Auto-Scroll Controller */}
      <AudioPlayer />
      <AutoScrollController speedPixelsPerSecond={40} initialActive={true} />
      
      {/* 1. Page starts directly from the top of the Grand Hero Section (Pic 2) */}
      <HeroSection />

      {/* 2. Interactive Single Card with < > arrows that sequentially scrolls through Card 1 -> 2 -> 3 (or 3 -> 2 -> 1 when scrolling back) */}
      <ScrollLockedStoryCard />

      {/* 3. Bold, non-carousel Countdown that animates into view on scroll (Pic 4) */}
      <BoldScrollCountdown targetDateIso={weddingData.weddingDate} />

      {/* Pic 1 (PersonalizedCard), Pic 4 (DressCodeSection), and Pic 5 (GiftRegistrySection) omitted as requested */}

      <ScheduleTimeline />
      <VenuesSection />

      {/* Pic 2 & Pic 3: Only displayed if enabled by admin */}
      {weddingData.showLoveStory && <LoveStorySection />}
      {weddingData.showGallery && <PhotoGallery />}

      <RsvpSection />
      <WishesWall />
      <Footer />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090b10] flex items-center justify-center text-amber-200">Loading Royal Invitation...</div>}>
      <WeddingContent />
    </Suspense>
  );
}
