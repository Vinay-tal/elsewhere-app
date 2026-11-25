'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
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
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full max-w-md animate-gentle-enter"
    >
      {isOffline ? (
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#ECEBE4] text-[#5B4D34] border border-[#C5B99F] text-xs font-medium shadow-sm">
          <WifiOff className="h-3.5 w-3.5 text-[#8C7A56] shrink-0" />
          <span>Offline mode — saved readings and puzzles remain available</span>
        </div>
      ) : showReconnected ? (
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#ECEBE4] text-[#4B5846] border border-[#71816B]/40 text-xs font-medium shadow-sm">
          <Wifi className="h-3.5 w-3.5 text-[#71816B] shrink-0" />
          <span>Back online — live World Pulse dispatches ready</span>
        </div>
      ) : null}
    </div>
  );
}
