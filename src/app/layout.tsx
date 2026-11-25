import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Newsreader, IBM_Plex_Mono } from 'next/font/google';
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

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const newsreader = Newsreader({
  variable: '--font-serif-editorial',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono-code',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Elsewhere — Curiosity Over Mindless Scrolling',
  description:
    'A calm, intentional alternative to infinite scroll feeds. Discover thoughtful ideas, solve puzzles, understand world news, and disconnect into reality.',
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
    statusBarStyle: 'default',
    title: 'Elsewhere',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#F6F5F0',
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
      className={`${plusJakarta.variable} ${newsreader.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F6F5F0] text-[#292D29] selection:bg-[#71816B]/20 selection:text-[#292D29]">
        <AppProvider>
          <ServiceWorkerRegistration />
          <OfflineIndicator />
          <Header />
          <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-16">
            {children}
          </main>
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
