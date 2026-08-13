import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryManager, ToggleCategoryButton, DeleteCategoryButton } from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { businesses: true } } },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="التصنيفات"
        description="إدارة تصنيفات الحجز."
        actions={<CategoryManager />}
      />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-start text-xs uppercase text-muted-foreground">
                <th className="p-4 text-start font-semibold">التصنيف</th>
                <th className="p-4 text-start font-semibold">المعرّف</th>
                <th className="p-4 text-start font-semibold">الأنشطة</th>
                <th className="p-4 text-start font-semibold">الحالة</th>
                <th className="p-4 text-start font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t">
                  <td className="p-4">
                    <p className="font-medium">{category.nameAr || category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.name}</p>
                  </td>
                  <td className="p-4 font-mono text-xs" dir="ltr">
                    {category.slug}
                  </td>
                  <td className="p-4">{category._count.businesses}</td>
                  <td className="p-4">
                    {category.isActive ? <Badge variant="success">نشط</Badge> : <Badge variant="secondary">معطل</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <ToggleCategoryButton categoryId={category.id} />
                      <DeleteCategoryButton categoryId={category.id} name={category.nameAr || category.name} />
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
