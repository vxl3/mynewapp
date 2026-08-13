export const siteConfig = {
  name: "احجزلي",
  nameLatin: "Ahjezli",
  tagline: "احجز كل شيء، في مكان واحد",
  taglineEn: "Book everything, in one place",
  description:
    "احجزلي — منصة الحجز الذكية الأولى في العالم العربي. احجز صالونات، عيادات، ملاعب، قاعات، صالات رياضية والمزيد في ثوانٍ.",
  descriptionEn:
    "Ahjezli — the smart booking platform for the Arab world. Book salons, clinics, fields, halls, gyms and more in seconds.",
  url: "http://localhost:3000",
  locale: "ar",
  keywords: [
    "حجز",
    "احجزلي",
    "حجز مواعيد",
    "booking",
    "appointments",
    "salon booking",
    "clinic booking",
  ] as string[],
  links: {
    github: "https://github.com/vxl3",
  },
} as const;

export type SiteConfig = typeof siteConfig;
