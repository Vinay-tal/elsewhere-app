'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#181E2C] text-neutral-100 border border-white/15 shadow-xl text-xs font-medium backdrop-blur-md">
        <Sparkles className="h-3.5 w-3.5 text-[#D2F827]" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
