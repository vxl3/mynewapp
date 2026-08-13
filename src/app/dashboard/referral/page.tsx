import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { absoluteUrl } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { ReferralCard } from "@/components/dashboard/customer/referral-card";

export const dynamic = "force-dynamic";

export default async function ReferralPage() {
  const user = await requireUser();

  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      referralCode: true,
      sentReferrals: { select: { id: true, status: true } },
    },
  });

  const code = account?.referralCode ?? "—";
  const total = account?.sentReferrals.length ?? 0;
  const completed = account?.sentReferrals.filter((r) => r.status !== "PENDING").length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader title="الإحالات" description="ادعُ أصدقاءك واكسب مكافآت عند انضمامهم." />
      <ReferralCard code={code} total={total} completed={completed} link={absoluteUrl(`/register?ref=${code}`)} />
    </div>
  );
}
