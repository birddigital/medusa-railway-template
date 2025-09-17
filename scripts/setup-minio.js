#!/usr/bin/env node

/**
 * MinIO Setup Script
 * Creates the required bucket for MedusaJS file uploads
 */

import { Client as MinioClient } from 'minio'

async function setupMinIO() {
  // Skip if MinIO is not configured
  if (!process.env.MINIO_ENDPOINT) {
    console.log('ℹ️  MinIO not configured, skipping setup')
    return
  }

  console.log('📁 Setting up MinIO storage...')
  
  try {
    // Parse MinIO endpoint
    const endpoint = process.env.MINIO_ENDPOINT.replace(/^https?:\/\//, '')
    const useSSL = process.env.NODE_ENV === 'production'
    
    // Create MinIO client
    const minioClient = new MinioClient({
      endPoint: endpoint,
      port: parseInt(process.env.MINIO_PORT) || (useSSL ? 443 : 9000),
      useSSL,
      accessKey: process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD
    })
    
    const bucketName = process.env.MINIO_BUCKET || 'medusa-uploads'
    
    // Check if bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName)
    
    if (!bucketExists) {
      // Create bucket
      await minioClient.makeBucket(bucketName, 'us-east-1')
      console.log(`✅ Created MinIO bucket: ${bucketName}`)
      
      // Set bucket policy for public read access (optional)
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/public/*`]
          }
        ]
      }
      
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy))
      console.log('✅ Set bucket policy for public folder')
    } else {
      console.log(`ℹ️  MinIO bucket '${bucketName}' already exists`)
    }
    
    // Create folder structure
    const folders = ['products', 'variants', 'categories', 'public']
    for (const folder of folders) {
      const objectName = `${folder}/.keep`
      const stream = Buffer.from('')
      
      await minioClient.putObject(bucketName, objectName, stream, 0, {
        'Content-Type': 'text/plain'
      })
    }
    
    console.log('✅ MinIO setup completed successfully')
    
  } catch (error) {
    console.error('❌ MinIO setup failed:', error.message)
    // Don't fail deployment if MinIO setup fails
    if (process.env.RAILWAY_ENVIRONMENT) {
      console.log('⚠️  Continuing deployment without MinIO')
    }
  }
}

// Run setup
setupMinIO()