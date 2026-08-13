import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";

export default async function MyBusinessesPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);

  const businesses = await prisma.business.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { branches: true, services: true, employees: true } } },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="نشاطاتي"
        description="جميع الأنشطة التجارية التي تملكها."
        actions={
          <Button asChild variant="gradient" size="sm">
            <Link href="/business/profile">
              <Plus className="h-4 w-4" /> نشاط جديد
            </Link>
          </Button>
        }
      />

      {businesses.length === 0 ? (
        <EmptyState icon={Building2} title="لا يوجد نشاط تجاري بعد" description="أنشئ نشاطك الأول للبدء." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id} className="card-hover">
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={business.logoUrl ?? undefined} alt={business.name} />
                    <AvatarFallback>{business.name[0] ?? "؟"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{business.nameAr || business.name}</p>
                    <StatusBadge status={business.status} />
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{business._count.branches} فرع</span>
                  <span>{business._count.services} خدمة</span>
                  <span>{business._count.employees} موظف</span>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/business/profile?businessId=${business.id}`}>إدارة النشاط</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
