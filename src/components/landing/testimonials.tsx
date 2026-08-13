"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    { text: t("landing.testimonials.item1"), name: "أحمد م.", role: "عميل", initials: "أ" },
    { text: t("landing.testimonials.item2"), name: "سارة ك.", role: "صاحبة صالون", initials: "س" },
    { text: t("landing.testimonials.item3"), name: "محمد ع.", role: "صاحب نشاط", initials: "م" },
  ];

  return (
    <section id="testimonials" className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("landing.testimonials.title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("landing.testimonials.subtitle")}</p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="card-hover flex flex-col gap-4 rounded-2xl border bg-card p-6"
          >
            <Quote className="h-8 w-8 text-primary/40" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-foreground/90">{item.text}</p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{item.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
