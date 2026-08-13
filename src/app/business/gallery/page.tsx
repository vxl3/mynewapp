import { Image } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { StructurePlaceholder } from "@/components/dashboard/business/structure-placeholder";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);
  const count = await prisma.image.count({
    where: { business: { ownerId: user.id } },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="معرض الصور" description="أضف صوراً لنشاطك التجاري." />
      <StructurePlaceholder
        icon={Image}
        title="صورة"
        description="ستتمكن من رفع الصور وإدارتها في المرحلة الثالثة."
        count={count}
      />
    </div>
  );
}
