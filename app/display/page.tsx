'use client';

import { useState, useEffect, useRef } from 'react';
import { backgrounds } from '../background';

const POLL_INTERVAL = 500;

export default function Display() {
  const [selectedBg, setSelectedBg] = useState(backgrounds[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const selectedBgRef = useRef(selectedBg);

  // Keep ref in sync
  useEffect(() => {
    selectedBgRef.current = selectedBg;
  }, [selectedBg]);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const response = await fetch('/api/background');
        if (response.ok) {
          const data = await response.json();
          if (data.backgroundId !== selectedBgRef.current) {
            setIsTransitioning(true);
            setTimeout(() => {
              setSelectedBg(data.backgroundId);
              setIsTransitioning(false);
            }, 300);
          }
        }
      } catch (error) {
        console.error('Failed to fetch background:', error);
      }
    };

    fetchBackground();
    const interval = setInterval(fetchBackground, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const currentBg = backgrounds.find(bg => bg.id === selectedBg);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {currentBg?.type === 'video' ? (
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
        ) : currentBg?.type === 'image' ? (
          <img
            key={currentBg.src}
            src={currentBg.src}
            alt={currentBg.name}
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ background: currentBg?.style }}
          />
        )}
      </div>
    </div>
  );
}