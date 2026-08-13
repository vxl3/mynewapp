"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, CalendarCheck, Sparkles, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="bg-mesh relative flex min-h-screen items-center overflow-hidden pt-24 pb-16">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 start-[10%] h-96 w-96 animate-float rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/3 end-[8%] h-80 w-80 animate-float rounded-full bg-fuchsia-500/15 blur-3xl [animation-delay:1.2s]" />
        <div className="absolute bottom-10 start-[30%] h-72 w-72 animate-float rounded-full bg-sky-500/10 blur-3xl [animation-delay:2.4s]" />
      </div>

      <div className="container relative z-10 grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-7 text-center lg:text-start"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("landing.hero.badge")}
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
            {t("landing.hero.title1")}
            <span className="text-gradient mt-2 block">{t("landing.hero.title2")}</span>
          </h1>

          <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
            {t("landing.hero.description")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button asChild variant="gradient" size="lg" className="group">
              <Link href="/register">
                <CalendarCheck className="h-5 w-5 transition-transform group-hover:scale-110" />
                {t("landing.hero.ctaPrimary")}
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <a href="#categories">{t("landing.hero.ctaSecondary")}</a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>{t("landing.hero.trusted")}</span>
          </div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative mx-auto hidden w-full max-w-md lg:block"
        >
          <div className="glass-strong relative rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("common.tagline")}</p>
                <p className="text-lg font-bold">{t("landing.categories.salons")}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-white shadow-lg shadow-primary/30">
                <CalendarCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { label: t("landing.categories.clinics"), time: "10:00" },
                { label: t("landing.categories.gyms"), time: "14:30" },
                { label: t("landing.categories.fields"), time: "19:00" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="card-hover flex items-center justify-between rounded-xl border bg-background/60 p-4"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {item.time}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-gradient-to-r from-primary to-fuchsia-500 p-[1px]">
              <div className="rounded-[11px] bg-background/80 p-4 text-center backdrop-blur">
                <p className="text-sm font-semibold">{t("landing.hero.ctaPrimary")}</p>
                <p className="text-xs text-muted-foreground">{t("landing.hero.trusted")}</p>
              </div>
            </div>
          </div>

          <div className="absolute -end-6 -top-6 animate-float rounded-2xl bg-white/80 p-3 shadow-xl backdrop-blur dark:bg-white/10">
            <CalendarCheck className="h-6 w-6 text-primary" />
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#features"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-label="Scroll down"
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </motion.a>
    </section>
  );
}
