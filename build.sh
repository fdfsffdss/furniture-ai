#!/bin/bash
set -e

echo "🏗️ Building Furniture AI..."

# Move to root
cd "$(dirname "$0")" || exit 1

# Install backend dependencies (including devDependencies)
echo "📦 Installing backend dependencies..."
cd backend
npm ci --legacy-peer-deps 2>/dev/null || npm install --legacy-peer-deps

# Install frontend dependencies (including devDependencies)
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm ci --legacy-peer-deps 2>/dev/null || npm install --legacy-peer-deps

# Build frontend
echo "🔨 Building frontend..."
npm run build

echo "✅ Build complete!"
