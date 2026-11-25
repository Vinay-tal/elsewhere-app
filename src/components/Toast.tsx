'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Check } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-gentle-enter"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#292D29] text-[#F6F5F0] border border-[#292D29] shadow-md text-xs font-medium">
        <Check className="h-3.5 w-3.5 text-[#C5B99F]" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
