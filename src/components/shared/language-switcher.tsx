"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePreferencesStore } from "@/store/preferences-store";
import { applyLanguage } from "@/lib/i18n/client";
import { languages, type Locale } from "@/lib/i18n/settings";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  variant?: "ghost" | "outline" | "glass";
}

/** Instant Arabic ↔ English switcher (full RTL/LTR flip). */
export function LanguageSwitcher({ variant = "ghost" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const setLanguage = usePreferencesStore((s) => s.setLanguage);
  const current = (i18n.language ?? "ar") as Locale;

  const handleChange = (value: string) => {
    const locale = value as Locale;
    setLanguage(locale);
    applyLanguage(locale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" aria-label="Language" className="relative">
          <Languages className="h-[18px] w-[18px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={current} onValueChange={handleChange}>
          {languages.map((lang) => (
            <DropdownMenuRadioItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold">{lang.name}</span>
                <span className="text-xs text-muted-foreground">{lang.code.toUpperCase()}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
