#!/bin/bash
set -e

echo "🏗️ Building Furniture AI..."

# Move to root
cd "$(dirname "$0")" || exit 1

# Install backend dependencies (including devDependencies)
echo "📦 Installing backend dependencies..."
cd backend
npm install --legacy-peer-deps

# Install frontend dependencies (including devDependencies)
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install --legacy-peer-deps

# Build frontend
echo "🔨 Building frontend..."
npm run build

echo "✅ Build complete!"
