import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CityManager } from "@/components/admin/catalog-managers";

export const dynamic = "force-dynamic";

export default async function AdminCitiesPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const [cities, countries] = await Promise.all([
    prisma.city.findMany({ orderBy: { nameAr: "asc" }, include: { country: true } }),
    prisma.country.findMany({ orderBy: { nameAr: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="المدن" description="إدارة المدن المدعومة." actions={<CityManager countries={countries} />} />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-start text-xs uppercase text-muted-foreground">
                <th className="p-4 text-start font-semibold">المدينة</th>
                <th className="p-4 text-start font-semibold">الدولة</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.id} className="border-t">
                  <td className="p-4">
                    <p className="font-medium">{city.nameAr || city.name}</p>
                    <p className="text-xs text-muted-foreground">{city.name}</p>
                  </td>
                  <td className="p-4">{city.country.nameAr || city.country.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
