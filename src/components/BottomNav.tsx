'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, Trophy, Globe, Footprints } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Discover', href: '/', icon: Compass },
    { label: 'Explore', href: '/explore', icon: Search },
    { label: 'Challenges', href: '/challenges', icon: Trophy },
    { label: 'World Pulse', href: '/world-pulse', icon: Globe },
    { label: 'Offline', href: '/do-something', icon: Footprints },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[#E2E0D8] bg-[#F6F5F0]/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <nav aria-label="Mobile Navigation" className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] flex-1 py-1.5 px-1 rounded-xl transition-colors tap-highlight-none ${
                isActive
                  ? 'bg-[#ECEBE4] text-[#292D29]'
                  : 'text-[#777B72] hover:text-[#292D29]'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-[#71816B]' : 'text-[#777B72]'
                }`}
              />
              <span
                className={`text-[10px] mt-1 transition-colors ${
                  isActive ? 'text-[#292D29] font-semibold' : 'text-[#777B72] font-medium'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
