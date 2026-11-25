import React from 'react';

export function HomeFeedSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-24 rounded-2xl bg-[#ECEBE4] border border-[#E2E0D8]" />

      <div className="space-y-3">
        <div className="h-4 w-40 bg-[#ECEBE4] rounded" />
        <div className="h-64 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] p-6 space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-24 bg-[#ECEBE4] rounded-full" />
            <div className="h-5 w-16 bg-[#ECEBE4] rounded-full" />
          </div>
          <div className="h-7 w-3/4 bg-[#ECEBE4] rounded" />
          <div className="h-4 w-5/6 bg-[#ECEBE4] rounded" />
          <div className="flex justify-between pt-4">
            <div className="h-8 w-24 bg-[#ECEBE4] rounded-lg" />
            <div className="h-8 w-28 bg-[#ECEBE4] rounded-lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] p-5 space-y-3">
            <div className="h-4 w-20 bg-[#ECEBE4] rounded" />
            <div className="h-5 w-3/4 bg-[#ECEBE4] rounded" />
            <div className="h-3 w-5/6 bg-[#ECEBE4] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
