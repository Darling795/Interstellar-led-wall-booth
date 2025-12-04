'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Wifi, WifiOff, ChevronLeft, Lock } from 'lucide-react';
import { backgrounds, categories, getBackgroundsByCategory } from '../background';

const POLL_INTERVAL = 2000;
const PASSWORD = '12345';

export default function Controller() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  const [selectedBg, setSelectedBg] = useState(backgrounds[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const isUpdatingRef = useRef(false);
  const isMountedRef = useRef(true);
  
  const bgImages = [
    '/backgroundimage-1.jpg',
    '/backgroundimage-2.jpg'
  ];

  // Check if already authenticated (session storage)
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('controller-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      sessionStorage.setItem('controller-auth', 'true');
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  // Preload background images
  useEffect(() => {
    if (!isAuthenticated) return;

    let loadedCount = 0;
    const totalImages = bgImages.length;

    bgImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= totalImages && isMountedRef.current) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= totalImages && isMountedRef.current) {
          setIsLoading(false);
        }
      };
      img.src = src;
    });

    // Fallback timeout in case images fail to load
    const timeout = setTimeout(() => {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isAuthenticated]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchBackground = useCallback(async () => {
    if (isUpdatingRef.current || !isMountedRef.current) return;
    
    try {
      const response = await fetch('/api/background');
      if (response.ok && isMountedRef.current) {
        const data = await response.json();
        setSelectedBg(data.backgroundId);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch background:', error);
      if (isMountedRef.current) {
        setIsConnected(false);
      }
    }
  }, []);

  // Polling for background sync
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    fetchBackground();
    const interval = setInterval(fetchBackground, POLL_INTERVAL);
    
    return () => {
      clearInterval(interval);
    };
  }, [fetchBackground, isLoading, isAuthenticated]);

  // Background image rotation
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const interval = setInterval(() => {
      if (isMountedRef.current) {
        setCurrentBgImage((prev) => (prev + 1) % bgImages.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isLoading, isAuthenticated, bgImages.length]);

  const handleBackgroundSelect = async (bgId: string) => {
    if (isUpdatingRef.current) return;
    
    // Immediately update UI
    setSelectedBg(bgId);
    setIsUpdating(true);
    isUpdatingRef.current = true;
    
    try {
      const response = await fetch('/api/background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backgroundId: bgId })
      });
      
      if (!response.ok) throw new Error('Failed to update');
      if (isMountedRef.current) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to set background:', error);
      if (isMountedRef.current) {
        setIsConnected(false);
      }
    } finally {
      if (isMountedRef.current) {
        setIsUpdating(false);
      }
      isUpdatingRef.current = false;
    }
  };

  const currentBg = backgrounds.find(bg => bg.id === selectedBg);
  const categoryBackgrounds = selectedCategory ? getBackgroundsByCategory(selectedCategory) : [];
  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name;

  // Password screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">Controller Access</h1>
          <p className="text-gray-400 text-center mb-6">Enter password to access the controller</p>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="Enter password"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all ${
                  passwordError ? 'border-red-500 shake' : 'border-white/20'
                }`}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-2">Incorrect password. Please try again.</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Unlock Controller
            </button>
          </form>
          
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm mt-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .shake {
            animation: shake 0.3s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
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
            <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <button
                onClick={() => {
                  sessionStorage.removeItem('controller-auth');
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                <Lock className="w-4 h-4" />
                Lock
              </button>
              
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Currently Displaying */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <h2 className="text-lg font-semibold text-white">Currently Displaying</h2>
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
                    className="w-full h-full object-contain"
                  >
                    <source src={currentBg.src} type="video/mp4" />
                  </video>
                ) : currentBg?.type === 'image' ? (
                  <img
                    src={currentBg.src}
                    alt={currentBg.name}
                    className="w-full h-full object-contain"
                  />
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

          {/* Selection Area */}
          {selectedCategory === null ? (
            <>
              {/* Movie Categories */}
              <h2 className="text-lg font-semibold text-white mb-4">Select Movie Theme</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const categoryBgs = getBackgroundsByCategory(category.id);
                  const firstBg = categoryBgs[0];
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="group relative rounded-lg overflow-hidden transition-all ring-1 ring-white/30 hover:ring-white/60 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="relative w-full aspect-video bg-black">
                        {firstBg?.type === 'image' && (
                          <img
                            src={firstBg.src}
                            alt={category.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                        <p className="text-base font-semibold text-white">{category.name}</p>
                        <p className="text-xs text-gray-300">{categoryBgs.length} backgrounds</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Image Selection within Category */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Movies</span>
                </button>
                <h2 className="text-lg font-semibold text-white">{selectedCategoryName}</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categoryBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => handleBackgroundSelect(bg.id)}
                    disabled={isUpdating}
                    className={`group relative rounded-lg overflow-hidden transition-all active:scale-[0.98] ${
                      selectedBg === bg.id 
                        ? 'ring-2 ring-white shadow-2xl shadow-white/20' 
                        : 'ring-1 ring-white/30 hover:ring-white/60'
                    } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <div className="relative w-full aspect-video bg-black">
                      <img
                        src={bg.src}
                        alt={bg.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      
                      {selectedBg === bg.id && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="bg-white rounded-full p-2">
                            <Check className="w-6 h-6 text-gray-900" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-3 py-2 bg-black/60 backdrop-blur-sm border-t border-white/10">
                      <p className="text-sm font-medium text-white truncate">{bg.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}