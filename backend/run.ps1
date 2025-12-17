# PowerShell script to run the BRD Utility backend server

Write-Host "Starting BRD Utility Backend Server..." -ForegroundColor Green

# Navigate to backend directory
Set-Location $PSScriptRoot

# Check if virtual environment exists
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & .\venv\Scripts\Activate.ps1
}

# Install/update dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

# Start the server
Write-Host "Starting FastAPI server on http://127.0.0.1:8001" -ForegroundColor Green
Write-Host "API Documentation: http://127.0.0.1:8001/docs" -ForegroundColor Cyan
Write-Host "Health Check: http://127.0.0.1:8001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001

