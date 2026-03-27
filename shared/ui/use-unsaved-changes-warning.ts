'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseUnsavedChangesWarningOptions {
  enabled?: boolean;
  message: string;
}

/**
 * Warns the user before losing unsaved form changes during browser unloads and link-based navigation.
 * @param options - Configuration for the unsaved-changes guard.
 * @param options.enabled - Whether the guard should be active for the current form.
 * @param options.message - Localized confirmation message shown before navigation.
 * @returns Guard helpers for editable forms.
 * Returns `formRef`, which should be attached to the guarded form, and `markSubmitted`,
 * which should be called during submit capture so successful submits do not trigger the warning.
 * @remarks The current implementation intercepts `beforeunload` and anchor clicks.
 * It does not independently guard every possible client-side navigation mechanism.
 */
export function useUnsavedChangesWarning({
  enabled = true,
  message,
}: UseUnsavedChangesWarningOptions) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const baselineRef = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);

  const captureBaseline = useCallback(() => {
    if (!formRef.current) {
      baselineRef.current = null;
      return;
    }

    baselineRef.current = serializeForm(formRef.current);
  }, []);

  const hasUnsavedChanges = useCallback(() => {
    if (!enabled || isSubmittingRef.current || !formRef.current) {
      return false;
    }

    if (baselineRef.current == null) {
      return false;
    }

    return serializeForm(formRef.current) !== baselineRef.current;
  }, [enabled]);

  const markSubmitted = useCallback(() => {
    isSubmittingRef.current = true;
  }, []);

  useEffect(() => {
    isSubmittingRef.current = false;

    if (!enabled) {
      baselineRef.current = null;
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      captureBaseline();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [captureBaseline, enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges()) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a[href]');

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (anchor.target && anchor.target !== '_self') {
        return;
      }

      if (anchor.hasAttribute('download')) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const isSameDocument =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash === currentUrl.hash;

      if (isSameDocument || !hasUnsavedChanges()) {
        return;
      }

      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      isSubmittingRef.current = true;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [enabled, hasUnsavedChanges, message]);

  return { formRef, markSubmitted };
}

function serializeForm(form: HTMLFormElement): string {
  const formData = new FormData(form);
  const entries = Array.from(formData.entries()).map(([key, value]) => [
    key,
    typeof value === 'string' ? value : value.name,
  ]);

  return JSON.stringify(entries);
}
