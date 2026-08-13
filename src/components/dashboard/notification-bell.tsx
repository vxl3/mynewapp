"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions/user";
import type { Notification } from "@/types";

/** Top-bar notification center with live unread badge. */
export function NotificationBell() {
  const { t } = useTranslation();

  const { data, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/v1/me/notifications");
      if (!res.ok) return { notifications: [] as Notification[], unread: 0 };
      return (await res.json()) as { notifications: Notification[]; unread: number };
    },
    refetchInterval: 60_000,
  });

  const notifications = data?.notifications ?? [];
  const unread = data?.unread ?? 0;

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    refetch();
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    refetch();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("dashboard.customer.notifications")} className="relative">
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0">{t("dashboard.customer.notifications")}</DropdownMenuLabel>
          {unread > 0 && (
            <button onClick={handleMarkAll} className="text-xs font-medium text-primary hover:underline">
              {t("common.viewAll")}
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {t("errors.genericDesc")}
            </p>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => handleMarkRead(notification.id)}
                className="flex flex-col items-start gap-1 py-3"
              >
                <span className="flex w-full items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${notification.isRead ? "bg-muted" : "bg-primary"}`} />
                  <span className="text-sm font-medium">{notification.title}</span>
                </span>
                {notification.body && (
                  <span className="line-clamp-2 ps-4 text-xs text-muted-foreground">{notification.body}</span>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/notifications" className="justify-center text-sm font-medium text-primary">
            {t("common.viewAll")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
