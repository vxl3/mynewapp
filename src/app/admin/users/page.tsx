import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { roles: { include: { role: true } }, deletionRequest: true },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="المستخدمون" description="إدارة جميع مستخدمي المنصة." />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-start text-xs uppercase text-muted-foreground">
                  <th className="p-4 text-start font-semibold">المستخدم</th>
                  <th className="p-4 text-start font-semibold">البريد</th>
                  <th className="p-4 text-start font-semibold">الأدوار</th>
                  <th className="p-4 text-start font-semibold">الحالة</th>
                  <th className="p-4 text-start font-semibold">تاريخ التسجيل</th>
                  <th className="p-4 text-start font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const roles = user.roles.map((r) => r.role.name);
                  const hasBusinessRole = roles.includes(RoleName.BUSINESS_OWNER);
                  return (
                    <tr key={user.id} className="border-t">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? ""} />
                            <AvatarFallback>{user.name?.[0] ?? "؟"}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="p-4" dir="ltr">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {roles.map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={user.status} />
                          {user.deletionRequest?.status === "PENDING" && <Badge variant="warning">طلب حذف</Badge>}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{formatDate(user.createdAt)}</td>
                      <td className="p-4">
                        <UserRowActions userId={user.id} hasBusinessRole={hasBusinessRole} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
