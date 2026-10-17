'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full max-w-md animate-in slide-in-from-top-3 duration-200"
    >
      {isOffline ? (
        <div className="flex items-center justify-center gap-2 py-2 px-3.5 rounded-full bg-amber-950/90 text-amber-200 border border-amber-500/30 text-xs font-medium shadow-xl backdrop-blur-md">
          <WifiOff className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>Offline Mode • Stored curiosities & puzzles available</span>
        </div>
      ) : showReconnected ? (
        <div className="flex items-center justify-center gap-2 py-2 px-3.5 rounded-full bg-emerald-950/90 text-emerald-200 border border-emerald-500/30 text-xs font-medium shadow-xl backdrop-blur-md animate-in fade-in duration-200">
          <Wifi className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>Back Online • Live World Pulse dispatches ready</span>
        </div>
      ) : null}
    </div>
  );
}
