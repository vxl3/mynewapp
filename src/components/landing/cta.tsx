"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function Cta() {
  const { t } = useTranslation();

  return (
    <section className="container pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-brand-500 to-fuchsia-500 p-10 text-center text-white shadow-2xl shadow-primary/30 md:p-16"
      >
        <div className="pointer-events-none absolute -top-16 start-1/4 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 end-1/4 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative space-y-5">
          <h2 className="text-3xl font-bold md:text-4xl">{t("landing.cta.title")}</h2>
          <p className="mx-auto max-w-md text-white/85">{t("landing.cta.description")}</p>
          <Button asChild size="lg" className="bg-white text-primary shadow-xl hover:bg-white/90">
            <Link href="/register">{t("landing.cta.button")}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
