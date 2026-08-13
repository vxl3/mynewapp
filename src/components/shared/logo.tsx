import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  showText?: boolean;
}

/** احجزلي brand mark — gradient icon + wordmark. */
export function Logo({ href = "/", className, showText = true }: LogoProps) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-brand-500 to-fuchsia-500 shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-105">
        <CalendarCheck className="h-5 w-5 text-white" strokeWidth={2.2} />
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/20 ring-inset" />
      </span>
      {showText && (
        <span className="text-xl font-extrabold tracking-tight">
          <span className="text-gradient">احجزلي</span>
        </span>
      )}
    </Link>
  );
}
