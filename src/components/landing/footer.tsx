"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("landing.footer.product"),
      links: [
        { label: t("landing.features.title"), href: "#features" },
        { label: t("landing.categories.title"), href: "#categories" },
        { label: t("landing.testimonials.title"), href: "#testimonials" },
        { label: t("landing.faq.title"), href: "#faq" },
      ],
    },
    {
      title: t("landing.footer.company"),
      links: [
        { label: t("nav.howItWorks"), href: "#features" },
        { label: t("common.login"), href: "/login" },
        { label: t("common.register"), href: "/register" },
      ],
    },
    {
      title: t("landing.footer.legal"),
      links: [
        { label: "Terms", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Cookies", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-card/40">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">{t("landing.footer.description")}</p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h4 className="text-sm font-semibold">{column.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t py-6">
        <p className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t("common.appName")}. {t("landing.footer.rights")}.
        </p>
      </div>
    </footer>
  );
}
