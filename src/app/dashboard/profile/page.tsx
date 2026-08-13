import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/customer/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  const [account, countries, cities] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        bio: true,
        address: true,
        countryId: true,
        cityId: true,
        avatarUrl: true,
        preferredLanguage: true,
        preferredTheme: true,
      },
    }),
    prisma.country.findMany({ orderBy: { nameAr: "asc" } }),
    prisma.city.findMany({ orderBy: { nameAr: "asc" } }),
  ]);

  if (!account) return null;

  return (
    <div className="space-y-8">
      <PageHeader title="الملف الشخصي" description="حدّث بياناتك الشخصية وتفضيلاتك." />
      <Card>
        <CardContent className="pt-6">
          <ProfileForm
            user={{
              firstName: account.firstName,
              lastName: account.lastName,
              email: account.email,
              phone: account.phone,
              bio: account.bio,
              address: account.address,
              countryId: account.countryId,
              cityId: account.cityId,
              avatarUrl: account.avatarUrl,
              preferredLanguage: account.preferredLanguage,
              preferredTheme: account.preferredTheme,
            }}
            countries={countries}
            cities={cities}
          />
        </CardContent>
      </Card>
    </div>
  );
}
