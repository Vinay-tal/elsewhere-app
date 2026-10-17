'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function SectionHeader({
  icon,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = 'View all',
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-2 pb-1 border-b border-white/[0.04]">
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
          <span className="text-[#D2F827]">{icon}</span>
          <h2 className="text-white text-sm sm:text-base font-bold tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs text-neutral-400 font-light">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group flex items-center gap-1 text-xs font-semibold text-[#D2F827] hover:text-[#BDF010] transition-colors shrink-0 pb-0.5"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
