#!/usr/bin/env node

/**
 * Automated Admin User Creation Script
 * Creates an admin user on first deployment
 */

import { initialize } from "@medusajs/medusa"
import crypto from "crypto"

async function createAdminUser() {
  console.log("🔐 Creating admin user...");
  
  try {
    // Initialize Medusa
    const { container } = await initialize();
    const userService = container.resolve("userService");
    
    // Get credentials from environment or generate
    const email = process.env.ADMIN_EMAIL || "admin@store.com";
    const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString("hex");
    
    // Check if admin already exists
    const existingUser = await userService
      .list({ email }, { select: ["id"] })
      .catch(() => null);
    
    if (existingUser?.length > 0) {
      console.log("ℹ️  Admin user already exists, skipping creation");
      return;
    }
    
    // Create admin user
    const user = await userService.create({
      email,
      password,
      first_name: "Admin",
      last_name: "User",
      role: "admin",
    });
    
    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:    ", email);
    console.log("🔑 Password: ", password);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔗 Admin URL: ", process.env.RAILWAY_STATIC_URL 
      ? `${process.env.RAILWAY_STATIC_URL}/admin`
      : "http://localhost:9000/admin");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  IMPORTANT: Save these credentials securely!");
    console.log("⚠️  Change the password after first login!");
    
    // Save to Railway logs for retrieval
    if (process.env.RAILWAY_ENVIRONMENT) {
      console.log(`::set-output name=admin_email::${email}`);
      console.log(`::set-output name=admin_password::${password}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin user:", error.message);
    
    // Don't fail the deployment if admin creation fails
    if (process.env.RAILWAY_ENVIRONMENT) {
      console.log("⚠️  Admin creation failed but deployment continues");
      console.log("⚠️  You can create an admin manually later using:");
      console.log("    railway run npx medusa user --email your@email.com");
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

// Run the script
createAdminUser();