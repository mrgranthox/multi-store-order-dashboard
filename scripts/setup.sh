#!/bin/bash

# MultiStore Admin Dashboard Setup Script
echo "🚀 Setting up MultiStore Admin Dashboard..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        
        # Check if version is 18 or higher
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
            print_warning "Node.js version 18+ is recommended. Current version: $NODE_VERSION"
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            print_success "Environment file created from template"
        else
            print_warning "No env.example file found. Creating basic .env file..."
            cat > .env << EOF
# API Configuration
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_STRAPI_URL=http://localhost:1337/api
REACT_APP_SOCKET_URL=http://localhost:4000

# App Configuration
REACT_APP_NAME=MultiStore Admin Dashboard
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_REAL_TIME=true
EOF
            print_success "Basic environment file created"
        fi
    else
        print_warning "Environment file already exists. Skipping..."
    fi
}

# Check if backends are running
check_backends() {
    print_status "Checking if backends are running..."
    
    # Check MultiStore Backend
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        print_success "MultiStore Backend is running on port 4000"
    else
        print_warning "MultiStore Backend is not running on port 4000"
        print_status "Please start the MultiStore Backend before running the dashboard"
    fi
    
    # Check Strapi CMS
    if curl -s http://localhost:1337/api > /dev/null 2>&1; then
        print_success "Strapi CMS is running on port 1337"
    else
        print_warning "Strapi CMS is not running on port 1337"
        print_status "Please start the Strapi CMS before running the dashboard"
    fi
}

# Build the project
build_project() {
    print_status "Building the project..."
    if npm run build; then
        print_success "Project built successfully"
    else
        print_error "Failed to build project"
        exit 1
    fi
}

# Main setup function
main() {
    echo "=========================================="
    echo "  MultiStore Admin Dashboard Setup"
    echo "=========================================="
    echo ""
    
    check_node
    check_npm
    install_dependencies
    setup_environment
    check_backends
    
    echo ""
    print_success "Setup completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Make sure both backends are running:"
    echo "   - MultiStore Backend: http://localhost:4000"
    echo "   - Strapi CMS: http://localhost:1337"
    echo ""
    echo "2. Start the development server:"
    echo "   npm start"
    echo ""
    echo "3. Open your browser and navigate to:"
    echo "   http://localhost:3000"
    echo ""
    echo "4. Login with your admin credentials"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main
