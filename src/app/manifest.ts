import type { MetadataRoute } from "next";

/** PWA web app manifest. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "احجزلي",
    short_name: "احجزلي",
    description: "منصة الحجز الذكية الأولى في العالم العربي",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a12",
    theme_color: "#6d2ef5",
    orientation: "any",
    dir: "rtl",
    lang: "ar",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
