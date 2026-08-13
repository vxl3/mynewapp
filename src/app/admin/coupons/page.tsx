import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CouponManager, ToggleCouponButton } from "@/components/admin/coupon-manager";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <PageHeader title="الكوبونات" description="إدارة كوبونات الخصم." actions={<CouponManager />} />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-start text-xs uppercase text-muted-foreground">
                <th className="p-4 text-start font-semibold">الكود</th>
                <th className="p-4 text-start font-semibold">النوع</th>
                <th className="p-4 text-start font-semibold">القيمة</th>
                <th className="p-4 text-start font-semibold">الاستخدام</th>
                <th className="p-4 text-start font-semibold">ينتهي</th>
                <th className="p-4 text-start font-semibold">الحالة</th>
                <th className="p-4 text-start font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t">
                  <td className="p-4 font-mono font-bold" dir="ltr">
                    {coupon.code}
                  </td>
                  <td className="p-4">{coupon.type === "PERCENT" ? "نسبة" : "مبلغ"}</td>
                  <td className="p-4">
                    {coupon.type === "PERCENT" ? `${coupon.value}%` : `${coupon.value}$`}
                  </td>
                  <td className="p-4">
                    {coupon.usedCount}
                    {coupon.maxUses ? ` / ${coupon.maxUses}` : " / ∞"}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {coupon.expiresAt ? formatDate(coupon.expiresAt) : "—"}
                  </td>
                  <td className="p-4">
                    {coupon.isActive ? <Badge variant="success">نشط</Badge> : <Badge variant="secondary">معطل</Badge>}
                  </td>
                  <td className="p-4">
                    <ToggleCouponButton couponId={coupon.id} />
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
