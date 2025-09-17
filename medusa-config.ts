import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectName: "medusa-railway-deploy",
  database: {
    clientUrl: process.env.DATABASE_URL || "postgres://localhost/medusa-store",
  },
  http: {
    compression: true,
    jwtSecret: process.env.JWT_SECRET || "supersecret",
    cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    cors: process.env.STORE_CORS || "http://localhost:8000,http://localhost:7001",
  },
  admin: {
    disable: process.env.DISABLE_ADMIN === "true",
    autoRebuild: process.env.NODE_ENV === "development",
  },
  store: {
    cors: process.env.STORE_CORS || "http://localhost:8000",
  },
  redis: process.env.REDIS_URL ? {
    url: process.env.REDIS_URL,
  } : undefined,
  worker: {
    mode: process.env.WORKER_MODE as "shared" | "worker" | "server" || "shared",
  },
  features: {
    // Enable products feature
    products: true,
    // Enable workflow engine
    workflows: true,
    // Enable notifications
    notifications: true,
    // Enable inventory
    inventory: true,
  },
})