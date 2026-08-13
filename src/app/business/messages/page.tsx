import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { MessagesInbox } from "@/components/dashboard/customer/messages-inbox";

export const dynamic = "force-dynamic";

export default async function BusinessMessagesPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);

  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: user.id }, { recipientId: user.id }] },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      senderId: true,
      recipientId: true,
      subject: true,
      body: true,
      isRead: true,
      createdAt: true,
      sender: { select: { id: true, name: true, email: true } },
      recipient: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="الرسائل" description="تواصل مع عملائك." />
      <MessagesInbox
        currentUserId={user.id}
        messages={messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
      />
    </div>
  );
}
