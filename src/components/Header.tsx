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
  Sparkles,
  SlidersHorizontal,
  HeartHandshake
} from 'lucide-react';

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
    openOnboardingModal
  } = useApp();

  const [isSessionMenuOpen, setIsSessionMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const minutes = Math.floor(sessionSeconds / 60);
  const seconds = sessionSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const targetMinutes = activeSession.targetDurationMinutes || 15;
  const dailyGoalMinutes = profile.dailySessionGoalMinutes || 30;
  const isNearLimit = minutes >= targetMinutes;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsSessionMenuOpen(false);
      }
    };
    if (isSessionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSessionMenuOpen]);

  const durations = [5, 10, 15, 20, 30];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0A0D12]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E2433] to-[#121620] border border-white/10 shadow-sm transition-transform group-hover:scale-105">
            <span className="text-[#D2F827] font-bold text-base leading-none">E</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-white text-base leading-none">
              Elsewhere
            </span>
            <span className="text-[10px] text-neutral-400 tracking-wider uppercase font-medium">
              Mindful Discovery
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/' ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Discover
          </Link>
          <Link
            href="/explore"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/explore' ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Explore
          </Link>
          <Link
            href="/challenges"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/challenges' ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Challenges
          </Link>
          <Link
            href="/world-pulse"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/world-pulse' ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'
            }`}
          >
            World Pulse
          </Link>
          <Link
            href="/do-something"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/do-something' ? 'text-[#D2F827] bg-[#D2F827]/10' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Do Something
          </Link>
        </nav>

        {/* Mindful Session Indicator & Controls */}
        <div className="relative flex items-center gap-2.5" ref={menuRef}>
          <button
            onClick={() => setIsSessionMenuOpen((prev) => !prev)}
            aria-label="Mindful Session Timer Controls"
            title="Click to adjust session duration or pause timer"
            className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full text-xs font-mono font-semibold border transition-all ${
              isNearLimit
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse'
                : activeSession.isPaused
                ? 'bg-white/5 text-neutral-400 border-white/10'
                : 'bg-white/[0.04] text-neutral-200 border-white/10 hover:border-[#D2F827]/40 hover:text-white'
            }`}
          >
            <Clock
              className={`h-3.5 w-3.5 ${
                isNearLimit
                  ? 'text-amber-400'
                  : activeSession.isPaused
                  ? 'text-neutral-500'
                  : 'text-[#D2F827]'
              }`}
            />
            <span>{timeFormatted}</span>
            <span className="text-[10px] text-neutral-400 font-sans">
              / {targetMinutes}m
            </span>
            {activeSession.isPaused && (
              <span className="text-[9px] uppercase px-1 rounded bg-amber-400/20 text-amber-300">
                Paused
              </span>
            )}
          </button>

          {/* Session Controls Popover */}
          {isSessionMenuOpen && (
            <div className="absolute right-0 top-14 w-[calc(100vw-2rem)] sm:w-80 max-w-sm p-4 rounded-2xl bg-[#10141D] border border-white/15 shadow-2xl space-y-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    Session & Digital Wellbeing
                  </span>
                  <span className="text-[10px] text-neutral-400 font-light">
                    Intentional time limits • No guilt
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-[#D2F827]">
                  {timeFormatted}
                </span>
              </div>

              {/* Select Session Duration */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-neutral-300 font-medium block">
                  Select Session Duration:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSessionTargetDuration(d)}
                      className={`py-1 rounded-lg text-xs font-semibold border transition-all ${
                        targetMinutes === d
                          ? 'bg-[#D2F827] text-black border-[#D2F827]'
                          : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Play / Pause / Reset Controls */}
              <div className="grid grid-cols-2 gap-2">
                {activeSession.isPaused ? (
                  <button
                    onClick={resumeSessionTimer}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-[#D2F827] text-black hover:bg-[#BDF010] transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-black" />
                    <span>Resume Timer</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseSessionTimer}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border border-white/10 text-neutral-200 hover:bg-white/5 transition-colors"
                  >
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause Timer</span>
                  </button>
                )}

                <button
                  onClick={() => resetSessionTimer()}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Time</span>
                </button>
              </div>

              {/* End Session Now & Reflect */}
              <button
                onClick={() => {
                  setIsSessionMenuOpen(false);
                  openEndOfSessionModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                <HeartHandshake className="h-3.5 w-3.5 text-rose-400" />
                <span>Finish Session & Reflect</span>
              </button>

              {/* Daily Goal Progress */}
              <div className="pt-2 border-t border-white/[0.08] space-y-1 text-[11px] text-neutral-400">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    Daily Intention:
                  </span>
                  <span className="font-mono text-white font-medium">
                    {profile.totalMindfulMinutes}m / {dailyGoalMinutes}m
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-[#D2F827] rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((profile.totalMindfulMinutes / dailyGoalMinutes) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Quick Personalize Link */}
              <button
                onClick={() => {
                  setIsSessionMenuOpen(false);
                  openOnboardingModal();
                }}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 hover:text-[#D2F827] transition-colors pt-1"
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span>Change Curiosity Interests</span>
              </button>
            </div>
          )}

          {/* Profile Link */}
          <Link
            href="/profile"
            className={`flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border transition-all ${
              pathname === '/profile'
                ? 'bg-[#D2F827] text-black border-[#D2F827]'
                : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:border-white/30 hover:text-white'
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
