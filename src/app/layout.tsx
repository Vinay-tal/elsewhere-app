import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ArticleModal from '@/components/ArticleModal';
import ChallengeModal from '@/components/ChallengeModal';
import OfflineTimerModal from '@/components/OfflineTimerModal';
import MindfulPauseModal from '@/components/MindfulPauseModal';
import EndOfSessionModal from '@/components/EndOfSessionModal';
import OnboardingModal from '@/components/OnboardingModal';
import FindSomethingModal from '@/components/FindSomethingModal';
import OfflineIndicator from '@/components/OfflineIndicator';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import Toast from '@/components/Toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Elsewhere — Curiosity Over Mindless Scrolling',
  description:
    'A healthy, intentional alternative to infinite scroll feeds. Discover fascinating ideas, solve puzzles, understand world news, and disconnect into reality.',
  applicationName: 'Elsewhere',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Elsewhere',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0D12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0D12] text-[#F4F4F6] selection:bg-[#D2F827]/30 selection:text-[#D2F827]">
        <AppProvider>
          <ServiceWorkerRegistration />
          <OfflineIndicator />
          <Header />
          <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-12">{children}</main>
          <BottomNav />
          <ArticleModal />
          <ChallengeModal />
          <OfflineTimerModal />
          <MindfulPauseModal />
          <EndOfSessionModal />
          <OnboardingModal />
          <FindSomethingModal />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
