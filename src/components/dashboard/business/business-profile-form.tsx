"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { upsertBusiness } from "@/lib/actions/business";
import { businessSchema } from "@/lib/validations";
import type { Category, Country, City } from "@prisma/client";

interface BusinessProfileFormProps {
  business: {
    id: string;
    name: string;
    nameAr: string | null;
    slug: string;
    description: string | null;
    categoryId: string | null;
    countryId: string | null;
    cityId: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
  } | null;
  categories: Category[];
  countries: Country[];
  cities: City[];
}

export function BusinessProfileForm({ business, categories, countries, cities }: BusinessProfileFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [countryId, setCountryId] = useState(business?.countryId ?? "");

  const form = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      id: business?.id ?? "",
      name: business?.name ?? "",
      nameAr: business?.nameAr ?? "",
      slug: business?.slug ?? "",
      description: business?.description ?? "",
      categoryId: business?.categoryId ?? "",
      countryId: business?.countryId ?? "",
      cityId: business?.cityId ?? "",
      phone: business?.phone ?? "",
      email: business?.email ?? "",
      website: business?.website ?? "",
      address: business?.address ?? "",
      logoUrl: business?.logoUrl ?? "",
      coverUrl: business?.coverUrl ?? "",
    },
  });

  const filteredCities = cities.filter((city) => city.countryId === countryId);

  async function onSubmit(values: Record<string, unknown>) {
    setSaving(true);
    const result = await upsertBusiness(values);
    setSaving(false);
    if (result.ok) {
      toast.success("تم حفظ بيانات النشاط");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit(v as unknown as Record<string, unknown>))} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم النشاط</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>الاسم بالعربية</FormLabel>
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
                <Input dir="ltr" placeholder="my-business" {...field} />
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
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>التصنيف</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nameAr || category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الدولة</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    setCountryId(v);
                    form.setValue("cityId", "");
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الدولة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.nameAr || country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select value={field.value} onValueChange={field.onChange} disabled={!countryId}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.nameAr || city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input dir="ltr" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الموقع الإلكتروني</FormLabel>
                <FormControl>
                  <Input dir="ltr" placeholder="https://…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رابط الشعار</FormLabel>
                <FormControl>
                  <Input dir="ltr" placeholder="https://…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رابط صورة الغلاف</FormLabel>
                <FormControl>
                  <Input dir="ltr" placeholder="https://…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" variant="gradient" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          حفظ بيانات النشاط
        </Button>
      </form>
    </Form>
  );
}
