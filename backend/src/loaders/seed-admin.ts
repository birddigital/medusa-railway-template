import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function seedAdminLoader(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  
  logger.info("Starting admin user seed...")
  
  try {
    const userService = container.resolve("user")
    
    const email = process.env.MEDUSA_ADMIN_EMAIL || "admin@floridasbackroom.com"
    const password = process.env.MEDUSA_ADMIN_PASSWORD || "SuperSecure2025!"
    
    // Check if admin already exists
    const users = await userService.listUsers({ email })
    
    if (users && users.length > 0) {
      logger.info(`Admin user ${email} already exists`)
      return
    }
    
    // Create admin user
    await userService.createUsers({
      email,
      password,
      first_name: "Admin",
      last_name: "User"
    })
    
    logger.info(`Admin user created successfully: ${email}`)
  } catch (error) {
    logger.error("Failed to create admin user:", error)
  }
}