import { MedusaApp } from "@medusajs/framework"
import { defineConfig } from "@medusajs/framework/utils"

export default async function () {
  const app = MedusaApp({
    config: defineConfig({
      projectName: "medusa-railway-deploy",
      database: {
        clientUrl: process.env.DATABASE_URL,
      },
    }),
  })

  await app.start()
}