'use client';

import { useState, useEffect } from 'react';
import { backgrounds } from '../background';

const CHANNEL_NAME = 'led-wall-sync';

export default function Display() {
  const [selectedBg, setSelectedBg] = useState(backgrounds[0].id);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    
    channel.onmessage = (event) => {
      if (event.data.type === 'BACKGROUND_CHANGE') {
        setSelectedBg(event.data.backgroundId);
      }
    };

    return () => channel.close();
  }, []);

  const currentBg = backgrounds.find(bg => bg.id === selectedBg);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {currentBg?.type === 'video' ? (
        <video
          key={currentBg.src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={currentBg.src} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out"
          style={{ background: currentBg?.style }}
        />
      )}
    </div>
  );
}