#!/bin/bash
set -e

echo "🏗️ Building Furniture AI..."

# Move to root
cd "$(dirname "$0")" || exit 1

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm ci --prefer-offline --no-audit

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm ci --prefer-offline --no-audit

# Build frontend
echo "🔨 Building frontend..."
npm run build

echo "✅ Build complete!"
