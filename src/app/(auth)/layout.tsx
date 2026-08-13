import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export const metadata: Metadata = {
  title: "Authentication",
  robots: { index: false, follow: false },
};

/**
 * Shared layout for authentication pages — centered glass card over a
 * gradient mesh backdrop, with language + theme controls pinned top-end.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-mesh relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 start-1/4 h-72 w-72 animate-float rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 end-1/4 h-80 w-80 animate-float rounded-full bg-fuchsia-500/15 blur-3xl [animation-delay:1.5s]" />
      </div>

      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="glass" />
          <ThemeToggle variant="glass" />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 py-10">
        <div className="glass-strong w-full max-w-md rounded-3xl p-6 shadow-2xl md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
