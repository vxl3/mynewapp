"use client";

import { CalendarX2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";

interface BookingListItem {
  id: string;
  reference: string;
  startAt: string;
  endAt: string;
  status: string;
  price: number;
  currency: string;
}

interface BookingsListProps {
  upcoming: BookingListItem[];
  history: BookingListItem[];
}

export function BookingsList({ upcoming, history }: BookingsListProps) {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming">الحجوزات القادمة ({upcoming.length})</TabsTrigger>
        <TabsTrigger value="history">سجل الحجوزات ({history.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="لا توجد حجوزات قادمة"
            description="ستظهر حجوزاتك القادمة هنا. نظام الحجز متاح في المرحلة الثالثة."
          />
        ) : (
          <BookingTable bookings={upcoming} />
        )}
      </TabsContent>

      <TabsContent value="history">
        {history.length === 0 ? (
          <EmptyState icon={CalendarX2} title="لا يوجد سجل حجوزات" description="سجل حجوزاتك السابقة سيظهر هنا." />
        ) : (
          <BookingTable bookings={history} />
        )}
      </TabsContent>
    </Tabs>
  );
}

function BookingTable({ bookings }: { bookings: BookingListItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-start text-xs uppercase text-muted-foreground">
            <th className="p-4 text-start font-semibold">المرجع</th>
            <th className="p-4 text-start font-semibold">التاريخ</th>
            <th className="p-4 text-start font-semibold">المبلغ</th>
            <th className="p-4 text-start font-semibold">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t">
              <td className="p-4 font-mono text-xs">{booking.reference}</td>
              <td className="p-4">{formatDate(booking.startAt)}</td>
              <td className="p-4">
                {booking.price} {booking.currency === "USD" ? "$" : booking.currency}
              </td>
              <td className="p-4">
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t bg-muted/30 p-3">
        <Badge variant="secondary">نظام الحجز الكامل قادم في المرحلة الثالثة</Badge>
      </div>
    </div>
  );
}
