"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { applyLanguage } from "@/lib/i18n/client";

/**
 * Applies the persisted language preference on mount and keeps the
 * document's `lang` / `dir` attributes in sync for full RTL/LTR support.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const language = usePreferencesStore((s) => s.language);

  useEffect(() => {
    applyLanguage(language);
  }, [language]);

  return <>{children}</>;
}
