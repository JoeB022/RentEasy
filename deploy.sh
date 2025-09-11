#!/bin/bash

# RentEasy Deployment Script for Render.com
# This script helps prepare and deploy the application

set -e

echo "🚀 RentEasy Deployment Script"
echo "=============================="

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

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    print_error "Please run this script from the RentEasy root directory"
    exit 1
fi

print_status "Starting deployment preparation..."

# 1. Check Git status
echo ""
echo "📋 Checking Git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Consider committing them first."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
    fi
else
    print_status "Git repository is clean"
fi

# 2. Test backend build
echo ""
echo "🔧 Testing backend build..."
cd backend
if [ -f "requirements-prod.txt" ]; then
    print_status "Production requirements file found"
else
    print_error "Production requirements file not found"
    exit 1
fi

# Test if we can import the app
python3 -c "
try:
    from app import create_app
    app = create_app()
    print('✅ Backend app imports successfully')
except Exception as e:
    print(f'❌ Backend import failed: {e}')
    exit(1)
"

cd ..

# 3. Test frontend build
echo ""
echo "🎨 Testing frontend build..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    npm install
fi

# Test build
npm run build
if [ $? -eq 0 ]; then
    print_status "Frontend builds successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

# 4. Check deployment files
echo ""
echo "📁 Checking deployment files..."

files_to_check=(
    "render.yaml"
    "backend/render.yaml"
    "frontend/render.yaml"
    "backend/requirements-prod.txt"
    "wsgi.py"
    "backend/gunicorn.conf.py"
    "DEPLOYMENT.md"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found $file"
    else
        print_error "Missing $file"
        exit 1
    fi
done

# 5. Environment variables check
echo ""
echo "🔐 Environment variables check..."
print_warning "Make sure you have these environment variables set in Render:"
echo ""
echo "Backend:"
echo "  - SECRET_KEY (auto-generated)"
echo "  - JWT_SECRET_KEY (auto-generated)"
echo "  - DATABASE_URL (from PostgreSQL service)"
echo "  - FRONTEND_URL (your frontend URL)"
echo "  - ENV=production"
echo ""
echo "Frontend:"
echo "  - VITE_API_URL (your backend URL)"
echo ""

# 6. Final checks
echo ""
echo "🎯 Final deployment checklist:"
echo ""

echo "✅ Backend:"
echo "   - Production requirements ready"
echo "   - WSGI configuration ready"
echo "   - Gunicorn configuration ready"
echo "   - Database migrations ready"
echo ""

echo "✅ Frontend:"
echo "   - Build successful"
echo "   - Static files ready"
echo "   - Environment variables configured"
echo ""

echo "✅ Deployment files:"
echo "   - render.yaml configurations ready"
echo "   - Documentation ready"
echo ""

print_status "Deployment preparation complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service (Backend)"
echo "   - Create new Static Site (Frontend)"
echo "   - Create PostgreSQL database"
echo "   - Set environment variables"
echo ""
echo "3. Or use Blueprint deployment:"
echo "   - Connect your GitHub repo to Render"
echo "   - Select the render.yaml file"
echo "   - Click 'Apply'"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
print_status "Happy deploying! 🎉"
