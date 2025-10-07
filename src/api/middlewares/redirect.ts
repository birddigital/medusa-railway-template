import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * Middleware to redirect root path to admin panel
 */
export function redirectMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Only redirect exact root path
  if (req.path === "/" && req.method === "GET") {
    return res.redirect("/app")
  }

  next()
}
