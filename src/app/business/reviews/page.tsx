import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);

  const reviews = await prisma.review.findMany({
    where: { business: { ownerId: user.id } },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, firstName: true, email: true } },
      business: { select: { name: true, nameAr: true } },
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="التقييمات" description="ما يقوله العملاء عن نشاطك التجاري." />

      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="لا توجد تقييمات بعد" description="ستظهر تقييمات العملاء هنا." />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{review.customer.name?.[0] ?? "؟"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{review.customer.name ?? review.customer.email}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                      ))}
                    </span>
                    <StatusBadge status={review.status} />
                  </div>
                </div>
                {review.comment && <p className="text-sm">{review.comment}</p>}
                {review.businessReply && (
                  <p className="rounded-lg bg-muted/60 p-3 text-sm">
                    <span className="font-semibold">ردك: </span>
                    {review.businessReply}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
