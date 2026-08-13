"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Stats() {
  const { t } = useTranslation();

  const stats = [
    { value: "2,500+", label: t("landing.stats.businesses") },
    { value: "120K+", label: t("landing.stats.bookings") },
    { value: "40+", label: t("landing.stats.cities") },
    { value: "98%", label: t("landing.stats.satisfaction") },
  ];

  return (
    <section className="container py-16">
      <div className="glass relative overflow-hidden rounded-3xl px-8 py-12">
        <div className="pointer-events-none absolute -top-24 start-1/3 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-gradient text-3xl font-extrabold md:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
