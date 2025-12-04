'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { backgrounds } from '../background';

const POLL_INTERVAL = 500;

export default function Display() {
  const [selectedBg, setSelectedBg] = useState<string | null>(null);
  const [displayedBg, setDisplayedBg] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const selectedBgRef = useRef<string | null>(null);
  const loadedImagesRef = useRef<Set<string>>(new Set());
  const isPreloadingRef = useRef(false);

  // Preload an image and return a promise
  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImagesRef.current.has(src)) {
        resolve();
        return;
      }
      const img = new Image();
      img.onload = () => {
        loadedImagesRef.current.add(src);
        resolve();
      };
      img.onerror = () => {
        // Still resolve to prevent blocking
        resolve();
      };
      img.src = src;
    });
  }, []);

  // Handle background change with preloading
  const handleBackgroundChange = useCallback(async (bgId: string) => {
    if (isPreloadingRef.current) return;
    
    const newBg = backgrounds.find(bg => bg.id === bgId);
    if (!newBg) return;

    isPreloadingRef.current = true;

    if (newBg.type === 'image' && newBg.src) {
      // Start fade out
      setIsTransitioning(true);
      
      // Preload the image
      await preloadImage(newBg.src);
      
      // Small delay for fade out to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Switch background
      setDisplayedBg(bgId);
      
      // Small delay then fade in
      await new Promise(resolve => setTimeout(resolve, 50));
      setIsTransitioning(false);
    } else {
      // For non-image types (video, gradient)
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setDisplayedBg(bgId);
      await new Promise(resolve => setTimeout(resolve, 50));
      setIsTransitioning(false);
    }

    isPreloadingRef.current = false;
  }, [preloadImage]);

  // Initial load - preload first image
  useEffect(() => {
    const initializeDisplay = async () => {
      const initialBg = backgrounds[0];
      if (initialBg?.type === 'image' && initialBg.src) {
        await preloadImage(initialBg.src);
      }
      setSelectedBg(initialBg.id);
      setDisplayedBg(initialBg.id);
      selectedBgRef.current = initialBg.id;
    };

    initializeDisplay();
  }, [preloadImage]);

  // Polling for background changes
  useEffect(() => {
    // Don't start polling until initial load is complete
    if (displayedBg === null) return;

    const fetchBackground = async () => {
      try {
        const response = await fetch('/api/background');
        if (response.ok) {
          const data = await response.json();
          if (data.backgroundId && data.backgroundId !== selectedBgRef.current) {
            selectedBgRef.current = data.backgroundId;
            setSelectedBg(data.backgroundId);
            handleBackgroundChange(data.backgroundId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch background:', error);
      }
    };

    const interval = setInterval(fetchBackground, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [displayedBg, handleBackgroundChange]);

  const currentBg = displayedBg ? backgrounds.find(bg => bg.id === displayedBg) : null;

  // Show black screen while initial image loads
  if (!currentBg) {
    return <div className="w-screen h-screen bg-black" />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {currentBg.type === 'video' ? (
          <video
            key={currentBg.src}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
          >
            <source src={currentBg.src} type="video/mp4" />
          </video>
        ) : currentBg.type === 'image' ? (
          <img
            key={currentBg.src}
            src={currentBg.src}
            alt={currentBg.name}
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ background: currentBg.style }}
          />
        )}
      </div>
    </div>
  );
}