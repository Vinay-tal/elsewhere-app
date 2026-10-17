'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef
} from 'react';
import {
  UserProfile,
  Topic,
  ContentItem,
  ChallengeItem,
  OfflineActivity,
  ActiveSessionState,
  WorthwhileRating
} from '@/types';
import {
  loadUserProfile,
  saveUserProfile,
  DEFAULT_PROFILE,
  loadActiveSession,
  saveActiveSession
} from '@/lib/storage';
import {
  createInitialSession,
  computeElapsedSeconds,
  pauseSession,
  resumeSession,
  setSessionTarget,
  createSessionRecord
} from '@/lib/sessionService';
import { playGentleChime, playSoftTap } from '@/lib/audio';

interface AppContextType {
  profile: UserProfile;
  isLoaded: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleInterest: (topic: Topic) => void;
  toggleLike: (itemId: string) => void;
  toggleSave: (itemId: string) => void;
  isSaved: (itemId: string) => boolean;
  dismissItem: (itemId: string) => void;
  recordChallengeAnswer: (challengeId: string, selectedIndex: number, isCorrect: boolean) => void;
  completeOfflineActivity: (
    activityId: string,
    title: string,
    duration: number,
    notes?: string,
    rating?: WorthwhileRating
  ) => void;
  logFindSomethingCompletion: (
    activityId: string,
    title: string,
    duration: number,
    notes?: string,
    rating?: WorthwhileRating
  ) => void;

  // Onboarding
  isOnboardingModalOpen: boolean;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
  completeOnboarding: (
    interests: Topic[],
    targetDurationMinutes: number,
    dailyGoalMinutes?: number
  ) => void;

  // Session tracking & Wall-clock Wellbeing
  activeSession: ActiveSessionState;
  sessionSeconds: number;
  sessionCardsViewed: number;
  incrementCardsViewed: () => void;
  setSessionTargetDuration: (minutes: number) => void;
  pauseSessionTimer: () => void;
  resumeSessionTimer: () => void;
  resetSessionTimer: (newTargetMinutes?: number) => void;
  endSessionWithReflection: (rating: WorthwhileRating, reflectionNote?: string) => void;

  // End of session modal
  isEndOfSessionModalOpen: boolean;
  openEndOfSessionModal: () => void;
  closeEndOfSessionModal: () => void;

  // Mindful pause modal (checkpoint modal)
  isMindfulPauseModalOpen: boolean;
  openMindfulPauseModal: () => void;
  closeMindfulPauseModal: () => void;

  // Modals & Active items
  isFindSomethingModalOpen: boolean;
  findSomethingInitialDuration: number | null;
  findSomethingInitialMood: string | null;
  openFindSomethingModal: (opts?: { duration?: number; mood?: string }) => void;
  closeFindSomethingModal: () => void;

  activeArticle: ContentItem | null;
  openArticleModal: (item: ContentItem) => void;
  closeArticleModal: () => void;

  activeChallenge: ChallengeItem | null;
  openChallengeModal: (challenge: ChallengeItem) => void;
  closeChallengeModal: () => void;

