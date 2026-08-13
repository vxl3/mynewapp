"use client";

import { Menu, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/dashboard/user-menu";
import { NotificationBell } from "@/components/dashboard/notification-bell";

interface TopbarProps {
  onOpenMobileNav: () => void;
}

/** Dashboard top bar — mobile nav trigger, search, controls, user menu. */
export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobileNav} aria-label="Menu">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("dashboard.search")} className="ps-9" />
      </div>

      <div className="ms-auto flex items-center gap-1.5">
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
