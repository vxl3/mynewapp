"use client";

import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { CalendarCheck, Users, Star, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard overview scaffold — greeting + placeholder KPI cards.
 * Real metrics are wired in Phase 2; the layout and design system are final.
 */
export function OverviewPage({ role }: { role: "CUSTOMER" | "BUSINESS_OWNER" | "SUPER_ADMIN" }) {
  const { data: session } = useSession();
  const { t } = useTranslation();

  const firstName = (session?.user?.name ?? "").split(" ")[0] || t("common.appName");

  const cards = [
    { icon: CalendarCheck, label: t("dashboard.customer.bookings") },
    { icon: Users, label: t("dashboard.business.employees") },
    { icon: Star, label: t("dashboard.business.reviews") },
    { icon: Wallet, label: t("dashboard.business.subscription") },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">
            {t("dashboard.welcome")}، {firstName} 👋
          </p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t(`dashboard.${role.toLowerCase()}.overview` as "dashboard.customer.overview")}
          </h1>
        </div>
        <Badge variant="glass">{t(`roles.${role}`)}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="card-hover overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-fuchsia-500/15 text-primary">
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="mt-2 h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t("dashboard.business.statistics")}</h3>
              <Badge variant="secondary">{t("common.comingSoon")}</Badge>
            </div>
            <div className="mt-6 flex h-56 items-end justify-between gap-3">
              {[40, 65, 35, 80, 55, 70, 90].map((h, i) => (
                <div key={i} className="flex w-full flex-col items-center gap-2">
                  <div
                    className="w-full animate-pulse rounded-t-lg bg-gradient-to-t from-primary/20 to-fuchsia-500/20"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold">{t("dashboard.customer.notifications")}</h3>
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
