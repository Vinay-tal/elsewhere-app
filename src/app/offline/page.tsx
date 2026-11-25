'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, Footprints, Trophy, Search, RefreshCw } from 'lucide-react';
import { BotanicalMotif } from '@/components/ActivityArtwork';

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:py-20 text-center space-y-8 animate-gentle-enter">
      <div className="flex flex-col items-center space-y-3">
        <BotanicalMotif className="h-16 w-16" />
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#ECEBE4] text-[#5B4D34] border border-[#C5B99F]">
          <WifiOff className="h-3.5 w-3.5 text-[#8C7A56]" />
          Offline Mode Active
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#292D29]">
          You&apos;re Exploring Offline
        </h1>
        <p className="text-sm text-[#5B6057] max-w-md mx-auto leading-relaxed">
          Elsewhere supports intentional disconnection. Your saved readings, sensory resets, and puzzles remain ready without internet access.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
        <Link
          href="/do-something"
          className="group p-4 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] hover:border-[#71816B] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#ECEBE4] flex items-center justify-center text-[#71816B]">
              <Footprints className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-medium text-[#292D29] block">
                Do Something Offline
              </span>
              <span className="text-xs text-[#777B72] block">
                5-min grounding &amp; sensory resets
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/challenges"
          className="group p-4 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] hover:border-[#71816B] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#ECEBE4] flex items-center justify-center text-[#8C7A56]">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-medium text-[#292D29] block">
                Mindful Puzzles
              </span>
              <span className="text-xs text-[#777B72] block">
                Logic, riddles, code &amp; memory
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/explore"
          className="group p-4 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] hover:border-[#71816B] transition-colors sm:col-span-2"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#ECEBE4] flex items-center justify-center text-[#71816B]">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-medium text-[#292D29] block">
                Explore Saved Curiosities
              </span>
              <span className="text-xs text-[#777B72] block">
                11 fields of thoughtful reading
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="pt-4 space-y-3">
        <button
          type="button"
          onClick={handleReload}
          className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Check Connection</span>
        </button>
        <p className="text-[11px] text-[#777B72] font-mono">
          Live World Pulse feeds will resume once a connection returns.
        </p>
      </div>
    </div>
  );
}
