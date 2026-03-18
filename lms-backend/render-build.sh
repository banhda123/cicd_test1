#!/bin/bash

# Render Build Script
set -e

echo "🚀 Starting LMS Backend build for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migrations if needed
echo "🗄️ Running database migrations..."
npm run db:sync

# Run tests (optional - comment out if not needed)
echo "🧪 Running tests..."
npm test

echo "✅ Build completed successfully!"
