import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { BusinessProfileForm } from "@/components/dashboard/business/business-profile-form";

export const dynamic = "force-dynamic";

export default async function BusinessProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ businessId?: string }>;
}) {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);
  const { businessId } = await searchParams;

  const [business, categories, countries, cities] = await Promise.all([
    businessId
      ? prisma.business.findFirst({ where: { id: businessId, ownerId: user.id } })
      : prisma.business.findFirst({ where: { ownerId: user.id }, orderBy: { createdAt: "asc" } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.country.findMany({ orderBy: { nameAr: "asc" } }),
    prisma.city.findMany({ orderBy: { nameAr: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={business ? "ملف النشاط التجاري" : "إنشاء نشاط تجاري"}
        description="حدّث بيانات نشاطك التجاري كما ستظهر للعملاء."
      />
      <Card>
        <CardContent className="pt-6">
          <BusinessProfileForm
            business={
              business
                ? {
                    id: business.id,
                    name: business.name,
                    nameAr: business.nameAr,
                    slug: business.slug,
                    description: business.description,
                    categoryId: business.categoryId,
                    countryId: business.countryId,
                    cityId: business.cityId,
                    phone: business.phone,
                    email: business.email,
                    website: business.website,
                    address: business.address,
                    logoUrl: business.logoUrl,
                    coverUrl: business.coverUrl,
                  }
                : null
            }
            categories={categories}
            countries={countries}
            cities={cities}
          />
        </CardContent>
      </Card>
    </div>
  );
}
