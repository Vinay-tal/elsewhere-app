'use client';

import React from 'react';
import Link from 'next/link';
import { Footprints, CheckCircle, RefreshCw } from 'lucide-react';

interface StoppingPointBannerProps {
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function StoppingPointBanner({ onLoadMore, hasMore = true }: StoppingPointBannerProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#121622] to-[#0A0D14] p-6 text-center space-y-4 my-8">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#D2F827]/10 text-[#D2F827] border border-[#D2F827]/25">
        <CheckCircle className="h-5 w-5" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base sm:text-lg font-bold text-white">
          You&apos;ve reached today&apos;s natural pause point
        </h4>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
          Unlike infinite-scroll apps designed to hijack attention, Elsewhere gives you clean stopping points.
          Your brain integrates insight when you pause.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/do-something"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#D2F827] text-black hover:bg-[#BDF010] transition-colors"
        >
          <Footprints className="h-4 w-4" />
          Do Something Offline
        </Link>

        {hasMore && onLoadMore && (
          <button
            onClick={onLoadMore}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Curate 3 More Discoveries
          </button>
        )}
      </div>
    </div>
  );
}
