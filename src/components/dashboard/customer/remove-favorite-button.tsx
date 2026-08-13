"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeFavorite } from "@/lib/actions/user";

export function RemoveFavoriteButton({ businessId }: { businessId: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Remove favorite"
      onClick={async () => {
        const result = await removeFavorite(businessId);
        if (!result.ok) toast.error(result.error);
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
