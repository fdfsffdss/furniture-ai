#!/bin/bash
set -e

echo "🏗️ Building Furniture AI..."

# Move to root
cd "$(dirname "$0")" || exit 1

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

echo "✅ Build complete!"
