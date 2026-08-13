"use client";

import { ErrorPage } from "@/components/ui/error-page";

export default function NotFound() {
  return <ErrorPage statusCode={404} />;
}
