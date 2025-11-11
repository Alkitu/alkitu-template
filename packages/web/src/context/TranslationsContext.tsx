"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { getCookie, setCookie } from "cookies-next";
import { Translations, TranslationsProviderProps, Locale } from "../types/translations";
import defaultTranslations from "../locales/es/common.json";

interface TranslationsContextType {
  t: (
    key: string,
    params?: Record<string, string | number>,
    namespace?: string
  ) => string;
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  isLoading: boolean;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(
  undefined
);

const COOKIE_NAME = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export function TranslationsProvider({
  children,
  initialLocale,
  initialTranslations,
}: TranslationsProviderProps) {
  const [translations, setTranslations] = useState<Translations>(initialTranslations);
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isLoading, setIsLoading] = useState(false);

  console.log('TranslationContext.tsx - Initial Locale:', initialLocale);
  console.log('TranslationContext.tsx - Initial Translations:', initialTranslations);
  console.log('TranslationContext.tsx - Current Locale State:', locale);
  console.log('TranslationContext.tsx - Current Translations State:', translations);

  const setLocale = useCallback(
    async (newLocale: Locale) => {
      if (newLocale !== locale) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/translations?lang=${newLocale}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setTranslations(data);
          setLocaleState(newLocale);
          setCookie(COOKIE_NAME, newLocale, {
            maxAge: COOKIE_MAX_AGE,
            path: "/",
          });
        } catch (error) {
          console.error("Error loading translations:", error);
          // Fallback to default translations or handle error appropriately
          setTranslations(defaultTranslations);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [locale]
  );

  

  const t = useCallback(
    (
      key: string,
      params?: Record<string, string | number>,
      namespace?: string
    ): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const keys = fullKey.split(".");
      let current: any = translations;

      for (const k of keys) {
        if (current[k] === undefined) {
          console.warn(`Translation key not found: ${fullKey}`);
          return fullKey;
        }
        current = current[k];
      }

      if (typeof current !== "string") {
        console.warn(`Invalid translation key: ${fullKey}`);
        return fullKey;
      }

      if (params) {
        return Object.entries(params).reduce(
          (acc, [paramKey, paramValue]) =>
            acc.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue)),
          current
        );
      }

      return current;
    },
    [translations]
  );

  const contextValue = useMemo(
    () => ({
      t,
      locale,
      setLocale,
      isLoading,
    }),
    [t, locale, setLocale, isLoading]
  );

  return (
    <TranslationsContext.Provider value={contextValue}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations(namespace?: string) {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error(
      "useTranslations must be used within a TranslationsProvider"
    );
  }

  if (namespace) {
    return (key: string, params?: Record<string, string | number>) =>
      context.t(key, params, namespace);
  }

  return context.t;
}

export function useTranslationContext() {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within a TranslationsProvider"
    );
  }
  return context;
}
