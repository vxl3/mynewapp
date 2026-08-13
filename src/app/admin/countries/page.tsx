import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CountryManager } from "@/components/admin/catalog-managers";

export const dynamic = "force-dynamic";

export default async function AdminCountriesPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const countries = await prisma.country.findMany({
    orderBy: { nameAr: "asc" },
    include: { _count: { select: { cities: true, businesses: true } } },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="الدول" description="إدارة الدول المدعومة." actions={<CountryManager />} />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-start text-xs uppercase text-muted-foreground">
                <th className="p-4 text-start font-semibold">الدولة</th>
                <th className="p-4 text-start font-semibold">الرمز</th>
                <th className="p-4 text-start font-semibold">رمز الهاتف</th>
                <th className="p-4 text-start font-semibold">العملة</th>
                <th className="p-4 text-start font-semibold">المدن</th>
                <th className="p-4 text-start font-semibold">الأنشطة</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => (
                <tr key={country.id} className="border-t">
                  <td className="p-4">
                    <p className="font-medium">{country.nameAr || country.name}</p>
                    <p className="text-xs text-muted-foreground">{country.name}</p>
                  </td>
                  <td className="p-4 font-mono text-xs" dir="ltr">
                    {country.code}
                  </td>
                  <td className="p-4" dir="ltr">
                    {country.phoneCode}
                  </td>
                  <td className="p-4">{country.currency}</td>
                  <td className="p-4">{country._count.cities}</td>
                  <td className="p-4">{country._count.businesses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
