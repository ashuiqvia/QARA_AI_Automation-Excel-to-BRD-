#!/bin/bash
# Build script for Render.com deployment
# Installs ODBC drivers and dependencies for Linux

set -e

echo "=== Building Backend for Render ==="

# Install system dependencies for pyodbc
echo "Installing system dependencies..."
apt-get update
apt-get install -y unixodbc-dev gcc g++

# Try to install Microsoft ODBC Driver (may fail on free tier, that's OK)
echo "Attempting to install ODBC Driver 18..."
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - 2>/dev/null || true
curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list 2>/dev/null || true
apt-get update || true
ACCEPT_EULA=Y apt-get install -y msodbcsql18 2>/dev/null || echo "ODBC Driver installation skipped (may not be available on free tier)"

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "=== Build completed ==="
