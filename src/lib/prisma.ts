import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function getPool(): Pool {
  if (globalForPrisma.pool) return globalForPrisma.pool;

  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({
    connectionString,
    max: 5,                     // keep low for PgBouncer compatibility
    idleTimeoutMillis: 30000,   // close idle connections after 30s
    connectionTimeoutMillis: 5000, // fail fast if can't connect in 5s
    allowExitOnIdle: true,      // allow process to exit if pool idle
  });

  // Always cache globally — in dev to survive hot-reload, in prod to
  // avoid creating a new pool per request (which exhausts PgBouncer).
  globalForPrisma.pool = pool;
  return pool;
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const adapter = new PrismaPg(getPool());
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  // Always cache globally to reuse across requests within the same
  // serverless instance — prevents connection storms.
  globalForPrisma.prisma = client;
  return client;
}

// Lazy proxy: prisma is only instantiated on first property access (at runtime, not build time)
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
