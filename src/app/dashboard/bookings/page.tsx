import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { PageHeader } from "@/components/ui/page-header";
import { BookingsList } from "@/components/dashboard/customer/bookings-list";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const user = await requireUser();
  const now = new Date();

  const bookings = await prisma.booking.findMany({
    where: { customerId: user.id },
    orderBy: { startAt: "desc" },
    select: {
      id: true,
      reference: true,
      startAt: true,
      endAt: true,
      status: true,
      price: true,
      currency: true,
    },
  });

  const upcoming = bookings.filter((b) => b.startAt >= now && ["PENDING", "CONFIRMED"].includes(b.status));
  const history = bookings.filter((b) => b.startAt < now || ["CANCELLED", "COMPLETED", "NO_SHOW"].includes(b.status));

  return (
    <div className="space-y-8">
      <PageHeader title="حجوزاتي" description="تابع حجوزاتك القادمة وسجل حجوزاتك السابقة." />
      <BookingsList
        upcoming={upcoming.map((b) => ({ ...b, startAt: b.startAt.toISOString(), endAt: b.endAt.toISOString(), price: Number(b.price) }))}
        history={history.map((b) => ({ ...b, startAt: b.startAt.toISOString(), endAt: b.endAt.toISOString(), price: Number(b.price) }))}
      />
    </div>
  );
}
