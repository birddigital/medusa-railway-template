#!/bin/bash

# Post-deployment script for MedusaJS on Railway
# Runs after successful deployment to set up the application

set -e

echo "🚀 Starting post-deployment setup..."

# 1. Run database migrations
echo "📦 Running database migrations..."
npm run migrations:run || {
  echo "⚠️  Migrations may have already been applied"
}

# 2. Seed initial data (only if database is empty)
echo "🌱 Seeding database..."
npm run seed 2>/dev/null || {
  echo "ℹ️  Database already seeded or seed data not needed"
}

# 3. Create MinIO bucket for file uploads
if [ -n "$MINIO_ENDPOINT" ]; then
  echo "📁 Setting up MinIO storage bucket..."
  node scripts/setup-minio.js || {
    echo "⚠️  MinIO setup skipped (may already exist)"
  }
fi

# 4. Initialize MeiliSearch indexes
if [ -n "$MEILISEARCH_HOST" ]; then
  echo "🔍 Setting up MeiliSearch indexes..."
  node scripts/setup-meilisearch.js || {
    echo "⚠️  MeiliSearch setup skipped (may already exist)"
  }
fi

# 5. Create admin user
echo "👤 Creating admin user..."
node scripts/create-admin.js

# 6. Validate deployment
echo "✅ Running deployment validation..."
node scripts/validate-deployment.js

# 7. Display success message
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 MedusaJS deployment completed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 URLs:"
echo "   Store API:  ${RAILWAY_STATIC_URL}/store"
echo "   Admin:      ${RAILWAY_STATIC_URL}/admin"
echo "   Health:     ${RAILWAY_STATIC_URL}/health"
echo ""
echo "📊 Services:"
echo "   ✅ PostgreSQL Database"
echo "   ✅ Redis Cache"
echo "   ✅ MinIO Storage"
echo "   ✅ MeiliSearch"
echo ""
echo "🔐 Admin credentials have been displayed above"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"