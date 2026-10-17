import React from 'react';

export function HomeFeedSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Quick 5 min launcher skeleton */}
      <div className="h-24 rounded-2xl bg-white/[0.04] border border-white/5" />

      {/* Featured discovery skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-40 bg-white/[0.06] rounded" />
        <div className="h-72 rounded-2xl bg-white/[0.04] border border-white/5 p-6 space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-white/[0.06] rounded-full" />
            <div className="h-5 w-16 bg-white/[0.06] rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-white/[0.08] rounded" />
          <div className="h-4 w-5/6 bg-white/[0.05] rounded" />
          <div className="h-16 w-full bg-white/[0.03] rounded-xl" />
          <div className="flex justify-between pt-4">
            <div className="h-8 w-24 bg-white/[0.06] rounded-lg" />
            <div className="h-8 w-28 bg-white/[0.08] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Compact cards grid skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-white/[0.06] rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-white/[0.03] border border-white/5 p-5 space-y-3">
              <div className="h-4 w-20 bg-white/[0.06] rounded" />
              <div className="h-5 w-3/4 bg-white/[0.08] rounded" />
              <div className="h-3 w-5/6 bg-white/[0.04] rounded" />
              <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
