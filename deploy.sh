#!/bin/bash

# MedusaJS Railway Deployment Script
set -e

echo "🚀 MedusaJS Railway Deployment"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

# Login to Railway (if not already)
echo -e "${BLUE}Checking Railway authentication...${NC}"
railway whoami || railway login

# Create new project or use existing
echo -e "${BLUE}Setting up Railway project...${NC}"
railway link || railway init

# Deploy to Railway
echo -e "${GREEN}Deploying to Railway...${NC}"
railway up

# Add PostgreSQL if not exists
echo -e "${BLUE}Adding PostgreSQL database...${NC}"
railway add postgresql || echo "PostgreSQL may already exist"

# Add Redis if not exists
echo -e "${BLUE}Adding Redis cache...${NC}"
railway add redis || echo "Redis may already exist"

# Set environment variables
echo -e "${BLUE}Setting environment variables...${NC}"
railway vars set JWT_SECRET=$(openssl rand -base64 32)
railway vars set COOKIE_SECRET=$(openssl rand -base64 32)
railway vars set NODE_ENV=production
railway vars set WORKER_MODE=shared

# Get deployment URL
echo ""
echo -e "${GREEN}Deployment complete!${NC}"
echo ""
echo "Your MedusaJS app is deploying..."
echo "Check status: railway status"
echo "View logs: railway logs"
echo "Open app: railway open"
echo ""
echo "Create admin user after deployment:"
echo "railway exec medusa user -e admin@example.com -p yourpassword"