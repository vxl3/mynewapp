import { prisma } from "@/lib/prisma";
import type { AuditAction } from "@prisma/client";

/**
 * Server-side audit logging. Every sensitive mutation should call this so
 * the platform maintains an immutable trail for compliance & forensics.
 */
export async function writeAuditLog(input: {
  userId?: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        ip: input.ip,
        userAgent: input.userAgent,
        metadata: input.metadata ? (input.metadata as object) : undefined,
      },
    });
  } catch {
    // Auditing must never break the primary operation.
  }
}
