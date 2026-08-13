"use client";

import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface StructurePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  count: number;
}

/**
 * Phase-2 "structure only" module: prepared UI with a disabled create action.
 * The full CRUD lands with the booking system in Phase 3.
 */
export function StructurePlaceholder({ icon, title, description, count }: StructurePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button variant="gradient" size="sm" disabled title="متاح في المرحلة الثالثة">
          <Plus className="h-4 w-4" /> إضافة
        </Button>
      </div>
      <EmptyState
        icon={icon}
        title={count > 0 ? `${count} ${title}` : `لا يوجد ${title} بعد`}
        description={description}
      />
      <div className="text-center">
        <Badge variant="secondary">إدارة كاملة قادمة في المرحلة الثالثة</Badge>
      </div>
    </div>
  );
}
