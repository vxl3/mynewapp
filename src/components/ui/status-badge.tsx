import { Badge } from "@/components/ui/badge";

type Tone = "default" | "success" | "warning" | "destructive" | "secondary";

const STATUS_TONE: Record<string, Tone> = {
  ACTIVE: "success",
  CONFIRMED: "success",
  COMPLETED: "success",
  PAID: "success",
  PUBLISHED: "success",
  PROCESSED: "success",
  TRIAL: "secondary",
  PENDING: "warning",
  PAST_DUE: "warning",
  DRAFT: "secondary",
  SUSPENDED: "destructive",
  LOCKED: "destructive",
  CLOSED: "destructive",
  CANCELLED: "destructive",
  FAILED: "destructive",
  EXPIRED: "destructive",
  DELETED: "destructive",
  NO_SHOW: "destructive",
  HIDDEN: "secondary",
  SENT: "secondary",
  DELIVERED: "secondary",
  READ: "default",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "نشط",
  PENDING: "قيد الانتظار",
  SUSPENDED: "موقوف",
  LOCKED: "مقفل",
  DELETED: "محذوف",
  CLOSED: "مغلق",
  CONFIRMED: "مؤكد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
  NO_SHOW: "لم يحضر",
  PAID: "مدفوع",
  FAILED: "فشل",
  REFUNDED: "مسترد",
  TRIAL: "تجريبي",
  PAST_DUE: "متأخر",
  EXPIRED: "منتهي",
  DRAFT: "مسودة",
  ISSUED: "صادر",
  OVERDUE: "متأخر",
  VOID: "ملغي",
  PUBLISHED: "منشور",
  HIDDEN: "مخفي",
  SENT: "مرسل",
  DELIVERED: "تم التسليم",
  READ: "مقروء",
  EARN: "كسب",
  REDEEM: "استبدال",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const tone = STATUS_TONE[status] ?? "secondary";
  const text = label ?? STATUS_LABEL[status] ?? status;
  return <Badge variant={tone as never}>{text}</Badge>;
}
