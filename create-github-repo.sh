#!/bin/bash

# GitHub Repository Setup Script
echo "🐙 GitHub Repository Setup for 3Scope"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "📦 Installing GitHub CLI..."
    brew install gh
fi

# Login to GitHub (if not already logged in)
echo "🔐 Please login to GitHub..."
gh auth login

# Create repository
echo "📁 Creating GitHub repository..."
gh repo create 3scope --public --description "Full-stack ESG emissions tracking platform with Climatiq API integration" --clone=false

# Add remote and push
echo "🚀 Pushing code to GitHub..."
git remote add origin https://github.com/$(gh api user --jq .login)/3scope.git
git branch -M main
git push -u origin main

echo "✅ Repository created and code pushed!"
echo "🌐 Repository URL: https://github.com/$(gh api user --jq .login)/3scope"