import Link from 'next/link';
import Image from 'next/image';
import { Camera, Monitor, Sparkles, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Golden decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-400/20 to-transparent rounded-full blur-3xl" />
      
      {/* Left side decorative stars */}
      <div className="absolute left-8 top-1/4 opacity-30">
        <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
      </div>
      <div className="absolute left-16 top-1/3 opacity-20">
        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
      </div>
      <div className="absolute left-12 bottom-1/3 opacity-25">
        <Sparkles className="w-16 h-16 text-yellow-400" />
      </div>
      
      {/* Right side decorative stars */}
      <div className="absolute right-8 top-1/3 opacity-30">
        <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
      </div>
      <div className="absolute right-16 top-1/4 opacity-20">
        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
      </div>
      <div className="absolute right-12 bottom-1/4 opacity-25">
        <Sparkles className="w-16 h-16 text-yellow-400" />
      </div>

      {/* Golden accent lines */}
      <div className="absolute left-0 top-1/2 w-32 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent" />
      <div className="absolute right-0 top-1/2 w-32 h-0.5 bg-gradient-to-l from-yellow-400 to-transparent" />

      <div className="max-w-7xl w-full relative z-10">
        {/* Logos Section - Bigger and more prominent */}
        <div className="flex items-center justify-center gap-16 mb-12 flex-wrap">
          {/* Prometheus Productions logo */}
          <div className="w-80 transform hover:scale-105 transition-transform duration-300">
            <Image 
              src="/logos/Prometheus_logo.png" 
              alt="Prometheus Productions" 
              width={500} 
              height={150}
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
          
          {/* Interstellar Gala logo */}
          <div className="w-[500px] transform hover:scale-105 transition-transform duration-300">
            <Image 
              src="/logos/Interstellar_logo.png" 
              alt="Interstellar Gala 2025" 
              width={700} 
              height={210}
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            LED Wall Photo Booth
          </h1>
          <p className="text-2xl text-gray-400 font-light tracking-wide">Select your interface</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <Link
            href="/controller"
            className="group relative bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 hover:from-yellow-400/20 hover:to-yellow-600/20 border-2 border-yellow-400/50 hover:border-yellow-400 text-white rounded-3xl p-20 transition-all duration-300 flex flex-col items-center text-center shadow-2xl hover:shadow-yellow-400/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-400/5 group-hover:from-yellow-400/10 group-hover:to-yellow-400/20 transition-all duration-300" />
            <Camera className="w-28 h-28 mb-8 text-yellow-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-4xl font-bold mb-4 relative z-10 text-yellow-400">Controller</h2>
            <p className="text-gray-400 text-lg relative z-10">Select backgrounds</p>
          </Link>

          <Link
            href="/display"
            className="group relative bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 hover:from-yellow-400/20 hover:to-yellow-600/20 border-2 border-yellow-400/50 hover:border-yellow-400 text-white rounded-3xl p-20 transition-all duration-300 flex flex-col items-center text-center shadow-2xl hover:shadow-yellow-400/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-400/5 group-hover:from-yellow-400/10 group-hover:to-yellow-400/20 transition-all duration-300" />
            <Monitor className="w-28 h-28 mb-8 text-yellow-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-4xl font-bold mb-4 relative z-10 text-yellow-400">Display</h2>
            <p className="text-gray-400 text-lg relative z-10">Fullscreen for OBS</p>
          </Link>
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-yellow-400/10 via-yellow-400/5 to-yellow-400/10 rounded-2xl max-w-5xl mx-auto border border-yellow-400/30 backdrop-blur-sm">
          <p className="text-gray-300 leading-relaxed text-center text-lg">
            <strong className="text-yellow-400">Setup:</strong> Open Controller on your device, open Display in another window (fullscreen), 
            then capture Display window in OBS.
          </p>
        </div>
      </div>
    </div>
  );
}