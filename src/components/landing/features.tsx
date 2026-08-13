"use client";

import { motion } from "framer-motion";
import { CalendarClock, LayoutDashboard, BellRing, ShieldCheck, Gift, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Features() {
  const { t } = useTranslation();

  const features = [
    { icon: CalendarClock, title: t("landing.features.item1Title"), desc: t("landing.features.item1Desc") },
    { icon: LayoutDashboard, title: t("landing.features.item2Title"), desc: t("landing.features.item2Desc") },
    { icon: BellRing, title: t("landing.features.item3Title"), desc: t("landing.features.item3Desc") },
    { icon: ShieldCheck, title: t("landing.features.item4Title"), desc: t("landing.features.item4Desc") },
    { icon: Gift, title: t("landing.features.item5Title"), desc: t("landing.features.item5Desc") },
    { icon: BarChart3, title: t("landing.features.item6Title"), desc: t("landing.features.item6Desc") },
  ];

  return (
    <section id="features" className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("landing.features.title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("landing.features.subtitle")}</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="card-hover glass rounded-2xl p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-fuchsia-500/15 text-primary">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
