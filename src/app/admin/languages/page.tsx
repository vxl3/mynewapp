import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/admin/language-toggle";

export const dynamic = "force-dynamic";

export default async function AdminLanguagesPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const languages = await prisma.language.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <PageHeader title="اللغات" description="اللغات المدعومة في المنصة." />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-start text-xs uppercase text-muted-foreground">
                <th className="p-4 text-start font-semibold">اللغة</th>
                <th className="p-4 text-start font-semibold">الرمز</th>
                <th className="p-4 text-start font-semibold">الاتجاه</th>
                <th className="p-4 text-start font-semibold">الحالة</th>
                <th className="p-4 text-start font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((language) => (
                <tr key={language.id} className="border-t">
                  <td className="p-4">
                    <p className="font-medium">{language.nameNative}</p>
                    <p className="text-xs text-muted-foreground">{language.name}</p>
                  </td>
                  <td className="p-4 font-mono text-xs" dir="ltr">
                    {language.code}
                  </td>
                  <td className="p-4">{language.dir === "rtl" ? "يمين لليسار" : "يسار لليمين"}</td>
                  <td className="p-4">
                    {language.isActive ? <Badge variant="success">نشطة</Badge> : <Badge variant="secondary">معطلة</Badge>}
                    {language.isDefault && <Badge variant="default" className="ms-2">افتراضية</Badge>}
                  </td>
                  <td className="p-4">
                    <LanguageToggle code={language.code} />
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
