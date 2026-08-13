import { Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RemoveFavoriteButton } from "@/components/dashboard/customer/remove-favorite-button";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await requireUser();

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      business: {
        select: {
          id: true,
          name: true,
          nameAr: true,
          slug: true,
          logoUrl: true,
          rating: true,
          reviewCount: true,
          status: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="المفضلة" description="الأنشطة التجارية التي أضفتها إلى مفضلتك." />

      {favorites.length === 0 ? (
        <EmptyState icon={Heart} title="لا توجد مفضلات بعد" description="استكشف الأنشطة التجارية وأضفها إلى مفضلتك." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map(({ business }) => (
            <Card key={business.id} className="card-hover">
              <CardContent className="flex items-center justify-between gap-3 pt-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={business.logoUrl ?? undefined} alt={business.name} />
                    <AvatarFallback>{business.name[0] ?? "؟"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{business.nameAr || business.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>⭐ {business.rating.toFixed(1)}</span>
                      <span>({business.reviewCount})</span>
                      <StatusBadge status={business.status} />
                    </div>
                  </div>
                </div>
                <RemoveFavoriteButton businessId={business.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
