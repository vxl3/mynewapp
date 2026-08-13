"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Accessible, RTL-aware pagination control. */
export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageItems(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </Button>

      {pages.map((item, index) =>
        item === "ellipsis" ? (
          <span key={`e-${index}`} className="flex h-9 w-9 items-center justify-center text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "default" : "ghost"}
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </Button>
    </nav>
  );
}

function getPageItems(page: number, totalPages: number): Array<number | "ellipsis"> {
  const items: Array<number | "ellipsis"> = [];
  const push = (v: number | "ellipsis") => items.push(v);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) push(i);
    return items;
  }

  push(1);
  if (page > 3) push("ellipsis");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) push(i);
  if (page < totalPages - 2) push("ellipsis");
  push(totalPages);
  return items;
}
