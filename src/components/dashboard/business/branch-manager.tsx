"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createBranch, deleteBranch } from "@/lib/actions/business";
import { branchSchema } from "@/lib/validations";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { City } from "@prisma/client";

interface BranchManagerProps {
  businessId: string;
  cities: City[];
}

export function BranchManager({ businessId, cities }: BranchManagerProps) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: "", nameAr: "", address: "", phone: "", cityId: "", isMain: false },
  });

  async function onSubmit(values: Record<string, unknown>) {
    const result = await createBranch({ ...values, businessId });
    if (result.ok) {
      toast.success("تمت إضافة الفرع");
      setOpen(false);
      form.reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm">
          <Plus className="h-4 w-4" />
          إضافة فرع
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة فرع جديد</DialogTitle>
          <DialogDescription>أضف فرعاً جديداً لنشاطك التجاري.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => onSubmit(v as unknown as Record<string, unknown>))} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الفرع</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الهاتف</FormLabel>
                  <FormControl>
                    <Input dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدينة</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-background/60 px-3 text-sm"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="">اختر المدينة</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.nameAr || city.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant="gradient">
                <Plus className="h-4 w-4" /> إضافة
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteBranchButton({ branchId }: { branchId: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon" aria-label="Delete branch">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
      title="حذف الفرع"
      description="هل أنت متأكد من حذف هذا الفرع؟ لا يمكن التراجع عن هذا الإجراء."
      onConfirm={async () => {
        const result = await deleteBranch(branchId);
        if (!result.ok) toast.error(result.error);
      }}
    />
  );
}

export function MainBranchBadge() {
  return <Badge variant="default">الفرع الرئيسي</Badge>;
}
