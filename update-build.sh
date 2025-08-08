#!/bin/bash

# Update build number script for Tax Calculator
# Usage: ./update-build.sh [version] [description]

# Get current date
CURRENT_DATE=$(date +"%Y-%m-%d")
CURRENT_TIME=$(date +"%H%M")

# Get version from command line or default to 1.0.0
VERSION=${1:-"1.0.0"}
DESCRIPTION=${2:-"Update"}

# Create new build number
BUILD_NUMBER="${CURRENT_DATE//-/.}.${CURRENT_TIME}"

echo "Updating build number..."
echo "Version: $VERSION"
echo "Build: $BUILD_NUMBER"
echo "Date: $CURRENT_DATE"
echo "Description: $DESCRIPTION"

# Update version.json
cat > version.json << EOF
{
  "version": "$VERSION",
  "build": "$BUILD_NUMBER",
  "date": "$CURRENT_DATE",
  "description": "$DESCRIPTION",
  "features": [
    "UK Tax Calculator with 2024/25 rates",
    "iCloud Keychain sync support",
    "PWA with home screen installation",
    "Clickable comparison table",
    "Payday sorting",
    "Cross-device data sync"
  ]
}
EOF

echo "✅ Build number updated to $BUILD_NUMBER"

# Commit the changes
git add version.json
git commit -m "Update build number to $BUILD_NUMBER - $DESCRIPTION"
git push

echo "✅ Changes committed and pushed to GitHub"
echo "🌐 Live site will update in a few minutes"
