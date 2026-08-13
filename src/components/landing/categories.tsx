"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  Sparkles,
  Stethoscope,
  Trophy,
  PartyPopper,
  Dumbbell,
  Car,
  Camera,
  GraduationCap,
  Landmark,
  UtensilsCrossed,
  Hotel,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CategoryItem {
  icon: LucideIcon;
  labelKey: string;
}

const categoryKeys: { icon: LucideIcon; labelKey: string }[] = [
  { icon: Scissors, labelKey: "salons" },
  { icon: Sparkles, labelKey: "beauty" },
  { icon: Stethoscope, labelKey: "clinics" },
  { icon: Trophy, labelKey: "fields" },
  { icon: PartyPopper, labelKey: "halls" },
  { icon: Dumbbell, labelKey: "gyms" },
  { icon: Car, labelKey: "cars" },
  { icon: Camera, labelKey: "photography" },
  { icon: GraduationCap, labelKey: "training" },
  { icon: Landmark, labelKey: "government" },
  { icon: UtensilsCrossed, labelKey: "restaurants" },
  { icon: Hotel, labelKey: "hotels" },
];

export function Categories() {
  const { t } = useTranslation();

  const categories: CategoryItem[] = categoryKeys.map((c) => ({
    icon: c.icon,
    labelKey: t(`landing.categories.${c.labelKey}`),
  }));

  return (
    <section id="categories" className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("landing.categories.title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("landing.categories.subtitle")}</p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((category, i) => (
          <motion.button
            key={category.labelKey}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            whileHover={{ y: -6 }}
            className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center transition-colors hover:border-primary/40"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/12 to-fuchsia-500/12 text-primary transition-all duration-300 group-hover:from-primary group-hover:to-fuchsia-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30">
              <category.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">{category.labelKey}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
