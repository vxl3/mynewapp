import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BusinessOwnersPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const owners = await prisma.user.findMany({
    where: { roles: { some: { role: { name: RoleName.BUSINESS_OWNER } } } },
    orderBy: { createdAt: "desc" },
    include: {
      roles: { include: { role: true } },
      businessesOwned: { select: { id: true, name: true, nameAr: true, status: true } },
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="أصحاب الأنشطة" description="جميع المستخدمين المسجلين كأصحاب نشاط تجاري." />

      <div className="grid gap-4 md:grid-cols-2">
        {owners.map((owner) => (
          <Card key={owner.id}>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={owner.avatarUrl ?? undefined} alt={owner.name ?? ""} />
                    <AvatarFallback>{owner.name?.[0] ?? "؟"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{owner.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {owner.email}
                    </p>
                  </div>
                </div>
                <StatusBadge status={owner.status} />
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase text-muted-foreground">أنشطته التجارية</p>
                {owner.businessesOwned.length === 0 ? (
                  <p className="text-sm text-muted-foreground">لا توجد أنشطة</p>
                ) : (
                  owner.businessesOwned.map((business) => (
                    <div key={business.id} className="flex items-center justify-between rounded-lg border p-2.5 text-sm">
                      <span>{business.nameAr || business.name}</span>
                      <StatusBadge status={business.status} />
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">انضم في {formatDate(owner.createdAt)}</span>
                <UserRowActions userId={owner.id} hasBusinessRole={true} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
