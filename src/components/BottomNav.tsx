'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, Trophy, Globe, Footprints } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Discover',
      href: '/',
      icon: Compass,
      activeColor: 'text-[#D2F827]',
      activeBg: 'bg-[#D2F827]/10',
    },
    {
      label: 'Explore',
      href: '/explore',
      icon: Search,
      activeColor: 'text-[#8B5CF6]',
      activeBg: 'bg-[#8B5CF6]/10',
    },
    {
      label: 'Challenges',
      href: '/challenges',
      icon: Trophy,
      activeColor: 'text-amber-400',
      activeBg: 'bg-amber-400/10',
    },
    {
      label: 'World Pulse',
      href: '/world-pulse',
      icon: Globe,
      activeColor: 'text-sky-400',
      activeBg: 'bg-sky-400/10',
    },
    {
      label: 'Do Something',
      href: '/do-something',
      icon: Footprints,
      activeColor: 'text-[#D2F827]',
      activeBg: 'bg-[#D2F827]/15',
      highlight: true,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/[0.08] bg-[#0A0D12]/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <nav className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 tap-highlight-none ${
                isActive ? item.activeBg : 'hover:bg-white/[0.03]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? `${item.activeColor} scale-110` : 'text-neutral-400'
                  }`}
                />
                {item.highlight && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#D2F827]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? `${item.activeColor} font-semibold` : 'text-neutral-400'
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
