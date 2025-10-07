import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

/**
 * Root path redirect to admin panel
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.redirect("/app")
}
