"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "@/translations/ar.json";
import en from "@/translations/en.json";
import { fallbackLng, dirOf } from "./settings";

/**
 * Client-side i18n singleton. Initialized once; language can be switched
 * instantly at runtime via `i18next.changeLanguage`, which also updates the
 * <html> element's `lang` and `dir` attributes for full RTL/LTR support.
 */

const isServer = typeof window === "undefined";

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: fallbackLng,
    fallbackLng,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

/** Apply a language change and sync the document direction. */
export function applyLanguage(locale: string) {
  if (isServer) return;
  void i18next.changeLanguage(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = dirOf(locale);
}

export { i18next };
