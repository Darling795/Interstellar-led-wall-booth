// ============================================
// FILE: app/controller/page.tsx
// ============================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { backgrounds } from '../background';

const CHANNEL_NAME = 'led-wall-sync';

export default function Controller() {
  const [selectedBg, setSelectedBg] = useState(backgrounds[0].id);
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const bgImages = [
    '/backgroundimage-1.jpg',
    '/backgroundimage-2.jpg'
  ];

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    
    channel.onmessage = (event) => {
      if (event.data.type === 'BACKGROUND_CHANGE') {
        setSelectedBg(event.data.backgroundId);
      }
    };

    return () => channel.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % bgImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBackgroundSelect = (bgId: string) => {
    setSelectedBg(bgId);
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: 'BACKGROUND_CHANGE', backgroundId: bgId });
    channel.close();
  };

  const currentBg = backgrounds.find(bg => bg.id === selectedBg);

  return (
    <div className="relative min-h-screen">
      {/* Background Images with Gray Overlay */}
      <div className="fixed inset-0 z-0">
        {bgImages.map((bg, index) => (
          <div
            key={bg}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBgImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={bg}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-900/90" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-16">
              <img 
                src="/logos/Prometheus_logo.png" 
                alt="Prometheus" 
                className="h-20 w-auto"
              />
              <img 
                src="/logos/Interstellar_logo.png" 
                alt="Interstellar Gala" 
                className="h-24 w-auto"
              />
            </div>
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Current Background Preview */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <h2 className="text-lg font-semibold text-white">
                Currently Displaying
              </h2>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-2xl">
              <div className="relative w-full aspect-video bg-black">
                {currentBg?.type === 'video' ? (
                  <video
                    key={currentBg.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={currentBg.src} type="video/mp4" />
                  </video>
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{ background: currentBg?.style }}
                  />
                )}
              </div>
              <div className="px-6 py-4 bg-black/40 backdrop-blur-sm border-t border-white/10">
                <p className="font-medium text-white">{currentBg?.name}</p>
              </div>
            </div>
          </div>

          {/* Background Selection Grid */}
          <h2 className="text-lg font-semibold text-white mb-4">
            Select Background
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleBackgroundSelect(bg.id)}
                className={`group relative rounded-lg overflow-hidden transition-all ${
                  selectedBg === bg.id 
                    ? 'ring-2 ring-white shadow-2xl shadow-white/20' 
                    : 'ring-1 ring-white/30 hover:ring-white/60'
                }`}
              >
                <div className="relative w-full aspect-video bg-black">
                  {bg.type === 'video' ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={bg.src} type="video/mp4" />
                    </video>
                  ) : (
                    <div 
                      className="w-full h-full"
                      style={{ background: bg.style }}
                    />
                  )}
                  
                  {selectedBg === bg.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-white rounded-full p-2">
                        <Check className="w-6 h-6 text-gray-900" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-3 py-2 bg-black/60 backdrop-blur-sm border-t border-white/10">
                  <p className="text-sm font-medium text-white truncate">
                    {bg.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}