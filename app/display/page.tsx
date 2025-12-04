'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { backgrounds } from '../background';

const POLL_INTERVAL = 500;

export default function Display() {
  const [currentBgId, setCurrentBgId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  const currentBgIdRef = useRef<string | null>(null);
  const isTransitioningRef = useRef(false);
  const loadedImagesRef = useRef<Set<string>>(new Set());
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  // Preload an image with progress
  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve) => {
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
        resolve();
      };
      img.src = src;
    });
  }, []);

  // Switch to new background with transition
  const switchBackground = useCallback(async (newBgId: string) => {
    if (isTransitioningRef.current) return;
    if (newBgId === currentBgIdRef.current) return;
    
    const newBg = backgrounds.find(bg => bg.id === newBgId);
    if (!newBg) return;

    isTransitioningRef.current = true;
    
    // Preload if it's an image
    if (newBg.type === 'image' && newBg.src) {
      await preloadImage(newBg.src);
    }

    // Start transition
    setIsTransitioning(true);
    
    // Wait for fade out
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Switch background
    setCurrentBgId(newBgId);
    currentBgIdRef.current = newBgId;
    
    // Wait a frame then fade in
    await new Promise(resolve => setTimeout(resolve, 50));
    setIsTransitioning(false);
    
    isTransitioningRef.current = false;
  }, [preloadImage]);

  // Fetch current background from API
  const fetchBackground = useCallback(async () => {
    if (isTransitioningRef.current) return;
    
    try {
      const response = await fetch('/api/background', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.backgroundId && data.backgroundId !== currentBgIdRef.current) {
          switchBackground(data.backgroundId);
        }
        setConnectionStatus('connected');
        retryCountRef.current = 0;
      }
    } catch (error) {
      console.error('Failed to fetch background:', error);
      retryCountRef.current++;
      if (retryCountRef.current > 5) {
        setConnectionStatus('error');
      }
    }
  }, [switchBackground]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      setLoadingProgress(10);
      
      const initialBg = backgrounds[0];
      
      // Preload first image
      if (initialBg.type === 'image' && initialBg.src) {
        setLoadingProgress(30);
        await preloadImage(initialBg.src);
      }
      
      setLoadingProgress(50);
      
      // Fetch current background from API
      try {
        setConnectionStatus('connecting');
        const response = await fetch('/api/background', {
          cache: 'no-store',
        });
        
        setLoadingProgress(70);
        
        if (response.ok) {
          const data = await response.json();
          const bgId = data.backgroundId || initialBg.id;
          const bg = backgrounds.find(b => b.id === bgId);
          
          // Preload the actual current background
          if (bg?.type === 'image' && bg.src) {
            setLoadingProgress(85);
            await preloadImage(bg.src);
          }
          
          setLoadingProgress(100);
          setCurrentBgId(bgId);
          currentBgIdRef.current = bgId;
          setConnectionStatus('connected');
        } else {
          setLoadingProgress(100);
          setCurrentBgId(initialBg.id);
          currentBgIdRef.current = initialBg.id;
        }
      } catch {
        setLoadingProgress(100);
        setCurrentBgId(initialBg.id);
        currentBgIdRef.current = initialBg.id;
        setConnectionStatus('error');
      }
      
      // Small delay to show 100% before hiding
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsInitializing(false);
    };

    initialize();
  }, [preloadImage]);

  // Start polling after initial load
  useEffect(() => {
    if (currentBgId === null || isInitializing) return;

    pollingRef.current = setInterval(fetchBackground, POLL_INTERVAL);
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [currentBgId, isInitializing, fetchBackground]);

  const currentBg = currentBgId ? backgrounds.find(bg => bg.id === currentBgId) : null;

  // Loading state with progress
  if (isInitializing) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          {/* Logo or branding */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-white animate-pulse" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <h1 className="text-white text-xl font-semibold mb-1">AR Display</h1>
            <p className="text-white/50 text-sm">Initializing experience...</p>
          </div>
          
          {/* Progress bar */}
          <div className="w-64 mx-auto">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-white/30 text-xs mt-2">{loadingProgress}%</p>
          </div>
          
          {/* Connection status */}
          <div className="mt-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
              connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400' :
              connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                connectionStatus === 'connected' ? 'bg-green-400' :
                'bg-red-400'
              }`} />
              {connectionStatus === 'connecting' ? 'Connecting to server...' :
               connectionStatus === 'connected' ? 'Connected' :
               'Connection error'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No background loaded state
  if (!currentBg) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading background...</p>
        </div>
      </div>
    );
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
            key={currentBg.id}
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
            key={currentBg.id}
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
      
      {/* Connection error indicator (subtle, in corner) */}
      {connectionStatus === 'error' && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs">Reconnecting...</span>
          </div>
        </div>
      )}
    </div>
  );
}