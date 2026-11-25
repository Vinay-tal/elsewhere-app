import React from 'react';

export function BotanicalMotif({ className = 'h-16 w-16' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="40" cy="40" r="34" stroke="#E2E0D8" strokeWidth="1" />
      <circle cx="40" cy="40" r="22" stroke="#C5B99F" strokeWidth="1" strokeDasharray="3 4" />
      <path
        d="M40 58C40 42 40 28 40 18"
        stroke="#71816B"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M40 44C32 42 27 35 28 27C35 28 40 34 40 44Z"
        fill="#71816B"
        fillOpacity="0.16"
        stroke="#71816B"
        strokeWidth="1.2"
      />
      <path
        d="M40 36C48 34 53 28 52 20C45 21 40 27 40 36Z"
        fill="#C5B99F"
        fillOpacity="0.28"
        stroke="#71816B"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function HorizonDividerArt() {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-24 mx-auto"
    >
      <line x1="6" y1="12" x2="46" y2="12" stroke="#E2E0D8" strokeWidth="1" />
      <circle cx="60" cy="12" r="5" stroke="#71816B" strokeWidth="1.2" fill="#ECEBE4" />
      <circle cx="60" cy="12" r="1.8" fill="#71816B" />
      <line x1="74" y1="12" x2="114" y2="12" stroke="#E2E0D8" strokeWidth="1" />
    </svg>
  );
}

export function BreathCircleRing({
  progressPercent,
  timeFormatted,
  subtitle,
}: {
  progressPercent: number;
  timeFormatted: string;
  subtitle: string;
}) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.max(0, Math.min(100, progressPercent)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-44 h-44 mx-auto">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#E2E0D8"
          strokeWidth="4"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#71816B"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
        <circle
          cx="80"
          cy="80"
          r="50"
          fill="#ECEBE4"
          fillOpacity="0.45"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-3xl font-medium tracking-tight text-[#292D29] tabular-nums">
          {timeFormatted}
        </span>
        <span className="mt-1 text-[11px] text-[#777B72]">{subtitle}</span>
      </div>
    </div>
  );
}
