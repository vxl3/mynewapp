export const fallbackLng = "ar";
export const languages = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "en", name: "English", dir: "ltr" },
] as const;

export type Locale = (typeof languages)[number]["code"];

export function isLocale(value: string): value is Locale {
  return languages.some((l) => l.code === value);
}

export function dirOf(locale: string): "rtl" | "ltr" {
  return languages.find((l) => l.code === locale)?.dir ?? "rtl";
}
