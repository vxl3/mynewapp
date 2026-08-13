import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Absolute URL helper (respects the public app URL). */
export function absoluteUrl(path = ""): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Format a currency value for display. */
export function formatCurrency(amount: number, currency = "USD", locale = "ar") {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-IQ" : "en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/** Format a date for display, honoring the active locale. */
export function formatDate(date: Date | string, locale = "ar") {
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-IQ" : "en-US", {
      dateStyle: "medium",
    }).format(new Date(date));
  } catch {
    return String(date);
  }
}

/** Truncate a string to a maximum length with an ellipsis. */
export function truncate(text: string, length = 80) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

/** Sleep helper (used by loading simulations and retry backoff). */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
