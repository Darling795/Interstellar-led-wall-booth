'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Monitor } from 'lucide-react';

export default function Home() {
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [
    '/backgroundimage-1.jpg',
    '/backgroundimage-2.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Images - PROPER CROSSFADE */}
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <div
            key={bg}
            className="absolute inset-0"
            style={{
              opacity: index === currentBg ? 1 : 0,
              transition: 'opacity 1000ms ease-in-out',
              zIndex: index === currentBg ? 1 : 0
            }}
          >
            <img
              src={bg}
              alt="Background"
              className="w-full h-full object-cover"
            />
            {/* Gray overlay */}
            <div className="absolute inset-0 bg-gray-900/85" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header with Logos */}
        <div className="w-full py-8 px-8 bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-start gap-16">
            <img 
              src="/logos/Prometheus_logo.png" 
              alt="Prometheus Productions" 
              className="h-24 w-auto"
            />
            <img 
              src="/logos/Interstellar_logo.png" 
              alt="Interstellar Gala 2025" 
              className="h-28 w-auto"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              LED Wall Photo Booth
            </h1>
            <p className="text-xl text-gray-300 mb-16 drop-shadow-lg">
              Select your interface
            </p>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
              {/* Controller Card */}
              <Link href="/controller">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 rounded-xl p-16 transition-all duration-200 cursor-pointer shadow-2xl">
                  <Camera className="w-24 h-24 mx-auto mb-6 text-white" />
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Controller
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Select backgrounds
                  </p>
                </div>
              </Link>

              {/* Display Card */}
              <Link href="/display">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 rounded-xl p-16 transition-all duration-200 cursor-pointer shadow-2xl">
                  <Monitor className="w-24 h-24 mx-auto mb-6 text-white" />
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Display
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Fullscreen for OBS
                  </p>
                </div>
              </Link>
            </div>

            {/* Instructions */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-lg p-6">
                <p className="text-gray-200 leading-relaxed">
                  <strong className="text-white">Setup:</strong> Open Controller to select backgrounds. Open Display in another window (press F11), then capture it in OBS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}