"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { updateProfile } from "@/lib/actions/profile";
import { profileSchema } from "@/lib/validations";
import type { Country, City } from "@prisma/client";

interface ProfileFormProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    bio: string | null;
    address: string | null;
    countryId: string | null;
    cityId: string | null;
    avatarUrl: string | null;
    preferredLanguage: string;
    preferredTheme: string;
  };
  countries: Country[];
  cities: City[];
}

export function ProfileForm({ user, countries, cities }: ProfileFormProps) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [countryId, setCountryId] = useState(user.countryId ?? "");

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      address: user.address ?? "",
      countryId: user.countryId ?? "",
      cityId: user.cityId ?? "",
      avatarUrl: user.avatarUrl ?? "",
      preferredLanguage: user.preferredLanguage as "ar" | "en",
      preferredTheme: user.preferredTheme as "light" | "dark" | "system",
    },
  });

  const filteredCities = cities.filter((city) => city.countryId === countryId);
  const avatarUrl = form.watch("avatarUrl");
  const initials = `${form.watch("firstName")[0] ?? ""}${form.watch("lastName")[0] ?? ""}`.toUpperCase();

  async function onSubmit(values: Record<string, unknown>) {
    setSaving(true);
    const result = await updateProfile(values);
    setSaving(false);
    if (result.ok) toast.success(t("common.save"));
    else toast.error(result.error);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit(v as unknown as Record<string, unknown>))} className="space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || undefined} alt="avatar" />
            <AvatarFallback className="text-xl">{initials || "؟"}</AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>رابط الصورة الشخصية</FormLabel>
                <FormControl>
                  <Input dir="ltr" placeholder="https://…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.firstName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.lastName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormItem>
            <FormLabel>{t("auth.email")}</FormLabel>
            <Input value={user.email} dir="ltr" disabled />
          </FormItem>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input dir="ltr" placeholder="+964…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نبذة عنك</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="preferredLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اللغة المفضلة</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredTheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المظهر المفضل</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="system">النظام</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" variant="gradient" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {t("common.save")}
        </Button>
      </form>
    </Form>
  );
}
