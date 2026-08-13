"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { sendMessage } from "@/lib/actions/user";
import { cn, formatDate } from "@/lib/utils";

interface MessageItem {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string | null;
  body: string;
  isRead: boolean;
  createdAt: string;
  sender: { id: string; name: string | null; email: string };
  recipient: { id: string; name: string | null; email: string };
}

export function MessagesInbox({ messages, currentUserId }: { messages: MessageItem[]; currentUserId: string }) {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const conversations = useMemo(() => {
    const map = new Map<string, MessageItem[]>();
    for (const message of messages) {
      const partnerId = message.senderId === currentUserId ? message.recipientId : message.senderId;
      const list = map.get(partnerId) ?? [];
      list.push(message);
      map.set(partnerId, list);
    }
    return Array.from(map.entries()).map(([partnerId, list]) => ({
      partnerId,
      partner: list[0].senderId === currentUserId ? list[0].recipient : list[0].sender,
      messages: list.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    }));
  }, [messages, currentUserId]);

  const active = conversations.find((c) => c.partnerId === selectedPartner) ?? conversations[0] ?? null;

  async function sendReply() {
    if (!active || !reply.trim()) return;
    const result = await sendMessage({ recipientId: active.partnerId, body: reply.trim() });
    if (result.ok) {
      setReply("");
      toast.success("تم إرسال الرسالة");
    } else {
      toast.error(result.error);
    }
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="لا توجد رسائل"
        description="رسائلك مع الأنشطة التجارية ستظهر هنا."
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      {/* Conversation list */}
      <div className="space-y-1 rounded-2xl border p-2">
        {conversations.map((conversation) => {
          const last = conversation.messages[conversation.messages.length - 1];
          const unread = conversation.messages.some((m) => m.recipientId === currentUserId && !m.isRead);
          return (
            <button
              key={conversation.partnerId}
              onClick={() => setSelectedPartner(conversation.partnerId)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl p-3 text-start transition-colors",
                active?.partnerId === conversation.partnerId ? "bg-accent" : "hover:bg-muted/60"
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback>{conversation.partner.name?.[0] ?? "؟"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{conversation.partner.name || conversation.partner.email}</p>
                <p className="truncate text-xs text-muted-foreground">{last.body}</p>
              </div>
              {unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      {/* Conversation detail */}
      {active ? (
        <div className="flex flex-col rounded-2xl border">
          <div className="border-b p-4">
            <p className="font-semibold">{active.partner.name || active.partner.email}</p>
            <p className="text-xs text-muted-foreground">{active.partner.email}</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {active.messages.map((message) => {
              const mine = message.senderId === currentUserId;
              return (
                <div key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      mine
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted"
                    )}
                  >
                    <p>{message.body}</p>
                    <p className={cn("mt-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-end gap-2 border-t p-3">
            <Textarea
              rows={2}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="اكتب رسالتك…"
            />
            <Button onClick={sendReply} disabled={!reply.trim()}>
              <Send className="h-4 w-4 rtl:-scale-x-100" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
