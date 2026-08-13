import type { Metadata } from "next";
import { VerifyEmailClient } from "@/components/auth/verify-email-client";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return <AwaitParams searchParams={searchParams} />;
}

async function AwaitParams({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <VerifyEmailClient token={token} />;
}
