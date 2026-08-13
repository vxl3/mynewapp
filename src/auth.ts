import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { RoleName, resolvePrimaryRole } from "@/config/roles";
import { MAX_LOGIN_ATTEMPTS, LOCK_DURATION_MS } from "@/lib/security";

/**
 * احجزلي — Auth.js configuration (JWT session strategy).
 *
 * Credentials provider verifies email + password against the database,
 * enforces account locking after repeated failures, and embeds RBAC roles
 * into the session JWT so middleware + API handlers can authorize cheaply.
 */
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember: z.string().optional(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "text" },
      },
      authorize: async (rawCredentials) => {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password, remember } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { roles: { include: { role: true } } },
        });

        if (!user || !user.passwordHash) return null;

        // Account lockout: reject while the lock window is active.
        if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
          return null;
        }

        const valid = await compare(password, user.passwordHash);
        if (!valid) {
          const attempts = user.failedLoginAttempts + 1;
          const lockedUntil =
            attempts >= MAX_LOGIN_ATTEMPTS
              ? new Date(Date.now() + LOCK_DURATION_MS)
              : user.lockedUntil;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: attempts,
              lockedUntil,
              lastLoginAt: user.lastLoginAt,
            },
          });
          return null;
        }

        // Reset the failure counter and record the successful sign-in.
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
        });

        const roles = user.roles.map((r) => r.role.name);
        const primaryRole = resolvePrimaryRole(roles) ?? RoleName.CUSTOMER;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.firstName ?? user.email,
          image: user.avatarUrl,
          role: primaryRole,
          roles,
          mfaEnabled: user.mfaEnabled,
          // "remember me" extends the session lifetime on the client cookie.
          remember: remember === "true",
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roles = user.roles;
        token.mfaEnabled = user.mfaEnabled;
        token.email = user.email as string;
        token.name = user.name as string;
        if (user.remember) {
          token.maxAge = 60 * 60 * 24 * 30; // 30 days
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as RoleName;
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.mfaEnabled = token.mfaEnabled as boolean;
      }
      return session;
    },
  },
  events: {
    signIn: async ({ user }) => {
      // Phase 2 will record an AuditLog entry here (login audit trail).
      void user;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
