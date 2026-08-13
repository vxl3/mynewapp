import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

/** Branded loading spinner. */
export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" };
  return (
    <div role="status" aria-label="Loading" className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
    </div>
  );
}

/** Full-page loading state with shimmering skeleton. */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <div className="h-3 w-40 animate-pulse rounded-full bg-muted" />
    </div>
  );
}
