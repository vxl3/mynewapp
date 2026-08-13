import { Scissors } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { StructurePlaceholder } from "@/components/dashboard/business/structure-placeholder";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);
  const count = await prisma.service.count({
    where: { business: { ownerId: user.id } },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="الخدمات" description="حدد خدماتك وأسعارها ومدتها." />
      <StructurePlaceholder
        icon={Scissors}
        title="خدمة"
        description="ستتمكن من إضافة الخدمات والأسعار والمدد في المرحلة الثالثة."
        count={count}
      />
    </div>
  );
}
