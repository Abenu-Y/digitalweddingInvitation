'use client';

import React, { useEffect, Suspense } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { AudioPlayer } from '@/components/common/AudioPlayer';
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

function CelebrateContent() {
  const { setHasFullAccess, activeTheme, weddingData } = useWedding();

  useEffect(() => {
    setHasFullAccess(true);
  }, [setHasFullAccess]);

  return (
    <main
      className={`min-h-screen bg-gradient-to-b ${activeTheme.bgGradient} transition-colors duration-700 relative`}
    >
      {/* Royal 3D Wax Seal Envelope Entrance Overlay */}
      <WaxSealEnvelope />

      {/* Background Audio Player */}
      <AudioPlayer />

      {/* 1. Grand Hero Section */}
      <HeroSection />

      {/* 2. Interactive Single Story Card */}
      <ScrollLockedStoryCard />

      {/* 3. Bold Countdown */}
      <BoldScrollCountdown targetDateIso={weddingData.weddingDate} />

      {/* 4. Complete Program of the Day (Lunch + Church) */}
      <ScheduleTimeline />

      {/* 5. Venues (Akaki Reception + Lideta Mekane Yesus Church) */}
      <VenuesSection />

      {weddingData.showLoveStory && <LoveStorySection />}
      {weddingData.showGallery && <PhotoGallery />}

      <RsvpSection />
      <WishesWall />
      <Footer />
    </main>
  );
}

export default function CelebratePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090b10] flex items-center justify-center text-amber-200">
          Loading Royal Invitation...
        </div>
      }
    >
      <CelebrateContent />
    </Suspense>
  );
}

