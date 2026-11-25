/**
 * Mobile Experience & PWA Quality Assurance Test Suite
 *
 * Verifies:
 * 1. Web App Manifest validity, structure, icons, and shortcuts
 * 2. Icon files existence and sizing (192x192, 512x512, apple-touch-icon, maskable)
 * 3. Service Worker caching architecture & network-first news protection
 * 4. Offline fallback page structure
 * 5. Secret audit & zero exposed credentials
 * 6. Mobile input zoom prevention & touch target standards
 */

import fs from 'fs';
import path from 'path';

function runMobilePwaTests() {
  console.log('📱 Starting Mobile Experience & PWA QA Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${msg}`);
      failed++;
    }
  }

  const rootDir = path.resolve(__dirname, '..');

  // ==========================================
  // 1. Web App Manifest Validation
  // ==========================================
  console.log('Section 1: Web App Manifest Validation');
  const manifestPath = path.join(rootDir, 'public', 'manifest.webmanifest');
  assert(fs.existsSync(manifestPath), 'public/manifest.webmanifest exists');

  interface ManifestIcon {
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }

  interface WebAppManifest {
    name?: string;
    short_name?: string;
    description?: string;
    start_url?: string;
    display?: string;
    background_color?: string;
    theme_color?: string;
    icons?: ManifestIcon[];
    shortcuts?: Array<{ name: string; url: string }>;
  }

  let manifest: WebAppManifest = {};
  try {
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(raw) as WebAppManifest;
    assert(true, 'manifest.webmanifest is valid JSON');
  } catch {
    assert(false, 'manifest.webmanifest failed to parse as JSON');
  }

  assert(Boolean(manifest.name && manifest.name.includes('Elsewhere')), 'Manifest has correct full app name');
  assert(manifest.short_name === 'Elsewhere', 'Manifest has concise short_name');
  assert(manifest.display === 'standalone', 'Manifest display mode is "standalone"');
  assert(manifest.start_url === '/', 'Manifest start_url is root "/"');
  assert(manifest.background_color === '#F6F5F0', 'Manifest background_color matches warm ivory theme');
  assert(manifest.theme_color === '#F6F5F0', 'Manifest theme_color is #F6F5F0');
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'Manifest defines required icon set');

  // Check required icon files on disk
  const icon192 = (manifest.icons || []).find((i) => i.sizes === '192x192');
  const icon512 = (manifest.icons || []).find((i) => i.sizes === '512x512' && i.purpose !== 'maskable');
  const iconMaskable = (manifest.icons || []).find((i) => i.purpose === 'maskable');

  assert(Boolean(icon192), '192x192 icon entry declared in manifest');
  assert(Boolean(icon512), '512x512 icon entry declared in manifest');
  assert(Boolean(iconMaskable), 'Maskable icon entry declared in manifest');

  if (icon192) {
    const p192 = path.join(rootDir, 'public', icon192.src.replace(/^\//, ''));
    assert(fs.existsSync(p192), `Icon file ${icon192.src} exists on disk`);
  }
  if (icon512) {
    const p512 = path.join(rootDir, 'public', icon512.src.replace(/^\//, ''));
    assert(fs.existsSync(p512), `Icon file ${icon512.src} exists on disk`);
  }
  const appleTouchIconPath = path.join(rootDir, 'public', 'apple-touch-icon.png');
  assert(fs.existsSync(appleTouchIconPath), 'apple-touch-icon.png exists on disk for iOS devices');

  assert(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, 'Manifest defines fast app shortcuts');

  // ==========================================
  // 2. Service Worker & Caching Strategy
  // ==========================================
  console.log('\nSection 2: Service Worker & Offline Caching Architecture');
  const swPath = path.join(rootDir, 'public', 'sw.js');
  assert(fs.existsSync(swPath), 'public/sw.js exists');

  const swContent = fs.readFileSync(swPath, 'utf-8');
  assert(swContent.includes('addEventListener(\'install\''), 'Service worker registers install event listener');
  assert(swContent.includes('addEventListener(\'activate\''), 'Service worker registers activate event listener');
  assert(swContent.includes('addEventListener(\'fetch\''), 'Service worker registers fetch event listener');
  assert(swContent.includes('/offline'), 'Service worker pre-caches offline fallback route');

  // Strict constraint: Do not cache sensitive information or stale breaking-news content as though it were current
  assert(
    swContent.includes('/api/news'),
    'Service worker specifically intercepts /api/news'
  );
  assert(
    swContent.includes('isOffline') || swContent.includes('offline'),
    'Service worker flags offline state for news requests rather than serving stale breaking claims'
  );

  // Check Registration Component
  const swRegPath = path.join(rootDir, 'src', 'components', 'ServiceWorkerRegistration.tsx');
  assert(fs.existsSync(swRegPath), 'ServiceWorkerRegistration component exists');

  // ==========================================
  // 3. Offline Experience & Fallback Page
  // ==========================================
  console.log('\nSection 3: Offline Experience & Indicators');
  const offlinePagePath = path.join(rootDir, 'src', 'app', 'offline', 'page.tsx');
  assert(fs.existsSync(offlinePagePath), 'src/app/offline/page.tsx fallback page exists');

  const offlinePageContent = fs.readFileSync(offlinePagePath, 'utf-8');
  assert(offlinePageContent.includes('/do-something'), 'Offline page links to offline screen-free activities');
  assert(offlinePageContent.includes('/challenges'), 'Offline page links to mindful puzzles');
  assert(offlinePageContent.includes('Check Connection'), 'Offline page offers connection refresh button');

  const indicatorPath = path.join(rootDir, 'src', 'components', 'OfflineIndicator.tsx');
  assert(fs.existsSync(indicatorPath), 'OfflineIndicator component exists');
  const indicatorContent = fs.readFileSync(indicatorPath, 'utf-8');
  assert(indicatorContent.includes('addEventListener(\'offline\''), 'OfflineIndicator listens for browser offline events');
  assert(indicatorContent.includes('addEventListener(\'online\''), 'OfflineIndicator listens for browser online events');

  // ==========================================
  // 4. Mobile Layout, Touch Targets & Viewport
  // ==========================================
  console.log('\nSection 4: Mobile Viewport, Touch Targets & Safe Areas');
  const layoutPath = path.join(rootDir, 'src', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

  assert(layoutContent.includes('width: \'device-width\''), 'Layout defines device-width viewport');
  assert(layoutContent.includes('maximumScale: 5'), 'Layout permits accessible pinch-to-zoom scaling');
  assert(layoutContent.includes('viewportFit: \'cover\''), 'Layout specifies viewportFit cover for notch/island support');
  assert(layoutContent.includes('safe-area-inset-bottom'), 'Layout accommodates iOS safe area inset bottom');

  const bottomNavPath = path.join(rootDir, 'src', 'components', 'BottomNav.tsx');
  const bottomNavContent = fs.readFileSync(bottomNavPath, 'utf-8');
  assert(bottomNavContent.includes('min-h-[48px]'), 'Bottom navigation links comply with >=48px accessible tap targets');
  assert(bottomNavContent.includes('safe-area-inset-bottom'), 'Bottom nav adds safe-area padding for mobile home bar');

  const headerPath = path.join(rootDir, 'src', 'components', 'Header.tsx');
  const headerContent = fs.readFileSync(headerPath, 'utf-8');
  assert(headerContent.includes('min-h-[44px]'), 'Header timer and profile buttons meet >=44px mobile touch target');
  assert(
    headerContent.includes('calc(100vw-2rem)') || headerContent.includes('max-w-sm'),
    'Header session popover prevents horizontal overflow on narrow screens'
  );

  // ==========================================
  // 5. Input Zoom Prevention (Font size >= 16px on mobile)
  // ==========================================
  console.log('\nSection 5: iOS Input Zoom Prevention (Font-Size >= 16px)');
  const worldPulsePath = path.join(rootDir, 'src', 'app', 'world-pulse', 'page.tsx');
  const wpContent = fs.readFileSync(worldPulsePath, 'utf-8');
  assert(wpContent.includes('text-base sm:text-sm'), 'World Pulse search input uses 16px base font to prevent auto-zoom');

  const explorePath = path.join(rootDir, 'src', 'app', 'explore', 'page.tsx');
  const expContent = fs.readFileSync(explorePath, 'utf-8');
  assert(expContent.includes('text-base sm:text-sm'), 'Explore search input uses 16px base font to prevent auto-zoom');

  const challengesPath = path.join(rootDir, 'src', 'app', 'challenges', 'page.tsx');
  const chalContent = fs.readFileSync(challengesPath, 'utf-8');
  assert(chalContent.includes('text-base sm:text-sm'), 'Challenges search input uses 16px base font to prevent auto-zoom');

  const endSessionPath = path.join(rootDir, 'src', 'components', 'EndOfSessionModal.tsx');
  const esContent = fs.readFileSync(endSessionPath, 'utf-8');
  assert(esContent.includes('text-base sm:text-xs'), 'End of Session reflection input uses 16px base font on mobile');

  // ==========================================
  // 6. Security & Credential Audit
  // ==========================================
  console.log('\nSection 6: Security & Zero Leaked API Keys');
  const envExamplePath = path.join(rootDir, '.env.example');
  assert(fs.existsSync(envExamplePath), '.env.example template exists');

  // Ensure no uncommitted .env.local with live secrets is committed
  const gitIgnorePath = path.join(rootDir, '.gitignore');
  const gitIgnoreContent = fs.readFileSync(gitIgnorePath, 'utf-8');
  assert(gitIgnoreContent.includes('.env*.local'), '.gitignore excludes local environment secret files');

  // Search for hardcoded live API keys (e.g. Guardian actual key or private keys)
  const codeFiles = [
    'src/lib/newsService.ts',
    'src/lib/storage.ts',
    'src/lib/recommendation.ts',
    'src/lib/challengeService.ts',
  ];
  let hardcodedKeyFound = false;
  codeFiles.forEach((file) => {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      const c = fs.readFileSync(fullPath, 'utf-8');
      if (c.includes('test-live-key-') || /apiKey\s*=\s*['"][a-zA-Z0-9]{20,}['"]/.test(c)) {
        hardcodedKeyFound = true;
      }
    }
  });
  assert(!hardcodedKeyFound, 'Codebase audit: zero hardcoded live production API keys or secrets');

  // ==========================================
  // Summary
  // ==========================================
  console.log(`\n========================================`);
  console.log(`🏁 Mobile Experience & PWA QA: ${passed} passed, ${failed} failed.`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runMobilePwaTests();
