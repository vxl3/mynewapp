/**
 * Shared domain types used across the UI layer.
 * Mirrors the Prisma schema without coupling the client to Prisma types.
 */

import type { RoleName } from "@/config/roles";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: RoleName;
  roles: string[];
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "LOCKED" | "DELETED";
  mfaEnabled: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  icon: string | null;
  description: string | null;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "CLOSED";
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  price: number;
  currency: string;
  durationMinutes: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface Booking {
  id: string;
  reference: string;
  businessId: string;
  serviceId: string;
  startAt: string;
  endAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  price: number;
  currency: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}
