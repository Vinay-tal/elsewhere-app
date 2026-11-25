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
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#E2E0D8]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[#71816B]">{icon}</span>
          <h2 className="font-editorial text-xl sm:text-2xl font-medium tracking-tight text-[#292D29]">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#777B72]">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#71816B] hover:text-[#292D29] transition-colors shrink-0 self-start sm:self-auto"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
