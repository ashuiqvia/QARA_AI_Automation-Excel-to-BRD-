# Render Build Fix - Linux Compatibility

## Problem
Render uses Linux servers, but the code was configured for Windows ODBC drivers.

## Solution Applied

### 1. Updated `backend/database.py`
- Added platform detection (Linux vs Windows)
- Uses "ODBC Driver 18 for SQL Server" on Linux
- Uses "ODBC Driver 17 for SQL Server" on Windows
- Forces SQL Server Authentication on Linux (Windows Auth doesn't work)

### 2. Updated `render.yaml`
- Changed DB_DRIVER to "ODBC Driver 18 for SQL Server"
- Updated build command to install Linux dependencies

### 3. Created `backend/build.sh`
- Installs unixodbc-dev (required for pyodbc on Linux)
- Attempts to install ODBC Driver 18 (may not work on free tier)

## Important: Environment Variables in Render

Make sure these are set in Render dashboard:

1. **DB_DRIVER**: `ODBC Driver 18 for SQL Server` (or leave default)
2. **DB_USERNAME**: Your SQL Server username (REQUIRED on Linux)
3. **DB_PASSWORD**: Your SQL Server password (REQUIRED on Linux)

⚠️ **Windows Authentication will NOT work on Render** - you MUST use SQL Server Authentication!

## Alternative: If ODBC Driver Installation Fails

If the build still fails, you can:

1. **Use FreeTDS** (alternative driver):
   - Set `DB_DRIVER=FreeTDS` in Render
   - Install FreeTDS: `apt-get install -y freetds-dev`

2. **Or use pymssql** (pure Python, no ODBC needed):
   - Replace `pyodbc` with `pymssql` in requirements.txt
   - Update database.py to use pymssql instead

## Testing the Fix

After deploying:
1. Check Render logs for any errors
2. Test health endpoint: `https://your-backend.onrender.com/health`
3. Check database connection in logs

