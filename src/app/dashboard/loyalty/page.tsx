import { Gift, Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const tierLabels: Record<string, { label: string; tone: string }> = {
  BRONZE: { label: "برونزي", tone: "from-amber-700 to-amber-500" },
  SILVER: { label: "فضي", tone: "from-slate-400 to-slate-300" },
  GOLD: { label: "ذهبي", tone: "from-yellow-500 to-amber-300" },
  PLATINUM: { label: "بلاتيني", tone: "from-cyan-500 to-slate-300" },
};

export default async function LoyaltyPage() {
  const user = await requireUser();

  const [account, transactions] = await Promise.all([
    prisma.loyaltyAccount.findUnique({ where: { userId: user.id } }),
    prisma.loyaltyTransaction.findMany({
      where: { account: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const tier = account?.tier ?? "BRONZE";

  return (
    <div className="space-y-8">
      <PageHeader title="نقاط الولاء" description="اكسب نقاطاً مع كل حجز واستبدلها بمكافآت." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">رصيد النقاط</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-fuchsia-500/15 text-primary">
                <Gift className="h-7 w-7" />
              </div>
              <div>
                <p className="text-4xl font-extrabold">{account?.pointsBalance ?? 0}</p>
                <p className="text-xs text-muted-foreground">نقطة ({account?.lifetimePoints ?? 0} إجمالي)</p>
              </div>
            </div>
            <Badge variant="glass" className={`bg-gradient-to-r ${tierLabels[tier]?.tone} bg-clip-text text-transparent`}>
              <Trophy className="h-3.5 w-3.5 text-yellow-500" /> مستوى {tierLabels[tier]?.label ?? tier}
            </Badge>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>سجل النقاط</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                لا توجد حركات نقاط بعد. ستبدأ بكسب النقاط مع أول حجز.
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <span>{transaction.description ?? transaction.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</span>
                      <span className={transaction.points >= 0 ? "font-bold text-emerald-500" : "font-bold text-destructive"}>
                        {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
