#!/bin/bash

# Start script for College ERP System
echo "🚀 Starting College ERP System..."

# Function to handle errors
handle_error() {
    echo "❌ Error: $1"
    exit 1
}

# Install dependencies for main project
echo "📦 Installing main project dependencies..."
npm ci || handle_error "Failed to install main dependencies"

# Install dependencies for all frontend applications
echo "📦 Installing frontend dependencies..."
npm run install:all || handle_error "Failed to install frontend dependencies"

# Build all frontend applications
echo "🔨 Building frontend applications..."
npm run build:all || handle_error "Failed to build frontend applications"

# Start all services
echo "🎯 Starting all services..."
echo "Backend will run on port 3000"
echo "Auth app will run on port 3005"
echo "Admin dashboard will run on port 3001"
echo "Faculty dashboard will run on port 3002"
echo "Family dashboard will run on port 3003"
echo "Student dashboard will run on port 3004"

# Execute the start command
exec npm run start:all
