"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Power, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { createCategory, toggleCategory, deleteCategory } from "@/lib/actions/admin";
import { categorySchema } from "@/lib/validations";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function CategoryManager() {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", nameAr: "", slug: "", description: "", icon: "" },
  });

  async function onSubmit(values: Record<string, unknown>) {
    const result = await createCategory(values);
    if (result.ok) {
      toast.success("تمت إضافة التصنيف");
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
          <Plus className="h-4 w-4" /> تصنيف جديد
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة تصنيف جديد</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => onSubmit(v as unknown as Record<string, unknown>))} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم (EN)</FormLabel>
                    <FormControl>
                      <Input dir="ltr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم (عربي)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المعرّف (Slug)</FormLabel>
                  <FormControl>
                    <Input dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الأيقونة (اختياري)</FormLabel>
                  <FormControl>
                    <Input dir="ltr" placeholder="scissors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant="gradient">إضافة</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function ToggleCategoryButton({ categoryId }: { categoryId: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle category"
      onClick={async () => {
        const result = await toggleCategory(categoryId);
        if (!result.ok) toast.error(result.error);
      }}
    >
      <Power className="h-4 w-4" />
    </Button>
  );
}

export function DeleteCategoryButton({ categoryId, name }: { categoryId: string; name: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon" aria-label="Delete category">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
      title="حذف التصنيف"
      description={`هل تريد حذف تصنيف "${name}"؟`}
      onConfirm={async () => {
        const result = await deleteCategory(categoryId);
        if (!result.ok) toast.error(result.error);
        else toast.success("تم حذف التصنيف");
      }}
    />
  );
}
