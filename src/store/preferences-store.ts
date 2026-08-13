"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fallbackLng, type Locale } from "@/lib/i18n/settings";

interface PreferencesState {
  language: Locale;
  setLanguage: (language: Locale) => void;
}

/**
 * Persisted user preferences (language). Theme is handled by
 * `next-themes`; this store owns locale selection and survives reloads.
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      language: fallbackLng as Locale,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "ahjezli-preferences",
    }
  )
);
