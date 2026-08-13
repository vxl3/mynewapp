import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

/** RTL-aware breadcrumb navigation. */
export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Chevron = index === 0 ? ChevronRight : ChevronLeft;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <Chevron className="h-3.5 w-3.5 text-muted-foreground/60 rtl:rotate-0" aria-hidden />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn("font-medium", isLast && "text-foreground")} aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
