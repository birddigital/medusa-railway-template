import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function seedAdminUser(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  
  try {
    const userModuleService = container.resolve("user")
    
    // Check if admin user already exists
    const existingUsers = await userModuleService.listUsers({
      email: process.env.MEDUSA_ADMIN_EMAIL || "admin@floridasbackroom.com"
    })
    
    if (existingUsers.length > 0) {
      logger.info("Admin user already exists, skipping seed")
      return
    }
    
    // Create admin user
    const adminUser = await userModuleService.createUsers({
      email: process.env.MEDUSA_ADMIN_EMAIL || "admin@floridasbackroom.com",
      password: process.env.MEDUSA_ADMIN_PASSWORD || "SuperSecure2025!",
      first_name: "Admin",
      last_name: "User",
      role: "admin"
    })
    
    logger.info(`Admin user created: ${adminUser.email}`)
  } catch (error) {
    logger.error("Failed to seed admin user:", error)
  }
}