import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  BranchManager,
  DeleteBranchButton,
  MainBranchBadge,
} from "@/components/dashboard/business/branch-manager";

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);

  const [businesses, cities] = await Promise.all([
    prisma.business.findMany({
      where: { ownerId: user.id },
      include: { branches: { orderBy: { createdAt: "asc" }, include: { city: true } } },
    }),
    prisma.city.findMany({ orderBy: { nameAr: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="الفروع" description="أدر فروع نشاطك التجاري." />

      {businesses.length === 0 ? (
        <EmptyState icon={MapPin} title="لا يوجد نشاط تجاري بعد" description="أنشئ نشاطك أولاً لإضافة الفروع." />
      ) : (
        businesses.map((business) => (
          <Card key={business.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{business.nameAr || business.name}</CardTitle>
              <BranchManager businessId={business.id} cities={cities} />
            </CardHeader>
            <CardContent>
              {business.branches.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">لا توجد فروع بعد لهذا النشاط.</p>
              ) : (
                <div className="space-y-2">
                  {business.branches.map((branch) => (
                    <div key={branch.id} className="flex items-center justify-between rounded-xl border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{branch.name}</p>
                          {branch.isMain && <MainBranchBadge />}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {branch.city ? `${branch.city.nameAr}, ` : ""}
                          {branch.address ?? "بدون عنوان"}
                          {branch.phone ? ` · ${branch.phone}` : ""}
                        </p>
                      </div>
                      <DeleteBranchButton branchId={branch.id} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
