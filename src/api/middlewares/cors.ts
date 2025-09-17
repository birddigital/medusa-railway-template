import { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework"

export async function corsMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const origin = req.headers.origin
  const allowedOrigins = (process.env.STORE_CORS || "").split(",")

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }

  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  )

  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }

  next()
}