"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import type { NavItem } from "@/components/dashboard/nav-config";
import { useUiStore } from "@/store/ui-store";

interface DashboardShellProps {
  items: NavItem[];
  children: React.ReactNode;
}

/** Shared application shell for customer / business / admin dashboards. */
export function DashboardShell({ items, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={items} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="container mx-auto flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>

      {/* Mobile navigation sheet */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="right" className="flex w-72 flex-col p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-gradient-to-r from-primary/15 to-fuchsia-500/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {t(item.translationKey)}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
