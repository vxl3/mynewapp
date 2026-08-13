import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RegisterBusinessForm } from "@/components/auth/register-business-form";

export const metadata: Metadata = { title: "Business registration" };

export const dynamic = "force-dynamic";

export default async function RegisterBusinessPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, nameAr: true, slug: true },
  });

  return <RegisterBusinessForm categories={categories} />;
}
