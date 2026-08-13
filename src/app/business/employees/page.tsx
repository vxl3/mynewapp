import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { StructurePlaceholder } from "@/components/dashboard/business/structure-placeholder";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);
  const count = await prisma.employee.count({
    where: { business: { ownerId: user.id } },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="الموظفون" description="أدر فريق عملك واربطهم بالخدمات." />
      <StructurePlaceholder
        icon={Users}
        title="موظف"
        description="ستتمكن من إضافة الموظفين وربطهم بالخدمات والجداول في المرحلة الثالثة."
        count={count}
      />
    </div>
  );
}
