"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNav } from "@/components/dashboard/nav-config";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell items={adminNav}>{children}</DashboardShell>;
}
