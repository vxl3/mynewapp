"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";

interface ThemeToggleProps {
  variant?: "ghost" | "outline" | "glass";
}

/** Dark / Light / System theme switcher. */
export function ThemeToggle({ variant = "ghost" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const icon =
    theme === "dark" ? (
      <Moon className="h-[18px] w-[18px]" />
    ) : theme === "light" ? (
      <Sun className="h-[18px] w-[18px]" />
    ) : (
      <Monitor className="h-[18px] w-[18px]" />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" aria-label="Theme" suppressHydrationWarning>
          {mounted ? icon : <Sun className="h-[18px] w-[18px]" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={(v) => setTheme(v)}>
          <DropdownMenuRadioItem value="light">
            <Sun className="me-2 h-4 w-4" /> فاتح / Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="me-2 h-4 w-4" /> داكن / Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="me-2 h-4 w-4" /> النظام / System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
