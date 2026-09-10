import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Without this, node-postgres silently falls back to localhost:5432 and the
    // failure surfaces as an unrelated "can't reach 127.0.0.1" error at query time.
    throw new Error(
      "DATABASE_URL is not set. Add it to your environment (locally in .env, or in your hosting platform's environment variables) and redeploy."
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
