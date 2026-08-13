"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NavItem } from "@/components/dashboard/nav-config";
import { useUiStore } from "@/store/ui-store";

interface SidebarProps {
  items: NavItem[];
}

/** Desktop sidebar navigation. */
export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e bg-card/60 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Logo />
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-primary/15 to-fuchsia-500/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn("h-[18px] w-[18px] shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}
                />
                {t(item.translationKey)}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="glass rounded-xl p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">{t("common.appName")}</p>
          <p className="mt-1">v0.1.0 — Phase 1</p>
        </div>
      </div>
    </aside>
  );
}
