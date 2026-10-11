'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useWedding } from '@/context/WeddingContext';
import { AudioPlayer } from '@/components/common/AudioPlayer';
import { AutoScrollController } from '@/components/common/AutoScrollController';
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

export default function InviteGuestPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { setActiveGuestBySlug, activeTheme, weddingData } = useWedding();

  useEffect(() => {
    if (slug) {
      setActiveGuestBySlug(slug);
    }
  }, [slug, setActiveGuestBySlug]);

  return (
    <main
      className={`min-h-screen bg-gradient-to-b ${activeTheme.bgGradient} transition-colors duration-700 relative`}
    >
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
