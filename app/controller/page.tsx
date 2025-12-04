'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Wifi, WifiOff, ChevronLeft, Lock, Loader2 } from 'lucide-react';
import { backgrounds, categories, getBackgroundsByCategory } from '../background';

const POLL_INTERVAL = 2000;
const PASSWORD = '12345';

// Skeleton component for loading states
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded ${className}`} />
);

// Image with loading state
const LoadingImage = ({ 
  src, 
  alt, 
  className = '',
  containerClassName = ''
}: { 
  src: string; 
  alt: string; 
  className?: string;
  containerClassName?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${containerClassName}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-white/50 text-xs">Failed to load</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default function Controller() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedBg, setSelectedBg] = useState(backgrounds[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingInitial, setIsFetchingInitial] = useState(true);
  const [updatingBgId, setUpdatingBgId] = useState<string | null>(null);
  
  const isUpdatingRef = useRef(false);
  const selectedBgRef = useRef(selectedBg);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const bgRotationRef = useRef<NodeJS.Timeout | null>(null);
  
  const bgImages = [
    '/backgroundimage-1.jpg',
    '/backgroundimage-2.jpg'
  ];

  // Keep ref in sync with state
  useEffect(() => {
    selectedBgRef.current = selectedBg;
  }, [selectedBg]);

  // Check authentication on mount
  useEffect(() => {
    // Small delay to prevent flash
    const timer = setTimeout(() => {
      const savedAuth = sessionStorage.getItem('controller-auth');
      setIsAuthenticated(savedAuth === 'true');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      sessionStorage.setItem('controller-auth', 'true');
    } else {
      setPasswordError(true);
      setPassword('');
    }
    setIsSubmitting(false);
  };

  // Preload background images
  useEffect(() => {
    if (!isAuthenticated) return;

    let loadedCount = 0;
    const totalImages = bgImages.length;
    let isCancelled = false;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= totalImages && !isCancelled) {
        setIsLoading(false);
      }
    };

    bgImages.forEach((src) => {
      const img = new Image();
      img.onload = checkComplete;
      img.onerror = checkComplete;
      img.src = src;
    });

    const timeout = setTimeout(() => {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [isAuthenticated]);

  // Fetch background from API
  const fetchBackground = useCallback(async (isInitial = false) => {
    if (isUpdatingRef.current) return;
    
    try {
      const response = await fetch('/api/background', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.backgroundId && data.backgroundId !== selectedBgRef.current) {
          setSelectedBg(data.backgroundId);
        }
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch background:', error);
      setIsConnected(false);
    } finally {
      if (isInitial) {
        setIsFetchingInitial(false);
      }
    }
  }, []);

  // Polling for background sync
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    // Initial fetch
    fetchBackground(true);

    // Set up polling
    pollingRef.current = setInterval(() => fetchBackground(false), POLL_INTERVAL);
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isAuthenticated, isLoading, fetchBackground]);

  // Background image rotation
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    bgRotationRef.current = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    
    return () => {
      if (bgRotationRef.current) {
        clearInterval(bgRotationRef.current);
        bgRotationRef.current = null;
      }
    };
  }, [isAuthenticated, isLoading, bgImages.length]);

  const handleBackgroundSelect = useCallback(async (bgId: string) => {
    if (isUpdatingRef.current || bgId === selectedBgRef.current) return;
    
    // Set updating flag
    isUpdatingRef.current = true;
    setIsUpdating(true);
    setUpdatingBgId(bgId);
    
    // Optimistic update
    setSelectedBg(bgId);
    
    try {
      const response = await fetch('/api/background', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ backgroundId: bgId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update');
      }
      
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to set background:', error);
      setIsConnected(false);
      // Revert on error
      await fetchBackground();
    } finally {
      setIsUpdating(false);
      setUpdatingBgId(null);
      // Small delay before allowing next update
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 300);
    }
  }, [fetchBackground]);

  const handleLock = useCallback(() => {
    sessionStorage.removeItem('controller-auth');
    setIsAuthenticated(false);
    setPassword('');
  }, []);

  const currentBg = backgrounds.find(bg => bg.id === selectedBg);
  const categoryBackgrounds = selectedCategory ? getBackgroundsByCategory(selectedCategory) : [];
  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name;

  // Initial auth check loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

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
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 ${
                  passwordError ? 'border-red-500 animate-shake' : 'border-white/20'
                }`}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-2">Incorrect password. Please try again.</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="w-full py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Unlocking...
                </>
              ) : (
                'Unlock Controller'
              )}
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
      </div>
    );
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading assets...</p>
          <p className="text-white/40 text-xs mt-2">Preparing your experience</p>
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
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <button
                onClick={handleLock}
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
              {isFetchingInitial && (
                <Loader2 className="w-4 h-4 text-white/50 animate-spin ml-2" />
              )}
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-2xl">
              <div className="relative w-full aspect-video bg-black">
                {isFetchingInitial ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 text-white/50 animate-spin mx-auto mb-2" />
                      <p className="text-white/50 text-sm">Loading display...</p>
                    </div>
                  </div>
                ) : currentBg?.type === 'video' ? (
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
                  <LoadingImage
                    src={currentBg.src || ''}
                    alt={currentBg.name}
                    className="w-full h-full object-contain"
                    containerClassName="w-full h-full"
                  />
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{ background: currentBg?.style }}
                  />
                )}
                
                {/* Updating overlay */}
                {isUpdating && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                      <p className="text-white text-sm">Updating display...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-black/40 backdrop-blur-sm border-t border-white/10 flex items-center justify-between">
                <p className="font-medium text-white">{currentBg?.name}</p>
                {isUpdating && (
                  <span className="text-white/50 text-sm flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Syncing...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Selection Area */}
          {selectedCategory === null ? (
            <>
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
                          <LoadingImage
                            src={firstBg.src || ''}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            containerClassName="w-full h-full"
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
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Movies</span>
                </button>
                <h2 className="text-lg font-semibold text-white">{selectedCategoryName}</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categoryBackgrounds.map((bg) => {
                  const isSelected = selectedBg === bg.id;
                  const isThisUpdating = updatingBgId === bg.id;
                  
                  return (
                    <button
                      key={bg.id}
                      onClick={() => handleBackgroundSelect(bg.id)}
                      disabled={isUpdating}
                      className={`group relative rounded-lg overflow-hidden transition-all active:scale-[0.98] ${
                        isSelected 
                          ? 'ring-2 ring-white shadow-2xl shadow-white/20' 
                          : 'ring-1 ring-white/30 hover:ring-white/60'
                      } ${isUpdating && !isThisUpdating ? 'opacity-50' : ''}`}
                    >
                      <div className="relative w-full aspect-video bg-black">
                        <LoadingImage
                          src={bg.src || ''}
                          alt={bg.name}
                          className="w-full h-full object-cover"
                          containerClassName="w-full h-full"
                        />
                        
                        {/* Selected overlay */}
                        {isSelected && !isThisUpdating && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white rounded-full p-2">
                              <Check className="w-6 h-6 text-gray-900" />
                            </div>
                          </div>
                        )}
                        
                        {/* Loading overlay for this specific item */}
                        {isThisUpdating && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                              <p className="text-white text-xs mt-2">Applying...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="px-3 py-2 bg-black/60 backdrop-blur-sm border-t border-white/10 flex items-center justify-between">
                        <p className="text-sm font-medium text-white truncate">{bg.name}</p>
                        {isThisUpdating && (
                          <Loader2 className="w-3 h-3 text-white/50 animate-spin flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Global updating toast */}
      {isUpdating && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 flex items-center gap-3 shadow-2xl">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
            <span className="text-white text-sm font-medium">Updating display...</span>
          </div>
        </div>
      )}
    </div>
  );
}