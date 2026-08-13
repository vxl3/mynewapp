"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { createCountry, createCity } from "@/lib/actions/admin";
import { countrySchema, citySchema } from "@/lib/validations";
import type { Country } from "@prisma/client";

export function CountryManager() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(countrySchema),
    defaultValues: { code: "", name: "", nameAr: "", phoneCode: "", currency: "USD" },
  });

  async function onSubmit(values: Record<string, unknown>) {
    const result = await createCountry(values);
    if (result.ok) {
      toast.success("تمت إضافة الدولة");
      setOpen(false);
      form.reset();
    } else toast.error(result.error);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm">
          <Plus className="h-4 w-4" /> دولة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة دولة</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => onSubmit(v as unknown as Record<string, unknown>))} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرمز</FormLabel>
                    <FormControl>
                      <Input dir="ltr" placeholder="IQ" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز الهاتف</FormLabel>
                    <FormControl>
                      <Input dir="ltr" placeholder="+964" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العملة</FormLabel>
                  <FormControl>
                    <Input dir="ltr" {...field} />
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

export function CityManager({ countries }: { countries: Country[] }) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(citySchema),
    defaultValues: { countryId: countries[0]?.id ?? "", name: "", nameAr: "" },
  });

  async function onSubmit(values: Record<string, unknown>) {
    const result = await createCity(values);
    if (result.ok) {
      toast.success("تمت إضافة المدينة");
      setOpen(false);
      form.reset({ countryId: countries[0]?.id ?? "", name: "", nameAr: "" });
    } else toast.error(result.error);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm">
          <Plus className="h-4 w-4" /> مدينة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة مدينة</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => onSubmit(v as unknown as Record<string, unknown>))} className="space-y-4">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدولة</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-background/60 px-3 text-sm"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.nameAr || country.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
              <Button type="submit" variant="gradient">إضافة</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
