import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { BusinessRowActions } from "@/components/admin/business-row-actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBusinessesPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const businesses = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { name: true, email: true } },
      category: { select: { nameAr: true, name: true } },
      city: { select: { nameAr: true, name: true } },
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="الأنشطة التجارية" description="مراجعة وإدارة جميع الأنشطة التجارية." />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-start text-xs uppercase text-muted-foreground">
                  <th className="p-4 text-start font-semibold">النشاط</th>
                  <th className="p-4 text-start font-semibold">المالك</th>
                  <th className="p-4 text-start font-semibold">التصنيف</th>
                  <th className="p-4 text-start font-semibold">المدينة</th>
                  <th className="p-4 text-start font-semibold">الحالة</th>
                  <th className="p-4 text-start font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr key={business.id} className="border-t">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={business.logoUrl ?? undefined} alt={business.name} />
                          <AvatarFallback>{business.name[0] ?? "؟"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{business.nameAr || business.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(business.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{business.owner.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {business.owner.email}
                      </p>
                    </td>
                    <td className="p-4">{business.category?.nameAr || business.category?.name || "—"}</td>
                    <td className="p-4">{business.city?.nameAr || business.city?.name || "—"}</td>
                    <td className="p-4">
                      <StatusBadge status={business.status} />
                    </td>
                    <td className="p-4">
                      <BusinessRowActions businessId={business.id} status={business.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
