"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { Toaster } from "@/components/ui/sonner";

/**
 * Composed provider tree. Order matters:
 * Session → Query → Theme → Locale → UI.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocaleProvider>
            {children}
            <Toaster richColors position="top-center" />
          </LocaleProvider>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
