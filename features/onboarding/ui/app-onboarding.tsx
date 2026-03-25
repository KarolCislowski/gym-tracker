'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

type OnboardingStepConfig = {
  description: string;
  selector: string;
  title: string;
};

type OnboardingRouteConfig = {
  id: string;
  steps: OnboardingStepConfig[];
};

const onboardingStoragePrefix = 'gym-tracker.onboarding';
export const replayOnboardingEventName = 'gym-tracker.onboarding.replay-current-page';

interface AppOnboardingProps {
  translations: TranslationDictionary;
}

export function AppOnboarding({ translations }: AppOnboardingProps) {
  const pathname = usePathname();
  const activeDriverRef = useRef<{ destroy: () => void; drive: () => void } | null>(
    null,
  );
  const isInternalCleanupRef = useRef(false);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      process.env.NODE_ENV === 'test' ||
      !pathname
    ) {
      return undefined;
    }

    const routeConfig = getOnboardingRouteConfig(pathname, translations);

    if (!routeConfig) {
      return undefined;
    }

    const storageKey = `${onboardingStoragePrefix}.${routeConfig.id}`;

    let isCancelled = false;

    const startOnboarding = async (force = false) => {
      if (!force && window.localStorage.getItem(storageKey) === 'completed') {
        return;
      }

      const availableSteps = routeConfig.steps.filter((step) =>
        document.querySelector(step.selector),
      );

      if (!availableSteps.length || isCancelled) {
        return;
      }

      const { driver } = await import('driver.js');

      if (isCancelled) {
        return;
      }

      activeDriverRef.current = driver({
        allowClose: true,
        animate: true,
        doneBtnText: translations.onboarding.done,
        nextBtnText: translations.onboarding.next,
        prevBtnText: translations.onboarding.previous,
        showProgress: true,
        smoothScroll: true,
        onDestroyed: () => {
          activeDriverRef.current = null;

          if (isInternalCleanupRef.current) {
            isInternalCleanupRef.current = false;

            return;
          }

          window.localStorage.setItem(storageKey, 'completed');
        },
        steps: availableSteps.map((step) => ({
          element: step.selector,
          popover: {
            description: step.description,
            title: step.title,
          },
        })),
      });

      window.setTimeout(() => {
        if (!isCancelled) {
          activeDriverRef.current?.drive();
        }
      }, 250);
    };

    void startOnboarding();

    const replayCurrentPageOnboarding = () => {
      window.localStorage.removeItem(storageKey);

      if (activeDriverRef.current) {
        isInternalCleanupRef.current = true;
        activeDriverRef.current.destroy();
      }

      window.setTimeout(() => {
        if (!isCancelled) {
          void startOnboarding(true);
        }
      }, 0);
    };

    window.addEventListener(replayOnboardingEventName, replayCurrentPageOnboarding);

    return () => {
      isCancelled = true;
      window.removeEventListener(
        replayOnboardingEventName,
        replayCurrentPageOnboarding,
      );

      if (activeDriverRef.current) {
        isInternalCleanupRef.current = true;
        activeDriverRef.current.destroy();
      }
    };
  }, [pathname, translations]);

  return null;
}

function getOnboardingRouteConfig(
  pathname: string,
  translations: TranslationDictionary,
): OnboardingRouteConfig | null {
  const t = translations.onboarding;

  if (pathname === '/') {
    return {
      id: 'dashboard.v1',
      steps: [
        {
          selector: '[data-onboarding="dashboard-overview"]',
          title: t.dashboardOverviewTitle,
          description: t.dashboardOverviewDescription,
        },
        {
          selector: '[data-onboarding="dashboard-profile"]',
          title: t.dashboardProfileTitle,
          description: t.dashboardProfileDescription,
        },
        {
          selector: '[data-onboarding="dashboard-healthy-habits"]',
          title: t.dashboardHealthyHabitsTitle,
          description: t.dashboardHealthyHabitsDescription,
        },
      ],
    };
  }

  if (pathname === '/profile') {
    return {
      id: 'profile.v1',
      steps: [
        {
          selector: '[data-onboarding="profile-details-section"]',
          title: t.profileDetailsTitle,
          description: t.profileDetailsDescription,
        },
        {
          selector: '[data-onboarding="profile-edit-action"]',
          title: t.profileEditTitle,
          description: t.profileEditDescription,
        },
        {
          selector: '[data-onboarding="healthy-habits-section"]',
          title: t.profileHealthyHabitsTitle,
          description: t.profileHealthyHabitsDescription,
        },
        {
          selector: '[data-onboarding="healthy-habits-edit-action"]',
          title: t.healthyHabitsEditTitle,
          description: t.healthyHabitsEditDescription,
        },
      ],
    };
  }

  if (pathname === '/daily-reports') {
    return {
      id: 'daily-reports.v1',
      steps: [
        {
          selector: '[data-onboarding="daily-reports-page-header"]',
          title: t.dailyReportsTitle,
          description: t.dailyReportsDescription,
        },
        {
          selector: '[data-onboarding="daily-report-create-action"]',
          title: t.dailyReportsCreateTitle,
          description: t.dailyReportsCreateDescription,
        },
        {
          selector: '[data-onboarding="daily-reports-model-card"]',
          title: t.dailyReportsModelTitle,
          description: t.dailyReportsModelDescription,
        },
        {
          selector: '[data-onboarding="daily-reports-history"]',
          title: t.dailyReportsHistoryTitle,
          description: t.dailyReportsHistoryDescription,
        },
      ],
    };
  }

  if (pathname === '/workouts') {
    return {
      id: 'workouts.v1',
      steps: [
        {
          selector: '[data-onboarding="workout-reports-page-header"]',
          title: t.workoutsTitle,
          description: t.workoutsDescription,
        },
        {
          selector: '[data-onboarding="workout-quick-start"]',
          title: t.workoutsQuickStartTitle,
          description: t.workoutsQuickStartDescription,
        },
        {
          selector: '[data-onboarding="workout-templates-card"]',
          title: t.workoutsTemplatesTitle,
          description: t.workoutsTemplatesDescription,
        },
        {
          selector: '[data-onboarding="workout-reports-history"]',
          title: t.workoutsHistoryTitle,
          description: t.workoutsHistoryDescription,
        },
      ],
    };
  }

  return null;
}
