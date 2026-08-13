import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminPermissionsPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const permissions = await prisma.permission.findMany({
    orderBy: { key: "asc" },
    include: { roles: { include: { role: true } } },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="الصلاحيات" description="جميع الصلاحيات المتاحة في النظام." />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-start text-xs uppercase text-muted-foreground">
                <th className="p-4 text-start font-semibold">الصلاحية</th>
                <th className="p-4 text-start font-semibold">الوصف</th>
                <th className="p-4 text-start font-semibold">الأدوار</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission.id} className="border-t">
                  <td className="p-4 font-mono text-xs" dir="ltr">
                    {permission.key}
                  </td>
                  <td className="p-4 text-muted-foreground">{permission.name}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {permission.roles.map(({ role }) => (
                        <Badge key={role.id} variant="secondary">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
