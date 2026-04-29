#!/bin/bash

# Food Delivery Platform - Deployment Setup Script
# This script prepares your code for deployment

set -e

echo "🚀 Food Delivery Platform - Deployment Setup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
else
    echo -e "${GREEN}✅ Git already initialized${NC}"
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo -e "${YELLOW}Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/
**/node_modules/

# Build outputs
dist/
*/dist/
**/dist/
build/
*/build/
**/build/

# Environment variables
.env
.env.local
.env.production
.env.development

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Docker
docker-compose.override.yml

# Temporary files
*.tmp
.cache/
EOF
    echo -e "${GREEN}✅ .gitignore created${NC}"
else
    echo -e "${GREEN}✅ .gitignore exists${NC}"
fi

# Add all files
echo -e "${YELLOW}Adding files to git...${NC}"
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${GREEN}✅ No changes to commit${NC}"
else
    echo -e "${YELLOW}Committing changes...${NC}"
    git commit -m "Prepare for deployment - All-in-One setup"
    echo -e "${GREEN}✅ Changes committed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Create GitHub repository:"
echo "   ${YELLOW}gh repo create food-delivery-platform --public --source=. --remote=origin --push${NC}"
echo ""
echo "   OR manually:"
echo "   - Go to https://github.com/new"
echo "   - Create repo: food-delivery-platform"
echo "   - Run: git remote add origin https://github.com/YOUR_USERNAME/food-delivery-platform.git"
echo "   - Run: git branch -M main"
echo "   - Run: git push -u origin main"
echo ""
echo "2. Follow the deployment guide in DEPLOY_NOW.md"
echo ""
echo -e "${GREEN}Ready to deploy! 🚀${NC}"
