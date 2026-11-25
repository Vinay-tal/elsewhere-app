'use client';

import React from 'react';
import Link from 'next/link';
import { Footprints, RefreshCw } from 'lucide-react';
import { HorizonDividerArt } from '@/components/ActivityArtwork';

interface StoppingPointBannerProps {
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function StoppingPointBanner({ onLoadMore, hasMore = true }: StoppingPointBannerProps) {
  return (
    <section className="rounded-2xl border border-[#E2E0D8] bg-[#ECEBE4]/70 px-6 py-8 sm:py-10 text-center space-y-5 my-4">
      <HorizonDividerArt />

      <div className="space-y-2">
        <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#292D29]">
          You&apos;ve reached a natural pause point
        </h3>
        <p className="text-xs sm:text-sm text-[#5B6057] max-w-md mx-auto leading-relaxed">
          Unlike feeds designed to hold your attention indefinitely, Elsewhere offers clean places to stop. Reflection happens in the quiet afterward.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
        <Link
          href="/do-something"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors"
        >
          <Footprints className="h-4 w-4" />
          <span>Do Something Offline</span>
        </Link>

        {hasMore && onLoadMore && (
          <button
            type="button"
            onClick={onLoadMore}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-medium border border-[#CFCBC0] bg-[#F6F5F0] text-[#292D29] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#71816B]" />
            <span>Show 3 more readings</span>
          </button>
        )}
      </div>
    </section>
  );
}
