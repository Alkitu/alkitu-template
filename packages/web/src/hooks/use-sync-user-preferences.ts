import { useEffect, useRef } from 'react';
import { useTranslationContext } from '@/context/TranslationsContext';
import { useGlobalTheme } from '@/hooks/useGlobalTheme';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Resolves a theme preference to the actual CSS class and updates localStorage + DOM.
 * Handles 'system' by checking matchMedia.
 */
function applyThemePreference(theme: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('theme-mode', theme);

  const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Syncs user's DB preferences (theme, language) with local UI systems.
 * Call once in a high-level authenticated layout (e.g., Dashboard).
 * DB is source of truth — overrides localStorage/cookie on mismatch.
 */
export function useSyncUserPreferences(
  user:
    | { theme?: string | null; language?: string | null }
    | null
    | undefined,
) {
  const { locale, setLocale } = useTranslationContext();
  const { setThemeMode } = useGlobalTheme();
  const router = useRouter();
  const pathname = usePathname();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!user || hasSynced.current) return;
    hasSynced.current = true;

    // Sync theme: DB → localStorage + CSS class + React state
    if (user.theme) {
      const currentTheme = localStorage.getItem('theme-mode') || 'system';
      if (user.theme !== currentTheme) {
        applyThemePreference(user.theme);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const resolved = user.theme === 'system'
          ? (prefersDark ? 'dark' : 'light')
          : (user.theme as 'light' | 'dark');
        setThemeMode(resolved);
      }
    }

    // Sync language: DB → cookie + context + URL
    if (user.language && user.language !== locale) {
      setLocale(user.language as 'es' | 'en');
      const currentLang = pathname.split('/').filter(Boolean)[0];
      if (currentLang !== user.language) {
        const newPath = pathname.replace(
          `/${currentLang}`,
          `/${user.language}`,
        );
        router.push(newPath);
      }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
}

export { applyThemePreference };