  activeOfflineActivity: OfflineActivity | null;
  openOfflineTimer: (activity: OfflineActivity) => void;
  closeOfflineTimer: () => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Active Session State (Wall-clock based) - SSR safe default
  const [activeSession, setActiveSession] = useState<ActiveSessionState>(() =>
    createInitialSession(15, 0)
  );
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Modals state
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isEndOfSessionModalOpen, setIsEndOfSessionModalOpen] = useState(false);
  const [isMindfulPauseModalOpen, setIsMindfulPauseModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Find Something For Me state
  const [isFindSomethingModalOpen, setIsFindSomethingModalOpen] = useState(false);
  const [findSomethingInitialDuration, setFindSomethingInitialDuration] = useState<number | null>(null);
  const [findSomethingInitialMood, setFindSomethingInitialMood] = useState<string | null>(null);

  const [activeArticle, setActiveArticle] = useState<ContentItem | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeItem | null>(null);
  const [activeOfflineActivity, setActiveOfflineActivity] = useState<OfflineActivity | null>(null);

  // Ref to always access latest session state in event listeners without re-binding
  const sessionRef = useRef(activeSession);
  useEffect(() => {
    sessionRef.current = activeSession;
  }, [activeSession]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const loadedProfile = loadUserProfile();
      setProfile(loadedProfile);

      const savedSession = loadActiveSession();
      if (savedSession) {
        setActiveSession(savedSession);
        const elapsed = computeElapsedSeconds(savedSession, Date.now());
        setSessionSeconds(elapsed);
      } else {
        const fresh = createInitialSession(loadedProfile.sessionTargetDurationMinutes || 15, Date.now());
        setActiveSession(fresh);
        setSessionSeconds(0);
        saveActiveSession(fresh);
      }

      // First time user: trigger onboarding modal only if explicitly not completed
      if (!loadedProfile.hasCompletedOnboarding) {
        setIsOnboardingModalOpen(true);
      }
    } catch (err) {
      console.warn('AppContext initialization warning:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save profile to storage whenever profile changes after initial load
  useEffect(() => {
    if (isLoaded) {
      saveUserProfile(profile);
    }
  }, [profile, isLoaded]);

  // Save active session to storage
  useEffect(() => {
    if (isLoaded) {
      saveActiveSession(activeSession);
    }
  }, [activeSession, isLoaded]);

  // Wall-Clock Accurate Timer Loop
  useEffect(() => {
    const updateTick = () => {
      const current = sessionRef.current;
      const now = Date.now();
      const elapsed = computeElapsedSeconds(current, now);
      setSessionSeconds(elapsed);

      // Check if target session duration limit is reached
      const targetSeconds = current.targetDurationMinutes * 60;
      if (elapsed >= targetSeconds && !current.hasShownEndingModal) {
        setActiveSession((prev) => ({ ...prev, hasShownEndingModal: true }));
        setIsEndOfSessionModalOpen(true);
        playGentleChime(profile.soundEnabled);
      }
    };

    // Run interval for smooth UI display
    const interval = setInterval(updateTick, 1000);

    // Also run on visibilitychange / window focus to immediately catch up after tab sleep
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateTick();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', updateTick);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', updateTick);
    };
  }, [profile.soundEnabled]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleInterest = useCallback((topic: Topic) => {
    setProfile((prev) => {
      const exists = prev.selectedInterests.includes(topic);
      const nextInterests = exists
        ? prev.selectedInterests.filter((t) => t !== topic)
        : [...prev.selectedInterests, topic];
      playSoftTap(prev.soundEnabled);
      return { ...prev, selectedInterests: nextInterests };
    });
  }, []);

  const toggleLike = useCallback(
    (itemId: string) => {
      setProfile((prev) => {
        const isLiked = prev.likedItemIds.includes(itemId);
        const nextLikes = isLiked
          ? prev.likedItemIds.filter((id) => id !== itemId)
          : [...prev.likedItemIds, itemId];
        playSoftTap(prev.soundEnabled);
        showToast(isLiked ? 'Removed from favorites' : 'Added to favorites');
        return { ...prev, likedItemIds: nextLikes };
      });
    },
    [showToast]
  );

  const toggleSave = useCallback(
    (itemId: string) => {
      setProfile((prev) => {
        const isSaved = prev.savedItemIds.includes(itemId);
        const nextSaves = isSaved
          ? prev.savedItemIds.filter((id) => id !== itemId)
          : [...prev.savedItemIds, itemId];
        playSoftTap(prev.soundEnabled);
        showToast(isSaved ? 'Bookmark removed' : 'Saved to your library');
        return { ...prev, savedItemIds: nextSaves };
      });
    },
    [showToast]
  );

  const isSaved = useCallback(
    (itemId: string) => profile.savedItemIds.includes(itemId),
    [profile.savedItemIds]
  );

  const dismissItem = useCallback(
    (itemId: string) => {
      setProfile((prev) => {
        const nextDismissed = [...prev.dismissedItemIds, itemId];
        playSoftTap(prev.soundEnabled);
        showToast('Dismissed from feed');
        return { ...prev, dismissedItemIds: nextDismissed };
      });
    },
    [showToast]
  );

  const recordChallengeAnswer = useCallback(
    (challengeId: string, selectedIndex: number, isCorrect: boolean) => {
      setProfile((prev) => {
        const alreadyCompleted = prev.completedChallengeIds.includes(challengeId);
        const nextIds = alreadyCompleted
          ? prev.completedChallengeIds
          : [...prev.completedChallengeIds, challengeId];

        const nextScores = {
          ...prev.completedChallengeScores,
          [challengeId]: { selected: selectedIndex, correct: isCorrect },
        };

        if (isCorrect) {
          playGentleChime(prev.soundEnabled);
        } else {
          playSoftTap(prev.soundEnabled);
        }

        return {
          ...prev,
          completedChallengeIds: nextIds,
          completedChallengeScores: nextScores,
          totalMindfulMinutes: alreadyCompleted
            ? prev.totalMindfulMinutes
            : prev.totalMindfulMinutes + 2,
        };
      });
    },
    []
  );

  const completeOfflineActivity = useCallback(
    (
      activityId: string,
      title: string,
      duration: number,
      notes?: string,
      rating: WorthwhileRating = 'very'
    ) => {
      setProfile((prev) => {
        const newRecord = {
          id: 'act-' + Date.now(),
          activityId,
          title,
          category: 'offline' as const,
          completedAt: new Date().toISOString(),
          durationMinutes: duration,
          notes,
          worthwhileRating: rating,
        };
        playGentleChime(prev.soundEnabled);
        showToast('Activity logged. Great job stepping away!');
        return {
          ...prev,
          completedActivities: [newRecord, ...prev.completedActivities],
          totalMindfulMinutes: prev.totalMindfulMinutes + duration,
        };
      });
    },
    [showToast]
  );

  const logFindSomethingCompletion = useCallback(
    (
      activityId: string,
      title: string,
      duration: number,
      notes?: string,
      rating: WorthwhileRating = 'very'
    ) => {
      setProfile((prev) => {
        const newRecord = {
          id: 'act-' + Date.now(),
          activityId,
          title,
          category: 'find-something' as const,
          completedAt: new Date().toISOString(),
          durationMinutes: duration,
          notes,
          worthwhileRating: rating,
        };
        playGentleChime(prev.soundEnabled);
        showToast('Activity completed mindfully!');
        return {
          ...prev,
          completedActivities: [newRecord, ...prev.completedActivities],
          totalMindfulMinutes: prev.totalMindfulMinutes + duration,
        };
      });
    },
    [showToast]
  );

  const incrementCardsViewed = useCallback(() => {
    setActiveSession((prev) => {
      const nextCount = prev.cardsViewed + 1;
      // Gentle pause suggestion at 6 cards
      if (nextCount === 6) {
        setIsMindfulPauseModalOpen(true);
      }
      return { ...prev, cardsViewed: nextCount };
    });
  }, []);

  // Session Control Functions
  const setSessionTargetDuration = useCallback((minutes: number) => {
    setActiveSession((prev) => setSessionTarget(prev, minutes));
    setProfile((prev) => ({ ...prev, sessionTargetDurationMinutes: minutes }));
  }, []);

  const pauseSessionTimer = useCallback(() => {
    setActiveSession((prev) => pauseSession(prev, Date.now()));
  }, []);

  const resumeSessionTimer = useCallback(() => {
    setActiveSession((prev) => resumeSession(prev, Date.now()));
  }, []);

  const resetSessionTimer = useCallback((newTargetMinutes?: number) => {
    const target = newTargetMinutes || profile.sessionTargetDurationMinutes || 15;
    const fresh = createInitialSession(target, Date.now());
    setActiveSession(fresh);
    setSessionSeconds(0);
    saveActiveSession(fresh);
  }, [profile.sessionTargetDurationMinutes]);

  const endSessionWithReflection = useCallback(
    (rating: WorthwhileRating, reflectionNote?: string) => {
      const now = Date.now();
      const record = createSessionRecord(sessionRef.current, rating, reflectionNote, now);

      setProfile((prev) => ({
        ...prev,
        sessionHistory: [record, ...prev.sessionHistory],
        totalMindfulMinutes: prev.totalMindfulMinutes + record.durationMinutes,
      }));

      // Start a fresh session with user's target
      const fresh = createInitialSession(sessionRef.current.targetDurationMinutes, now);
      setActiveSession(fresh);
      setSessionSeconds(0);
      saveActiveSession(fresh);

      showToast('Session reflection recorded');
    },
    [showToast]
  );

  // Onboarding controls
  const openOnboardingModal = useCallback(() => {
    setIsOnboardingModalOpen(true);
  }, []);

  const closeOnboardingModal = useCallback(() => {
    setIsOnboardingModalOpen(false);
    setProfile((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  }, []);

  const completeOnboarding = useCallback(
    (interests: Topic[], targetDurationMinutes: number, dailyGoalMinutes?: number) => {
      setProfile((prev) => ({
        ...prev,
        hasCompletedOnboarding: true,
        selectedInterests: interests,
        sessionTargetDurationMinutes: targetDurationMinutes,
        dailySessionGoalMinutes: dailyGoalMinutes || prev.dailySessionGoalMinutes,
      }));
      setSessionTargetDuration(targetDurationMinutes);
      setIsOnboardingModalOpen(false);
      showToast('Welcome to Elsewhere! Feed updated.');
    },
    [setSessionTargetDuration, showToast]
  );

  const openFindSomethingModal = useCallback(
    (opts?: { duration?: number; mood?: string }) => {
      setFindSomethingInitialDuration(opts?.duration ?? null);
      setFindSomethingInitialMood(opts?.mood ?? null);
      setIsFindSomethingModalOpen(true);
      playSoftTap(profile.soundEnabled);
    },
    [profile.soundEnabled]
  );

  return (
    <AppContext.Provider
      value={{
        profile,
        isLoaded,
        updateProfile,
        toggleInterest,
        toggleLike,
        toggleSave,
        isSaved,
        dismissItem,
        recordChallengeAnswer,
        completeOfflineActivity,
        logFindSomethingCompletion,

        // Onboarding
        isOnboardingModalOpen,
        openOnboardingModal,
        closeOnboardingModal,
        completeOnboarding,

        // Session tracking & Wall-clock Wellbeing
        activeSession,
        sessionSeconds,
        sessionCardsViewed: activeSession.cardsViewed,
        incrementCardsViewed,
        setSessionTargetDuration,
        pauseSessionTimer,
        resumeSessionTimer,
        resetSessionTimer,
        endSessionWithReflection,

        // End of session modal
        isEndOfSessionModalOpen,
        openEndOfSessionModal: () => setIsEndOfSessionModalOpen(true),
        closeEndOfSessionModal: () => setIsEndOfSessionModalOpen(false),

        // Mindful pause modal
        isMindfulPauseModalOpen,
        openMindfulPauseModal: () => setIsMindfulPauseModalOpen(true),
        closeMindfulPauseModal: () => setIsMindfulPauseModalOpen(false),

        // Modals & Active items
        isFindSomethingModalOpen,
        findSomethingInitialDuration,
        findSomethingInitialMood,
        openFindSomethingModal,
        closeFindSomethingModal: () => setIsFindSomethingModalOpen(false),

        activeArticle,
        openArticleModal: (item) => {
          setActiveArticle(item);
          incrementCardsViewed();
        },
        closeArticleModal: () => setActiveArticle(null),

        activeChallenge,
        openChallengeModal: (ch) => {
          setActiveChallenge(ch);
          incrementCardsViewed();
        },
        closeChallengeModal: () => setActiveChallenge(null),

        activeOfflineActivity,
        openOfflineTimer: (act) => setActiveOfflineActivity(act),
        closeOfflineTimer: () => setActiveOfflineActivity(null),

        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
