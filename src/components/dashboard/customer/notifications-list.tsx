"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions/user";
import { cn, formatDate } from "@/lib/utils";
import type { Notification } from "@/types";

export function NotificationsList({ initial }: { initial: Notification[] }) {
  const [notifications, setNotifications] = useState(initial);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleMarkAll} disabled={!hasUnread}>
          <CheckCheck className="h-4 w-4" />
          تحديد الكل كمقروء
        </Button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="لا توجد إشعارات" description="ستصلك الإشعارات هنا عند وجود تحديثات." />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => !notification.isRead && handleMarkRead(notification.id)}
              className={cn(
                "flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-start transition-colors",
                notification.isRead ? "bg-background" : "border-primary/30 bg-primary/5"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!notification.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                  <p className="text-sm font-medium">{notification.title}</p>
                </div>
                {notification.body && <p className="text-sm text-muted-foreground">{notification.body}</p>}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
