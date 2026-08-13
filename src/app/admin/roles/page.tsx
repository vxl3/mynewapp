import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RolePermissions } from "@/components/admin/role-permissions";

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const [roles, permissions] = await Promise.all([
    prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    }),
    prisma.permission.findMany({ orderBy: { key: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="الأدوار" description="إدارة الأدوار وصلاحياتها (RBAC)." />

      <div className="space-y-6">
        {roles.map((role) => {
          const grantedKeys = new Set(role.permissions.map((p) => p.permission.key));
          return (
            <Card key={role.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {role.name}
                  <Badge variant="secondary">{role._count.users} مستخدم</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RolePermissions
                  roleId={role.id}
                  permissions={permissions.map((permission) => ({
                    key: permission.key,
                    name: permission.name,
                    granted: grantedKeys.has(permission.key),
                  }))}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
