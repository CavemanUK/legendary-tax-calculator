#!/bin/bash

# Legendary Tax Calculator - GitHub Pages Deployment Script
# This script helps you deploy your tax calculator to GitHub Pages

echo "🚀 Legendary Tax Calculator - GitHub Pages Deployment"
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Get GitHub username
echo "📝 Please enter your GitHub username:"
read -r github_username

# Repository name
repo_name="legendary-tax-calculator"

echo ""
echo "🔧 Setting up repository..."

# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Legendary Tax Calculator"

# Rename branch to main
git branch -M main

# Add remote origin
git remote add origin "https://github.com/$github_username/$repo_name.git"

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Repository created successfully!"
echo ""
echo "🌐 Next steps to enable GitHub Pages:"
echo "1. Go to: https://github.com/$github_username/$repo_name"
echo "2. Click 'Settings' tab"
echo "3. Scroll down to 'Pages' section"
echo "4. Select 'Deploy from a branch'"
echo "5. Choose 'main' branch"
echo "6. Click 'Save'"
echo ""
echo "🎉 Your site will be available at:"
echo "https://$github_username.github.io/$repo_name/"
echo ""
echo "⏳ It may take a few minutes for the site to be published."
