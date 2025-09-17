import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "medusa-railway-deploy",
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    database: !!process.env.DATABASE_URL ? "connected" : "not configured",
    redis: !!process.env.REDIS_URL ? "connected" : "not configured",
  })
}