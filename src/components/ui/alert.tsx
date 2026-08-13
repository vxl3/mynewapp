import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "info" | "success" | "warning" | "destructive";
}

const variants = {
  default: { icon: Info, className: "border-border bg-card text-foreground" },
  info: { icon: Info, className: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  success: { icon: CircleCheck, className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  warning: { icon: TriangleAlert, className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  destructive: { icon: CircleAlert, className: "border-destructive/30 bg-destructive/10 text-destructive" },
};

export function Alert({ variant = "default", className, children, ...props }: AlertProps) {
  const { icon: Icon, className: variantClass } = variants[variant];
  return (
    <div
      role="alert"
      className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm", variantClass, className)}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="[&>div]:flex [&>div]:flex-col [&>div]:gap-1">{children}</div>
    </div>
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm opacity-90", className)} {...props} />;
}
