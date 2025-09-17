#!/usr/bin/env node

/**
 * Deployment Validation Script
 * Checks that all services are properly configured and running
 */

import fetch from "node-fetch"
import { createConnection } from "typeorm"
import Redis from "ioredis"
import { Client as MinioClient } from "minio"
import { MeiliSearch } from "meilisearch"

const checks = []

// Helper function to run checks
async function runCheck(name, checkFn, critical = false) {
  try {
    await checkFn()
    checks.push({ name, status: "✅", critical })
    return true
  } catch (error) {
    checks.push({ name, status: "❌", error: error.message, critical })
    return false
  }
}

// Check environment variables
async function checkEnvironmentVariables() {
  const required = [
    "DATABASE_URL",
    "REDIS_URL",
    "JWT_SECRET",
    "COOKIE_SECRET"
  ]
  
  for (const env of required) {
    if (!process.env[env]) {
      throw new Error(`Missing required: ${env}`)
    }
  }
}

// Check database connection
async function checkDatabase() {
  const connection = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
  })
  
  await connection.query("SELECT 1")
  await connection.close()
}

// Check Redis connection
async function checkRedis() {
  const redis = new Redis(process.env.REDIS_URL)
  await redis.ping()
  await redis.quit()
}

// Check MinIO connection
async function checkMinIO() {
  if (!process.env.MINIO_ENDPOINT) {
    console.log("MinIO not configured, skipping")
    return
  }
  
  const minioClient = new MinioClient({
    endPoint: process.env.MINIO_ENDPOINT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: process.env.NODE_ENV === "production"
  })
  
  const buckets = await minioClient.listBuckets()
  if (!buckets.find(b => b.name === process.env.MINIO_BUCKET)) {
    await minioClient.makeBucket(process.env.MINIO_BUCKET)
  }
}

// Check MeiliSearch connection
async function checkMeiliSearch() {
  if (!process.env.MEILISEARCH_HOST) {
    console.log("MeiliSearch not configured, skipping")
    return
  }
  
  const client = new MeiliSearch({
    host: process.env.MEILISEARCH_HOST,
    apiKey: process.env.MEILISEARCH_API_KEY
  })
  
  await client.getStats()
}

// Check API endpoints
async function checkAPIEndpoints() {
  const baseUrl = process.env.RAILWAY_STATIC_URL || "http://localhost:9000"
  const endpoints = [
    "/health",
    "/store/products",
    "/store/regions"
  ]
  
  for (const endpoint of endpoints) {
    const response = await fetch(`${baseUrl}${endpoint}`)
    if (!response.ok) {
      throw new Error(`${endpoint} returned ${response.status}`)
    }
  }
}

// Check admin access
async function checkAdminAccess() {
  const baseUrl = process.env.RAILWAY_STATIC_URL || "http://localhost:9000"
  const response = await fetch(`${baseUrl}/admin`)
  
  // Admin should return 200 or 301 (redirect to login)
  if (response.status !== 200 && response.status !== 301) {
    throw new Error(`Admin panel returned ${response.status}`)
  }
}

// Main validation function
async function validateDeployment() {
  console.log("🔍 Validating MedusaJS Deployment...")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  
  // Run all checks
  await runCheck("Environment Variables", checkEnvironmentVariables, true)
  await runCheck("Database Connection", checkDatabase, true)
  await runCheck("Redis Connection", checkRedis, true)
  await runCheck("MinIO Storage", checkMinIO, false)
  await runCheck("MeiliSearch", checkMeiliSearch, false)
  await runCheck("API Endpoints", checkAPIEndpoints, true)
  await runCheck("Admin Panel", checkAdminAccess, false)
  
  // Print results
  console.log("\n📊 Validation Results:")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  
  let hasErrors = false
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}`)
    if (check.error) {
      console.log(`   └─ ${check.error}`)
      if (check.critical) hasErrors = true
    }
  })
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  
  // Summary
  const passed = checks.filter(c => c.status === "✅").length
  const total = checks.length
  const percentage = Math.round((passed / total) * 100)
  
  console.log(`\n📈 Score: ${passed}/${total} checks passed (${percentage}%)`)
  
  if (hasErrors) {
    console.error("\n❌ Critical checks failed! Deployment may not work properly.")
    process.exit(1)
  } else if (percentage === 100) {
    console.log("\n✅ Perfect! All checks passed. Deployment is fully operational.")
  } else {
    console.log("\n⚠️  Some optional features are not configured, but core functionality works.")
  }
}

// Run validation
validateDeployment().catch(error => {
  console.error("❌ Validation failed:", error)
  process.exit(1)
})