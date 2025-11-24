// ============================================
// FILE: app/controller/page.tsx
// ============================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { backgrounds } from '../background';

const CHANNEL_NAME = 'led-wall-sync';

export default function Controller() {
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

  const handleBackgroundSelect = (bgId: string) => {
    setSelectedBg(bgId);
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: 'BACKGROUND_CHANGE', backgroundId: bgId });
    channel.close();
  };

  const currentBg = backgrounds.find(bg => bg.id === selectedBg);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logos */}
              <div className="w-32">
                <Image 
                  src="/logos/Prometheus_logo.png" 
                  alt="Prometheus" 
                  width={200} 
                  height={60}
                  className="w-full h-auto"
                />
              </div>
              <div className="w-48">
                <Image 
                  src="/logos/Interstellar_logo.png" 
                  alt="Interstellar Gala" 
                  width={400} 
                  height={100}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Current Selection */}
        <div className="bg-white rounded-xl p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-lg font-semibold text-gray-900">Current Background on Display</h2>
          </div>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
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
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-white font-medium">{currentBg?.name}</p>
            </div>
          </div>
        </div>

        {/* Background Grid */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Select Background</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {backgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => handleBackgroundSelect(bg.id)}
              className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
                selectedBg === bg.id 
                  ? 'ring-4 ring-gray-900 scale-105 shadow-xl' 
                  : 'hover:scale-105 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="relative w-full aspect-video bg-gray-900">
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
                    <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                      ACTIVE
                    </span>
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-sm font-medium">{bg.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}