import { ActiveSessionState, SessionRecord, WorthwhileRating } from '@/types';

/**
 * Creates a fresh session state with wall-clock timestamp.
 * Defaults timestamp to 0 for SSR safety; client hydration provides Date.now().
 */
export function createInitialSession(
  targetMinutes: number = 15,
  timestamp: number = 0
): ActiveSessionState {
  return {
    startedAt: timestamp,
    targetDurationMinutes: targetMinutes,
    isPaused: false,
    accumulatedSeconds: 0,
    cardsViewed: 0,
    hasShownEndingModal: false,
  };
}

/**
 * Computes elapsed seconds reliably using wall-clock time difference.
 * Does NOT rely solely on continuous interval ticks, ensuring 100% accuracy
 * across tab sleep, navigation, and page reloads.
 */
export function computeElapsedSeconds(
  session: ActiveSessionState,
  now: number = Date.now()
): number {
  if (session.isPaused || !session.startedAt) {
    return session.accumulatedSeconds;
  }
  const deltaSeconds = Math.max(0, Math.floor((now - session.startedAt) / 1000));
  return session.accumulatedSeconds + deltaSeconds;
}

/**
 * Pauses the active session
 */
export function pauseSession(
  session: ActiveSessionState,
  now: number = Date.now()
): ActiveSessionState {
  if (session.isPaused) return session;
  const currentElapsed = computeElapsedSeconds(session, now);
  return {
    ...session,
    isPaused: true,
    pausedAt: now,
    accumulatedSeconds: currentElapsed,
  };
}

/**
 * Resumes a paused session
 */
export function resumeSession(
  session: ActiveSessionState,
  now: number = Date.now()
): ActiveSessionState {
  if (!session.isPaused) return session;
  return {
    ...session,
    isPaused: false,
    pausedAt: undefined,
    startedAt: now,
  };
}

/**
 * Updates the user's selected session target duration
 */
export function setSessionTarget(
  session: ActiveSessionState,
  newTargetMinutes: number
): ActiveSessionState {
  return {
    ...session,
    targetDurationMinutes: Math.max(1, newTargetMinutes),
  };
}

/**
 * Checks if the user's elapsed time has reached or exceeded their target duration
 */
export function isSessionLimitReached(
  session: ActiveSessionState,
  now: number = Date.now()
): boolean {
  const elapsed = computeElapsedSeconds(session, now);
  const targetSeconds = session.targetDurationMinutes * 60;
  return elapsed >= targetSeconds;
}

/**
 * Converts a completed active session into a persistent historical SessionRecord
 */
export function createSessionRecord(
  session: ActiveSessionState,
  worthwhileRating: WorthwhileRating = 'very',
  reflectionNote?: string,
  now: number = Date.now()
): SessionRecord {
  const elapsed = computeElapsedSeconds(session, now);
  const durationMinutes = Math.max(1, Math.round(elapsed / 60));
  const startedAtDate = new Date(session.startedAt || now - elapsed * 1000).toISOString();
  const endedAtDate = new Date(now).toISOString();

  return {
    id: `sess-${now}-${Math.random().toString(36).substring(2, 7)}`,
    startedAt: startedAtDate,
    endedAt: endedAtDate,
    durationMinutes,
    targetDurationMinutes: session.targetDurationMinutes,
    cardsViewed: Math.max(1, session.cardsViewed),
    worthwhileRating,
    reflectionNote: reflectionNote?.trim() || undefined,
  };
}
