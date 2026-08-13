"use client";

import { CalendarCheck } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={CalendarCheck} titleKey="dashboard.customer.bookings" />;
}
