import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
    } & DefaultSession["user"];
  }

  interface User {
    firstName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    firstName?: string;
  }
}
