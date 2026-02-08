#!/bin/bash

# Reset and Seed Database Script
# This script resets the database and seeds test users
# Use this after the UserStatus enum migration

set -e  # Exit on error

echo "🔄 Database Reset and Seed Script"
echo "=================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "   Please start Docker/OrbStack first, then run this script again."
    echo ""
    echo "   After starting Docker, run:"
    echo "   npm run dev:docker"
    echo ""
    exit 1
fi

# Check if MongoDB container is running
if ! docker ps | grep -q alkitu-mongodb; then
    echo "⚠️  MongoDB container is not running!"
    echo "   Starting MongoDB via docker-compose..."
    cd ../..
    docker-compose -f docker-compose.dev.yml up -d mongodb
    echo "   Waiting for MongoDB to be ready..."
    sleep 5
    cd packages/api
fi

echo "✅ Docker is running"
echo ""

# Step 1: Reset database
echo "1️⃣  Resetting database..."
npx prisma db push --force-reset --accept-data-loss

echo ""
echo "✅ Database reset complete"
echo ""

# Step 2: Seed test users
echo "2️⃣  Seeding test users..."
npm run seed:test-users

echo ""
echo "✅ Database reset and seed complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Run E2E tests: cd ../web && npm run test:e2e"
echo "   2. Or start dev server: npm run dev"
echo ""
