# Quick Fix: Database Setup for Registration

## Problem
You're getting a 500 error when trying to register because the database `IQVIA_DocuFlow` doesn't exist or you don't have permissions.

## Solution Options

### Option 1: Create Database Manually (Recommended)

1. **Open SQL Server Management Studio (SSMS)**
   - If you don't have it, download from: https://aka.ms/ssmsfullsetup

2. **Connect to SQL Server**
   - Server name: `localhost` or `.` (local instance)
   - Authentication: Windows Authentication

3. **Create the Database**
   - Right-click on "Databases" → "New Database"
   - Name: `IQVIA_DocuFlow`
   - Click "OK"

4. **Grant Permissions** (if needed)
   - Right-click on the database → "Properties" → "Files"
   - Make sure your Windows user has access
   - Or go to "Security" → "Users" and add your Windows user

5. **Restart the Backend Server**
   - The application will automatically create the `users` table on startup

### Option 2: Use SQL Server Express LocalDB (Easier for Development)

If you don't have full SQL Server, you can use LocalDB:

1. **Install SQL Server Express LocalDB**
   - Download from: https://go.microsoft.com/fwlink/?LinkID=866658

2. **Update your `.env` file** in the `backend` folder:
   ```
   DB_SERVER=(localdb)\MSSQLLocalDB
   DB_DATABASE=IQVIA_DocuFlow
   DB_USERNAME=
   DB_PASSWORD=
   DB_DRIVER=ODBC Driver 17 for SQL Server
   SECRET_KEY=your-secret-key-change-this-in-production
   ```

3. **Create the database using SQL Server Management Studio** or run:
   ```sql
   CREATE DATABASE IQVIA_DocuFlow
   ```

### Option 3: Check SQL Server Configuration

1. **Verify SQL Server is Running**
   - Open "Services" (Win+R → `services.msc`)
   - Look for "SQL Server (MSSQLSERVER)" or "SQL Server (SQLEXPRESS)"
   - Make sure it's "Running"

2. **Check SQL Server Authentication**
   - Open SQL Server Management Studio
   - Right-click server → "Properties" → "Security"
   - Make sure "SQL Server and Windows Authentication mode" is enabled
   - Restart SQL Server service if you changed it

3. **Check Windows User Permissions**
   - Your Windows user needs to be added as a SQL Server login
   - In SSMS: Security → Logins → Right-click → "New Login"
   - Add your Windows user and grant "sysadmin" or "dbcreator" role

## Test Your Setup

After setting up, run this command to test:

```powershell
cd backend
python test_db_connection.py
```

If you see "[OK] All checks passed!", you're ready to go!

## Restart the Backend

After fixing the database:

1. Stop the current backend server (Ctrl+C in the terminal)
2. Restart it:
   ```powershell
   cd backend
   .\run.ps1
   ```

3. Try registering again at http://localhost:5173

## Still Having Issues?

If you're still getting errors:

1. Check the backend terminal for detailed error messages
2. Make sure SQL Server is actually installed and running
3. Try connecting to SQL Server using SQL Server Management Studio first
4. Check Windows Event Viewer for SQL Server errors

