import type { Metadata } from "next";
import { HomePage } from "@/components/landing/home-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function Page() {
  return <HomePage />;
}
