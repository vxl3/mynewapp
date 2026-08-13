import {
  LayoutDashboard,
  UserRound,
  CalendarCheck,
  Heart,
  MessageSquare,
  Bell,
  Gift,
  TicketPercent,
  Share2,
  Settings,
  Lock,
  Building2,
  Users,
  Scissors,
  Image,
  Clock,
  Star,
  BarChart3,
  CreditCard,
  Tags,
  ScrollText,
  ShieldCheck,
  Bot,
  FileBarChart,
  MapPin,
  Globe,
  Languages,
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
  base("/dashboard/coupons", TicketPercent, "coupons", "dashboard.customer.coupons"),
  base("/dashboard/loyalty", Gift, "loyalty", "dashboard.customer.loyalty"),
  base("/dashboard/referral", Share2, "referral", "dashboard.customer.referral"),
  base("/dashboard/settings", Settings, "settings", "dashboard.customer.settings"),
  base("/dashboard/security", Lock, "security", "dashboard.customer.security"),
];

export const businessNav: NavItem[] = [
  base("/business", LayoutDashboard, "overview", "dashboard.business.overview"),
  base("/business/my-businesses", Building2, "myBusinesses", "dashboard.business.myBusinesses"),
  base("/business/profile", UserRound, "profile", "dashboard.business.profile"),
  base("/business/branches", MapPin, "branches", "dashboard.business.branches"),
  base("/business/employees", Users, "employees", "dashboard.business.employees"),
  base("/business/services", Scissors, "services", "dashboard.business.services"),
  base("/business/hours", Clock, "hours", "dashboard.business.hours"),
  base("/business/gallery", Image, "gallery", "dashboard.business.gallery"),
  base("/business/reviews", Star, "reviews", "dashboard.business.reviews"),
  base("/business/messages", MessageSquare, "messages", "dashboard.business.messages"),
  base("/business/statistics", BarChart3, "statistics", "dashboard.business.statistics"),
  base("/business/subscription", CreditCard, "subscription", "dashboard.business.subscription"),
  base("/business/settings", Settings, "settings", "dashboard.business.settings"),
];

export const adminNav: NavItem[] = [
  base("/admin", LayoutDashboard, "dashboard", "dashboard.admin.dashboard"),
  base("/admin/users", Users, "users", "dashboard.admin.users"),
  base("/admin/business-owners", Building2, "businessOwners", "dashboard.admin.businessOwners"),
  base("/admin/businesses", Scissors, "businesses", "dashboard.admin.businesses"),
  base("/admin/categories", Tags, "categories", "dashboard.admin.categories"),
  base("/admin/cities", MapPin, "cities", "dashboard.admin.cities"),
  base("/admin/countries", Globe, "countries", "dashboard.admin.countries"),
  base("/admin/subscriptions", CreditCard, "subscriptions", "dashboard.admin.subscriptions"),
  base("/admin/coupons", TicketPercent, "coupons", "dashboard.admin.coupons"),
  base("/admin/notifications", Bell, "notifications", "dashboard.admin.notifications"),
  base("/admin/reports", FileBarChart, "reports", "dashboard.admin.reports"),
  base("/admin/audit-logs", ScrollText, "auditLogs", "dashboard.admin.auditLogs"),
  base("/admin/roles", ShieldCheck, "roles", "dashboard.admin.roles"),
  base("/admin/permissions", Lock, "permissions", "dashboard.admin.permissions"),
  base("/admin/languages", Languages, "languages", "dashboard.admin.languages"),
  base("/admin/ai-settings", Bot, "aiSettings", "dashboard.admin.aiSettings"),
  base("/admin/settings", Settings, "settings", "dashboard.admin.settings"),
];

export const navByRole: Record<RoleName, NavItem[]> = {
  [RoleName.CUSTOMER]: customerNav,
  [RoleName.BUSINESS_OWNER]: businessNav,
  [RoleName.SUPER_ADMIN]: adminNav,
};
