"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/** Signed-in user menu (avatar → profile / settings / sign out). */
export function UserMenu() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  const name = session?.user?.name ?? session?.user?.email ?? "";
  const email = session?.user?.email ?? "";
  const initials = name
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-1.5" aria-label="User menu">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image ?? undefined} alt={name} />
            <AvatarFallback>{initials || "؟"}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[140px] truncate text-sm font-medium md:inline-block">
            {name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserRound className="h-4 w-4" />
            {t("dashboard.profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="h-4 w-4" />
            {t("dashboard.customer.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => void signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          {t("dashboard.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
