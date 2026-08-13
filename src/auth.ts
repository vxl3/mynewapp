import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * احجزلي — Auth.js instance (Node runtime).
 * Exposes the route handlers (`/api/auth/[...nextauth]`) and the `auth`
 * helper used by server components & route handlers.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
