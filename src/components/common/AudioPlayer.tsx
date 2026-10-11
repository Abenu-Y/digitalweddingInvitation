'use client';

import React, { useRef, useEffect } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { Music, Pause, Play, Sparkles } from 'lucide-react';

const START_TIME_SECONDS = 40; // Starts from 40 seconds as requested

export const AudioPlayer: React.FC = () => {
  const { weddingData, isPlayingMusic, toggleMusic, setPlayingMusic } = useWedding();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const seekToStartTime = () => {
    if (audioRef.current && audioRef.current.currentTime < START_TIME_SECONDS) {
      try {
        audioRef.current.currentTime = START_TIME_SECONDS;
      } catch (e) {
        // Can fail if metadata not ready yet
      }
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlayingMusic) {
      seekToStartTime();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Audio autoplay prevented or error:', error);
          setPlayingMusic(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlayingMusic, setPlayingMusic]);

  const handleLoadedMetadata = () => {
    seekToStartTime();
  };

  const handleTimeUpdate = () => {
    // If looped back to beginning, skip directly to 40 seconds
    if (audioRef.current && audioRef.current.currentTime < START_TIME_SECONDS - 1) {
      audioRef.current.currentTime = START_TIME_SECONDS;
    }
  };

  const handleEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = START_TIME_SECONDS;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={weddingData.backgroundMusicUrl || '/G&B wedding (6).mp3'}
        loop
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Floating Mini Player Widget at Bottom Left */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center space-x-3 bg-[#111622]/90 backdrop-blur-md border border-amber-500/30 rounded-full py-2 px-4 shadow-2xl hover:border-amber-400 transition-all group">
        <button
          onClick={toggleMusic}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center shadow-lg transform transition active:scale-95 group-hover:scale-105"
        >
          {isPlayingMusic ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <div className="flex flex-col pr-2">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-medium text-amber-200 truncate max-w-[150px]">
              {weddingData.backgroundMusicTitle}
            </span>
            {isPlayingMusic && (
              <span className="flex space-x-0.5 items-end h-3">
                <span className="w-0.5 bg-amber-400 h-2 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-0.5 bg-amber-400 h-3 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-0.5 bg-amber-400 h-1.5 animate-bounce"></span>
              </span>
            )}
          </div>
          <span className="text-[9px] text-stone-400 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Wedding Symphony
          </span>
        </div>
      </div>
    </>
  );
};
