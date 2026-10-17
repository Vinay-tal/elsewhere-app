'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, Footprints, Trophy, Search, RefreshCw, Sparkles } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:py-16 text-center space-y-8 animate-in fade-in duration-300">
      {/* Calm Disconnection Icon */}
      <div className="relative inline-flex">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#1A1F2C] to-[#121620] border border-white/10 flex items-center justify-center shadow-xl">
          <WifiOff className="h-9 w-9 text-amber-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#D2F827]/15 border border-[#D2F827]/30 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-[#D2F827]" />
        </div>
      </div>

      {/* Heading & Reassuring Copy */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-400/90 font-medium px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 inline-block">
          Offline Mode Active
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          You’re Exploring Offline
        </h1>
        <p className="text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
          Elsewhere is designed to support intentional disconnection. Even without internet access, your downloaded curiosities, sensory resets, and puzzles remain ready.
        </p>
      </div>

      {/* Available Offline Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
        <Link
          href="/do-something"
          className="group p-4 rounded-2xl bg-[#121620] border border-white/10 hover:border-[#D2F827]/40 transition-all hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#D2F827]/10 flex items-center justify-center text-[#D2F827] group-hover:scale-105 transition-transform">
              <Footprints className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white group-hover:text-[#D2F827] transition-colors block">
                Do Something Offline
              </span>
              <span className="text-xs text-neutral-400 font-light block">
                5-min grounding & sensory resets
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/challenges"
          className="group p-4 rounded-2xl bg-[#121620] border border-white/10 hover:border-amber-400/40 transition-all hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors block">
                Mindful Puzzles
              </span>
              <span className="text-xs text-neutral-400 font-light block">
                Logic, riddles, code & memory
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/explore"
          className="group p-4 rounded-2xl bg-[#121620] border border-white/10 hover:border-[#8B5CF6]/40 transition-all hover:bg-white/[0.04] sm:col-span-2"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] group-hover:scale-105 transition-transform">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white group-hover:text-[#8B5CF6] transition-colors block">
                Explore Saved Curiosities
              </span>
              <span className="text-xs text-neutral-400 font-light block">
                11 deep disciplines of knowledge
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Network Note & Refresh Button */}
      <div className="pt-4 space-y-3">
        <button
          onClick={handleReload}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white/10 text-white hover:bg-white/15 active:scale-95 transition-all border border-white/10"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Check Connection</span>
        </button>
        <p className="text-[11px] text-neutral-500 font-mono">
          Live World Pulse feeds will resume when a connection is re-established.
        </p>
      </div>
    </div>
  );
}
