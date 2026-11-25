'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  User,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  HeartHandshake,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Discover' },
  { href: '/explore', label: 'Explore' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/world-pulse', label: 'World Pulse' },
  { href: '/do-something', label: 'Do Something' },
] as const;

export default function Header() {
  const pathname = usePathname();
  const {
    sessionSeconds,
    activeSession,
    profile,
    pauseSessionTimer,
    resumeSessionTimer,
    resetSessionTimer,
    setSessionTargetDuration,
    openEndOfSessionModal,
    openOnboardingModal,
  } = useApp();

  const [isSessionMenuOpen, setIsSessionMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const minutes = Math.floor(sessionSeconds / 60);
  const seconds = sessionSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const targetMinutes = activeSession.targetDurationMinutes || 15;
  const dailyGoalMinutes = profile.dailySessionGoalMinutes || 30;
  const isNearLimit = minutes >= targetMinutes;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsSessionMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSessionMenuOpen(false);
    };
    if (isSessionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSessionMenuOpen]);

  const durations = [5, 10, 15, 20, 30];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E0D8] bg-[#F6F5F0]/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E0D8] bg-[#ECEBE4] transition-colors group-hover:border-[#71816B]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="7.5" stroke="#71816B" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2.2" fill="#71816B" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-lg font-medium tracking-tight text-[#292D29] leading-none">
              Elsewhere
            </span>
            <span className="mt-0.5 text-[10px] tracking-wider uppercase text-[#777B72]">
              Quiet Discovery
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 text-sm">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#ECEBE4] text-[#292D29] font-medium'
                    : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]/60'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0.5 left-3 right-3 h-[1.5px] rounded-full bg-[#71816B]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mindful Session Indicator & Profile */}
        <div className="relative flex items-center gap-2" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsSessionMenuOpen((prev) => !prev)}
            aria-expanded={isSessionMenuOpen}
            aria-label="Mindful Session Timer Controls"
            title="Click to adjust session duration or pause timer"
            className={`flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-full text-xs font-mono border transition-colors cursor-pointer ${
              isNearLimit
                ? 'bg-[#C5B99F]/30 text-[#5B4D34] border-[#C5B99F]'
                : activeSession.isPaused
                ? 'bg-[#ECEBE4] text-[#777B72] border-[#E2E0D8]'
                : 'bg-[#FAF9F5] text-[#292D29] border-[#E2E0D8] hover:border-[#71816B]'
            }`}
          >
            <Clock
              className={`h-3.5 w-3.5 ${
                isNearLimit
                  ? 'text-[#8C7A56]'
                  : activeSession.isPaused
                  ? 'text-[#777B72]'
                  : 'text-[#71816B]'
              }`}
            />
            <span className="tabular-nums font-medium">{timeFormatted}</span>
            <span className="text-[11px] text-[#777B72] font-sans">
              / {targetMinutes}m
            </span>
            {activeSession.isPaused && (
              <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-[#E2E0D8] text-[#5B6057]">
                Paused
              </span>
            )}
          </button>

          {/* Session Controls Popover */}
          {isSessionMenuOpen && (
            <div className="absolute right-0 top-14 w-[calc(100vw-2rem)] sm:w-80 max-w-sm p-5 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] shadow-lg space-y-4 z-50 animate-gentle-enter">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E0D8]">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#292D29] block">
                    Session Intention
                  </span>
                  <span className="text-[11px] text-[#777B72]">
                    Gentle boundaries, zero guilt
                  </span>
                </div>
                <span className="font-mono text-sm font-medium text-[#71816B] tabular-nums">
                  {timeFormatted}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-[#5B6057] font-medium block">
                  Session duration
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {durations.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSessionTargetDuration(d)}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        targetMinutes === d
                          ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                          : 'bg-[#F6F5F0] text-[#777B72] border-[#E2E0D8] hover:text-[#292D29]'
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {activeSession.isPaused ? (
                  <button
                    type="button"
                    onClick={resumeSessionTimer}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Resume</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={pauseSessionTimer}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border border-[#E2E0D8] bg-[#F6F5F0] text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
                  >
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => resetSessionTimer()}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border border-[#E2E0D8] bg-[#F6F5F0] text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSessionMenuOpen(false);
                  openEndOfSessionModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium bg-[#ECEBE4] hover:bg-[#E2E0D8] text-[#292D29] transition-colors cursor-pointer"
              >
                <HeartHandshake className="h-3.5 w-3.5 text-[#71816B]" />
                <span>Finish Session &amp; Reflect</span>
              </button>

              <div className="pt-3 border-t border-[#E2E0D8] space-y-1.5 text-[11px] text-[#777B72]">
                <div className="flex justify-between">
                  <span>Daily intention</span>
                  <span className="font-mono text-[#292D29] font-medium tabular-nums">
                    {profile.totalMindfulMinutes}m / {dailyGoalMinutes}m
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#ECEBE4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#71816B] rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((profile.totalMindfulMinutes / dailyGoalMinutes) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSessionMenuOpen(false);
                  openOnboardingModal();
                }}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] text-[#777B72] hover:text-[#71816B] transition-colors pt-1 cursor-pointer"
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span>Adjust Curiosity Interests</span>
              </button>
            </div>
          )}

          {/* Profile Link */}
          <Link
            href="/profile"
            className={`flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border transition-colors ${
              pathname === '/profile'
                ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                : 'bg-[#FAF9F5] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B] hover:text-[#292D29]'
            }`}
            title="Profile & Settings"
            aria-label="Profile and Settings"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
