#!/bin/bash

# Meerkato POS Development Setup Script
echo "🏪 Setting up Meerkato POS development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 20 or later."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="20.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 20 or later."
    exit 1
fi
print_status "Node.js version $NODE_VERSION is installed"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi
print_status "npm is installed"

# Check Docker
if ! command -v docker &> /dev/null; then
    print_warning "Docker is not installed. Please install Docker to run the database."
    DOCKER_AVAILABLE=false
else
    print_status "Docker is installed"
    DOCKER_AVAILABLE=true
fi

# Check Go
if ! command -v go &> /dev/null; then
    print_warning "Go is not installed. The device agent will not be available."
    GO_AVAILABLE=false
else
    GO_VERSION=$(go version | cut -d' ' -f3)
    print_status "Go $GO_VERSION is installed"
    GO_AVAILABLE=true
fi

# Install dependencies
echo -e "\n📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_status "Dependencies installed"

# Setup environment file
echo -e "\n🔧 Setting up environment configuration..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    print_status "Created .env.local from template"
else
    print_warning ".env.local already exists"
fi

# Setup hosts file entries for subdomains
echo -e "\n🌐 Setting up local development domains..."
print_warning "You need to add the following entries to your /etc/hosts file:"
echo "127.0.0.1 meerkato.local"
echo "127.0.0.1 pos.meerkato.local"
echo "127.0.0.1 proveedores.meerkato.local"
echo "127.0.0.1 entrega.meerkato.local"
echo ""
echo "On macOS/Linux, run:"
echo "sudo nano /etc/hosts"
echo ""
echo "On Windows, edit:"
echo "C:\\Windows\\System32\\drivers\\etc\\hosts"

# Start database if Docker is available
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo -e "\n🐳 Starting database with Docker..."
    docker-compose up -d postgres
    if [ $? -eq 0 ]; then
        print_status "Database started successfully"

        # Wait for database to be ready
        echo "Waiting for database to be ready..."
        sleep 10

        # Run database migrations
        echo -e "\n📊 Setting up database schema..."
        npm run db:push
        if [ $? -eq 0 ]; then
            print_status "Database schema created"

            # Seed database
            echo "🌱 Seeding database with demo data..."
            npm run db:seed
            if [ $? -eq 0 ]; then
                print_status "Database seeded with demo data"
            else
                print_warning "Failed to seed database"
            fi
        else
            print_warning "Failed to create database schema"
        fi
    else
        print_error "Failed to start database"
    fi
else
    print_warning "Skipping database setup - Docker not available"
fi

# Build device agent if Go is available
if [ "$GO_AVAILABLE" = true ]; then
    echo -e "\n🔐 Building device agent..."
    cd device-agent
    go mod tidy
    go build -o device-agent main.go
    if [ $? -eq 0 ]; then
        print_status "Device agent built successfully"
    else
        print_warning "Failed to build device agent"
    fi
    cd ..
else
    print_warning "Skipping device agent build - Go not available"
fi

# Create uploads directory
echo -e "\n📁 Creating upload directories..."
mkdir -p uploads/products
mkdir -p uploads/temp
print_status "Upload directories created"

echo -e "\n🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add the hosts file entries mentioned above"
echo "2. Update .env.local with your OpenAI API key (if using AI features)"
echo "3. Start the development environment:"
echo ""
echo "   npm run dev"
echo ""
echo "📱 Applications will be available at:"
echo "   🏪 Storefront:    http://meerkato.local:3000"
echo "   💼 POS Admin:     http://pos.meerkato.local:3001"
echo "   🤝 Suppliers:     http://proveedores.meerkato.local:3002"
echo "   🚚 Delivery:      http://entrega.meerkato.local:3003"
echo ""
if [ "$GO_AVAILABLE" = true ]; then
    echo "🔐 Device Agent:   http://localhost:8181"
    echo "   Start with:      cd device-agent && ./device-agent"
    echo ""
fi
echo "🗄️  Database Admin: http://localhost:8080 (Adminer)"
echo ""
echo "📧 Test accounts:"
echo "   Admin:      admin@meerkato.co / password123"
echo "   Manager:    manager@meerkato.co / password123"
echo "   Supervisor: supervisor@meerkato.co / password123 (requires device)"
echo "   Cashier:    cashier@meerkato.co / password123 (requires device)"
echo "   Delivery:   delivery@meerkato.co / password123"
echo "   Supplier:   supplier@distribuidora.co / password123"
echo "   Customer:   customer@gmail.com / password123"