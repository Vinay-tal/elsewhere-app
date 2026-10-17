import { UserProfile, Topic, ActiveSessionState } from '@/types';

const STORAGE_KEY = 'elsewhere_user_profile_v1';
const ACTIVE_SESSION_KEY = 'elsewhere_active_session_v1';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Mindful Explorer',
  hasCompletedOnboarding: true,
  sessionTargetDurationMinutes: 15,
  selectedInterests: ['Psychology', 'Science', 'Technology & AI', 'Philosophy'],
  dailySessionGoalMinutes: 15,
  likedItemIds: ['c-1'],
  savedItemIds: ['c-4'],
  dismissedItemIds: [],
  completedChallengeIds: [],
  completedChallengeScores: {},
  completedActivities: [
    {
      id: 'init-act-1',
      activityId: 'off-1',
      title: 'The 5-4-3-2-1 Sensory Grounding',
      category: 'offline',
      completedAt: '2026-03-24T10:00:00.000Z',
      durationMinutes: 5,
      worthwhileRating: 'very',
      notes: 'Felt my shoulders drop and eye strain fade away.'
    }
  ],
  sessionHistory: [
    {
      id: 'init-sess-1',
      startedAt: '2026-03-24T09:45:00.000Z',
      endedAt: '2026-03-24T10:00:00.000Z',
      durationMinutes: 15,
      targetDurationMinutes: 15,
      cardsViewed: 4,
      worthwhileRating: 'very',
      reflectionNote: 'Calming alternative to checking notifications before work.'
    }
  ],
  totalMindfulMinutes: 20,
  soundEnabled: true,
  hapticEnabled: true,
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      // Ensure arrays and defaults exist if loaded from older schema
      selectedInterests: parsed.selectedInterests || DEFAULT_PROFILE.selectedInterests,
      completedActivities: parsed.completedActivities || DEFAULT_PROFILE.completedActivities,
      sessionHistory: parsed.sessionHistory || DEFAULT_PROFILE.sessionHistory,
      sessionTargetDurationMinutes:
        parsed.sessionTargetDurationMinutes || DEFAULT_PROFILE.sessionTargetDurationMinutes,
      dailySessionGoalMinutes:
        parsed.dailySessionGoalMinutes || DEFAULT_PROFILE.dailySessionGoalMinutes,
      hasCompletedOnboarding:
        typeof parsed.hasCompletedOnboarding === 'boolean'
          ? parsed.hasCompletedOnboarding
          : true, // Existing users with saved profiles don't need onboarding forced
    };
  } catch (e) {
    console.error('Failed to load user profile from localStorage', e);
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile to localStorage', e);
  }
}

export function loadActiveSession(): ActiveSessionState | null {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveSessionState;
    if (parsed && typeof parsed.startedAt === 'number') {
      return parsed;
    }
    return null;
  } catch (e) {
    console.error('Failed to load active session from localStorage', e);
    return null;
  }
}

export function saveActiveSession(session: ActiveSessionState | null): void {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return;
  try {
    if (!session) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } else {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Failed to save active session to localStorage', e);
  }
}

export function clearActiveSession(): void {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear active session', e);
  }
}

export function exportUserData(profile: UserProfile): string {
  const dateStr = new Date().toLocaleDateString();
  let md = `# Elsewhere - Mindful Journal & Personal History (${dateStr})\n\n`;
  md += `## Profile Summary\n- Explorer: ${profile.name}\n- Daily Intention: ${profile.dailySessionGoalMinutes} minutes\n- Selected Session Duration: ${profile.sessionTargetDurationMinutes} minutes\n- Total Mindful Minutes Invested: ${profile.totalMindfulMinutes} min\n\n`;
  md += `## Selected Topics of Curiosity\n${profile.selectedInterests.map((t: Topic) => `- ${t}`).join('\n')}\n\n`;

  md += `## Completed Sessions (${profile.sessionHistory.length})\n`;
  if (profile.sessionHistory.length === 0) {
    md += `*No sessions recorded yet.*\n\n`;
  } else {
    profile.sessionHistory.forEach((sess) => {
      md += `- **${new Date(sess.endedAt).toLocaleString()}**: ${sess.durationMinutes} min (Goal: ${sess.targetDurationMinutes}m) • ${sess.cardsViewed} curiosities • Worthwhile: ${sess.worthwhileRating || 'n/a'}\n`;
      if (sess.reflectionNote) md += `  *Note: "${sess.reflectionNote}"*\n`;
    });
    md += `\n`;
  }

  md += `## Completed Activities (${profile.completedActivities.length})\n`;
  profile.completedActivities.forEach((act) => {
    md += `- **${act.title}** (${act.durationMinutes} min) - ${new Date(act.completedAt).toLocaleDateString()}\n`;
    if (act.worthwhileRating) md += `  *Rating: ${act.worthwhileRating}*\n`;
    if (act.notes) md += `  *Reflection: "${act.notes}"*\n`;
  });
  return md;
}
