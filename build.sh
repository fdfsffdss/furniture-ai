#!/bin/bash
set -e

echo "🏗️ Building Furniture AI..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install --legacy-peer-deps

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Go back to backend
cd ../backend

echo "✅ Build complete!"
