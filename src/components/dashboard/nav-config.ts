import {
  LayoutDashboard,
  UserRound,
  CalendarCheck,
  Heart,
  MessageSquare,
  Bell,
  Gift,
  TicketPercent,
  Settings,
  Lock,
  Building2,
  Users,
  Scissors,
  Image,
  CalendarDays,
  Star,
  BarChart3,
  CreditCard,
  Tags,
  ScrollText,
  ShieldCheck,
  Bot,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";
import { RoleName } from "@/config/roles";

export interface NavItem {
  key: string;
  href: string;
  icon: LucideIcon;
  translationKey: string;
}

const base = (href: string, icon: LucideIcon, key: string, translationKey: string): NavItem => ({
  key,
  href,
  icon,
  translationKey,
});

export const customerNav: NavItem[] = [
  base("/dashboard", LayoutDashboard, "overview", "dashboard.customer.overview"),
  base("/dashboard/profile", UserRound, "profile", "dashboard.customer.profile"),
  base("/dashboard/bookings", CalendarCheck, "bookings", "dashboard.customer.bookings"),
  base("/dashboard/favorites", Heart, "favorites", "dashboard.customer.favorites"),
  base("/dashboard/messages", MessageSquare, "messages", "dashboard.customer.messages"),
  base("/dashboard/notifications", Bell, "notifications", "dashboard.customer.notifications"),
  base("/dashboard/loyalty", Gift, "loyalty", "dashboard.customer.loyalty"),
  base("/dashboard/coupons", TicketPercent, "coupons", "dashboard.customer.coupons"),
  base("/dashboard/settings", Settings, "settings", "dashboard.customer.settings"),
  base("/dashboard/security", Lock, "security", "dashboard.customer.security"),
];

export const businessNav: NavItem[] = [
  base("/business", LayoutDashboard, "overview", "dashboard.business.overview"),
  base("/business/bookings", CalendarCheck, "bookings", "dashboard.business.bookings"),
  base("/business/employees", Users, "employees", "dashboard.business.employees"),
  base("/business/services", Scissors, "services", "dashboard.business.services"),
  base("/business/gallery", Image, "gallery", "dashboard.business.gallery"),
  base("/business/schedule", CalendarDays, "schedule", "dashboard.business.schedule"),
  base("/business/messages", MessageSquare, "messages", "dashboard.business.messages"),
  base("/business/reviews", Star, "reviews", "dashboard.business.reviews"),
  base("/business/statistics", BarChart3, "statistics", "dashboard.business.statistics"),
  base("/business/settings", Settings, "settings", "dashboard.business.settings"),
  base("/business/subscription", CreditCard, "subscription", "dashboard.business.subscription"),
];

export const adminNav: NavItem[] = [
  base("/admin", LayoutDashboard, "dashboard", "dashboard.admin.dashboard"),
  base("/admin/users", Users, "users", "dashboard.admin.users"),
  base("/admin/businesses", Building2, "businesses", "dashboard.admin.businesses"),
  base("/admin/categories", Tags, "categories", "dashboard.admin.categories"),
  base("/admin/subscriptions", CreditCard, "subscriptions", "dashboard.admin.subscriptions"),
  base("/admin/coupons", TicketPercent, "coupons", "dashboard.admin.coupons"),
  base("/admin/analytics", BarChart3, "analytics", "dashboard.admin.analytics"),
  base("/admin/settings", Settings, "settings", "dashboard.admin.settings"),
  base("/admin/reports", FileBarChart, "reports", "dashboard.admin.reports"),
  base("/admin/audit-logs", ScrollText, "auditLogs", "dashboard.admin.auditLogs"),
  base("/admin/permissions", ShieldCheck, "permissions", "dashboard.admin.permissions"),
  base("/admin/ai", Bot, "ai", "dashboard.admin.ai"),
  base("/admin/notifications", Bell, "notifications", "dashboard.admin.notifications"),
];

export const navByRole: Record<RoleName, NavItem[]> = {
  [RoleName.CUSTOMER]: customerNav,
  [RoleName.BUSINESS_OWNER]: businessNav,
  [RoleName.SUPER_ADMIN]: adminNav,
};
