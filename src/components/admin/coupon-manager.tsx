"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Power } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
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
import { createCoupon, toggleCoupon } from "@/lib/actions/admin";
import { couponSchema } from "@/lib/validations";

export function CouponManager() {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: "", type: "PERCENT", scope: "PLATFORM", value: 10, maxUses: undefined, expiresAt: "" },
  });

  async function onSubmit(values: Record<string, unknown>) {
    const result = await createCoupon(values);
    if (result.ok) {
      toast.success("تم إنشاء الكوبون");
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
          <Plus className="h-4 w-4" /> كوبون جديد
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إنشاء كوبون جديد</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => onSubmit(v as unknown as Record<string, unknown>))} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز الكوبون</FormLabel>
                  <FormControl>
                    <Input dir="ltr" placeholder="SAVE20" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>النوع</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-lg border border-input bg-background/60 px-3 text-sm"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value="PERCENT">نسبة مئوية</option>
                        <option value="FIXED">مبلغ ثابت</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>القيمة</FormLabel>
                    <FormControl>
                      <Input type="number" dir="ltr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحد الأقصى للاستخدام</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        dir="ltr"
                        placeholder="غير محدود"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ الانتهاء</FormLabel>
                    <FormControl>
                      <Input type="date" dir="ltr" value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" variant="gradient">إنشاء</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function ToggleCouponButton({ couponId }: { couponId: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle coupon"
      onClick={async () => {
        const result = await toggleCoupon(couponId);
        if (!result.ok) toast.error(result.error);
      }}
    >
      <Power className="h-4 w-4" />
    </Button>
  );
}
