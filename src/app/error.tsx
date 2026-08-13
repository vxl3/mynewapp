"use client";

import { ErrorPage } from "@/components/ui/error-page";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPage statusCode={500} reset={reset} />;
}
