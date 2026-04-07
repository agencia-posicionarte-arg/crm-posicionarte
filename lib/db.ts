import { PrismaClient } from "@/app/generated/prisma/client"

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db"
  const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")

  if (isPostgres) {
    // Producción: Neon PostgreSQL via HTTP (no requiere WebSocket en Vercel)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeonHttp } = require("@prisma/adapter-neon")
    const adapter = new PrismaNeonHttp(dbUrl)
    return new PrismaClient({ adapter })
  }

  // Desarrollo: SQLite con better-sqlite3
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3")
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path")
  const dbPath = dbUrl.replace(/^file:/, "")
  const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath)
  const adapter = new PrismaBetterSqlite3({ url: absolutePath })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
