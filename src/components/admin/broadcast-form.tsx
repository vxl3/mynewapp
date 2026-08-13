"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { broadcastNotification } from "@/lib/actions/admin";
import { broadcastSchema } from "@/lib/validations";

export function BroadcastForm() {
  const [sending, setSending] = useState(false);

  const form = useForm({
    resolver: zodResolver(broadcastSchema),
    defaultValues: { title: "", body: "", audience: "ALL", type: "SYSTEM" },
  });

  async function onSubmit(values: Record<string, unknown>) {
    setSending(true);
    const result = await broadcastNotification(values);
    setSending(false);
    if (result.ok) {
      toast.success("تم إرسال الإشعار");
      form.reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit(v as unknown as Record<string, unknown>))} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الإشعار</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نص الإشعار</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الجمهور المستهدف</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-background/60 px-3 text-sm"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="ALL">الجميع</option>
                    <option value="CUSTOMERS">العملاء</option>
                    <option value="BUSINESS_OWNERS">أصحاب الأنشطة</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    <option value="SYSTEM">نظام</option>
                    <option value="PROMOTION">ترويجي</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" variant="gradient" disabled={sending}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 rtl:-scale-x-100" />}
          إرسال الإشعار
        </Button>
      </form>
    </Form>
  );
}
