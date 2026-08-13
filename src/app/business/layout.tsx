"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { businessNav } from "@/components/dashboard/nav-config";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell items={businessNav}>{children}</DashboardShell>;
}
