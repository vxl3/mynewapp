import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="سجلات التدقيق" description="أثر كامل للإجراءات الإدارية على المنصة." />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-start text-xs uppercase text-muted-foreground">
                  <th className="p-4 text-start font-semibold">الإجراء</th>
                  <th className="p-4 text-start font-semibold">الكيان</th>
                  <th className="p-4 text-start font-semibold">المستخدم</th>
                  <th className="p-4 text-start font-semibold">IP</th>
                  <th className="p-4 text-start font-semibold">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      لا توجد سجلات تدقيق بعد.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-t">
                      <td className="p-4">
                        <Badge variant="secondary">{log.action}</Badge>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{log.entity}</p>
                        {log.entityId && <p className="font-mono text-xs text-muted-foreground">{log.entityId.slice(0, 12)}…</p>}
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{log.user?.name ?? log.actorEmail ?? "نظام"}</p>
                      </td>
                      <td className="p-4 font-mono text-xs" dir="ltr">
                        {log.ip ?? "—"}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{formatDate(log.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
