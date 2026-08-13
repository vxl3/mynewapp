import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { RoleName, resolvePrimaryRole } from "@/config/roles";
import { MAX_LOGIN_ATTEMPTS, LOCK_DURATION_MS } from "@/lib/constants";

/**
 * احجزلي — Auth.js configuration (edge-safe, split config).
 *
 * This module is intentionally free of any Node-only imports (Prisma) so the
 * SAME config can power both:
 *   - src/auth.ts (Node runtime — full auth handlers), and
 *   - src/middleware.ts (Edge runtime — route protection).
 *
 * Prisma is loaded lazily inside `authorize`, which only ever executes on the
 * server during credential sign-in (never in the middleware bundle).
 */
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember: z.string().optional(),
});

const providers: NonNullable<NextAuthConfig["providers"]> = [
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

      // Lazy imports keep Prisma (Node-only) out of the Edge bundle.
      const { prisma } = await import("@/lib/prisma");
      const { compare } = await import("bcryptjs");

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { roles: { include: { role: true } } },
      });

      if (!user || !user.passwordHash) return null;

      if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) return null;

      const valid = await compare(password, user.passwordHash);
      if (!valid) {
        const attempts = user.failedLoginAttempts + 1;
        const lockedUntil =
          attempts >= MAX_LOGIN_ATTEMPTS ? new Date(Date.now() + LOCK_DURATION_MS) : user.lockedUntil;
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: attempts, lockedUntil },
        });
        return null;
      }

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
        remember: remember === "true",
      };
    },
  }),
];

// Google OAuth — enabled only when credentials are configured.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roles = user.roles;
        token.mfaEnabled = user.mfaEnabled;
        token.email = user.email as string;
        token.name = user.name as string;
        if (user.remember) token.maxAge = 60 * 60 * 24 * 30;
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
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;
