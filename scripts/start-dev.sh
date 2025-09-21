#!/bin/bash

# Meerkato POS Development Start Script
echo "🏪 Starting Meerkato POS development environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Start database if not running
if check_port 5432; then
    print_info "Database is already running on port 5432"
else
    echo "🐳 Starting database..."
    docker-compose up -d postgres
    sleep 5
    print_status "Database started"
fi

# Start device agent if available
if [ -f "device-agent/device-agent" ]; then
    if check_port 8181; then
        print_info "Device agent is already running on port 8181"
    else
        echo "🔐 Starting device agent..."
        cd device-agent
        ./device-agent &
        AGENT_PID=$!
        cd ..
        sleep 2
        print_status "Device agent started (PID: $AGENT_PID)"
    fi
else
    print_warning "Device agent not found. Run 'cd device-agent && go build -o device-agent main.go' to build it."
fi

# Start all Next.js applications
echo "🚀 Starting all applications..."

# Start in background with different ports
npm run dev &
DEV_PID=$!

# Wait a moment for apps to start
sleep 3

echo ""
print_status "All applications started!"
echo ""
echo "📱 Applications are available at:"
echo "   🏪 Storefront:    http://meerkato.local:3000"
echo "   💼 POS Admin:     http://pos.meerkato.local:3001"
echo "   🤝 Suppliers:     http://proveedores.meerkato.local:3002"
echo "   🚚 Delivery:      http://entrega.meerkato.local:3003"
echo "   🔐 Device Agent:  http://localhost:8181"
echo "   🗄️  Database:     http://localhost:8080 (Adminer)"
echo ""
echo "📧 Test accounts:"
echo "   Admin:      admin@meerkato.co / password123"
echo "   Cashier:    cashier@meerkato.co / password123 (requires device)"
echo "   Delivery:   delivery@meerkato.co / password123"
echo "   Supplier:   supplier@distribuidora.co / password123"
echo "   Customer:   customer@gmail.com / password123"
echo ""
echo "💡 Tips:"
echo "   - Make sure you've added the domains to /etc/hosts"
echo "   - Press Ctrl+C to stop all services"
echo "   - Logs will appear below..."
echo ""

# Wait for the development server
wait $DEV_PID