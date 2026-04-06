import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "better-sqlite3", "@neondatabase/serverless"],
}

export default nextConfig
