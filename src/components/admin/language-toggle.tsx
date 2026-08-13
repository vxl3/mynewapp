"use client";

import { toast } from "sonner";
import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLanguage } from "@/lib/actions/admin";

export function LanguageToggle({ code }: { code: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle language"
      onClick={async () => {
        const result = await toggleLanguage(code);
        if (!result.ok) toast.error(result.error);
      }}
    >
      <Power className="h-4 w-4" />
    </Button>
  );
}
