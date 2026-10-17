# Elsewhere — Curiosity Over Mindless Scrolling

> **Elsewhere** is a healthy, intentional alternative to infinite-scroll feeds (Instagram, TikTok, YouTube Shorts, X). It transforms the habitual urge to reach for your phone into an enriching encounter with human curiosity, mindful puzzles, verified world news, and screen-free sensory activities.

---

## 📱 Mobile Experience & PWA Installation

Elsewhere is configured as a standalone Progressive Web App (PWA) with full offline support.

### Installing on iOS (iPhone / iPad)
1. Open Safari and navigate to your Elsewhere deployment URL (e.g., `http://<your-lan-ip>:3000` or production domain).
2. Tap the **Share** button (the square with an arrow pointing upward) in the Safari toolbar.
3. Scroll down and tap **"Add to Home Screen"**.
4. Confirm the app name **"Elsewhere"** and tap **Add**.
5. Launch Elsewhere directly from your home screen. It will open in full-screen standalone mode without browser chrome, supporting safe-area notch and home bar insets.

### Installing on Android (Chrome / Brave / Firefox)
1. Open Chrome and navigate to the app URL.
2. Tap the three-dot overflow menu in the top-right corner.
3. Select **"Install app"** or **"Add to Home screen"** (or tap the bottom ambient badge when prompted).
4. Tap **Install**. Elsewhere is installed as a native-like application on your app drawer and home screen.

### Installing on Desktop (Chrome / Edge / Brave / macOS Safari)
1. In Chromium browsers, click the **Install Elsewhere** icon in the right side of the address bar.
2. Or open the browser menu and click **"Install Elsewhere..."**.
3. Elsewhere opens in a dedicated window with standalone window controls.

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm (or pnpm / yarn)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Elsewhere is designed to work completely **out of the box with zero external configuration**:
```bash
cp .env.example .env.local
```
- **`GUARDIAN_API_KEY`** *(optional)*: Free Developer Tier key from [The Guardian Open Platform](https://open-platform.theguardian.com/access/). When left blank, Elsewhere connects to verified official syndicated feeds and curated benchmark dispatches automatically.
- **`NEWS_CACHE_TTL_SECONDS`** *(optional)*: Cache duration for live news dispatches (default: 900 seconds / 15 minutes).

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser (or your local IP on mobile devices on the same Wi-Fi network).

### 4. Running the Automated QA Test Suite
Run all 396 unit, integration, and PWA verification tests:
```bash
npm test
```

### 5. Running Linter & Production Build
```bash
npm run lint
npm run build
npm run start
```

---

## 🛠️ Architecture & Feature Overview

### 1. Discovery & Mindful Feed (`/`)
- Finite editorial batches (no infinite scroll).
- "Find Something For Me" instant micro-break engine (2m, 5m, 10m, 20m durations across 5 moods).
- Transparent recommendation engine scoring items based on explicit interests (+35), saves/likes (+15..+20), repetition suppression (-150 for completed items), and topic diversity interleaving.

### 2. Interactive Puzzles & Challenges (`/challenges`)
- 20 handcrafted interactive activities across 6 cognitive categories:
  - Multiple-Choice Quizzes
  - Logic Puzzles (e.g. Monty Hall, River Crossing, False Positive Paradox)
  - Code Challenges (e.g. Off-by-one, Reference Equality, Float Precision)
  - Riddles & Thought Experiments (e.g. Ship of Theseus, Brain in a Vat)
  - General Knowledge (e.g. Challenger Deep, Eratosthenes)
  - Memory & Observation Matrix Exercises
- Immediate educational explanations, hint system, deduplicated completion stats, and keyboard shortcuts (`1-4`, `S` to save, `H` for hint, `R` to retry).

### 3. World Pulse (`/world-pulse`)
- Sober global affairs without clickbait, manufactured outrage, or partisan spin.
- Strict separation of verified facts from analytical "Why It Matters" commentary.
- Preserves original publisher attributions, ISO dates, and external links.
- **Offline Integrity**: Does not cache stale breaking news as though it were current. In offline mode, clearly indicates verified reference benchmarks.

### 4. Screen-Free Activities (`/do-something`)
- Guided sensory resets (5-4-3-2-1 Grounding, Box Breathing, Eye Horizon Rest, Analog Life Audit).
- Visual step-by-step guides and gentle audible chimes.

### 5. Digital Wellbeing & Session Management
- **Wall-Clock Precision**: Session timer anchored in real-world time difference (`Date.now() - session.startedAt`), eliminating drift from background tab throttling or page reloads.
- **End-of-Session Reflection**: Non-punitive boundary check-in with 4 worthwhile ratings (`🌟 Very worthwhile`, `👍 Somewhat`, `😐 Neutral`, `📱 Got distracted`) and optional takeaway notes.
- **Personal History**: Complete personal journal on the Profile page (`/profile`) with Markdown export for offline archiving.

### 6. PWA & Offline Support
- Valid Web App Manifest (`/manifest.webmanifest`) with 192x192, 512x512, maskable, and SVG icons.
- Service worker (`/sw.js`) with cache-first static assets, network-first navigations, and dedicated offline fallback (`/offline`).
- Accessible viewport scaling (`maximumScale: 5`) with 16px minimum input font-size to prevent automatic iOS Safari viewport zoom.
- Safe-area insets (`env(safe-area-inset-bottom)`) supporting iPhones with home indicator bars.

---

## 🔒 Security & Privacy Standard
- **Zero Tracker Scripts**: No third-party behavioral analytics, ad pixels, or session recording scripts.
- **Local-First Storage**: User profile, saved bookmarks, session reflections, and challenge progress are stored securely in browser `localStorage`.
- **Zero Leaked Secrets**: All external API credentials (if configured) are isolated to server-side Next.js route handlers (`/api/news`). No keys are exposed to the client bundle.
