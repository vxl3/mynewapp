import type { DefaultSession } from "next-auth";
import type { RoleName } from "@/config/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: RoleName;
      roles: string[];
      mfaEnabled: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: RoleName;
    roles?: string[];
    mfaEnabled?: boolean;
    remember?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: RoleName;
    roles?: string[];
    mfaEnabled?: boolean;
    maxAge?: number;
  }
}
