# Database Setup Guide

This guide will help you set up the SQL Server database for IQVIA DocuFlow authentication.

## Prerequisites

1. **SQL Server** installed and running (SQL Server Express or full version)
2. **SQL Server Management Studio (SSMS)** installed
3. **ODBC Driver** for SQL Server installed (usually comes with SSMS)

## Step 1: Create the Database

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Right-click on "Databases" → "New Database"
4. Name it: `IQVIA_DocuFlow`
5. Click "OK"

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory with the following configuration:

### Option A: Windows Authentication (Recommended for local development)

```env
DB_SERVER=localhost
DB_DATABASE=IQVIA_DocuFlow
DB_USERNAME=
DB_PASSWORD=
DB_DRIVER=ODBC Driver 17 for SQL Server
SECRET_KEY=your-secret-key-change-this-in-production
```

### Option B: SQL Server Authentication

```env
DB_SERVER=localhost
DB_DATABASE=IQVIA_DocuFlow
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DRIVER=ODBC Driver 17 for SQL Server
SECRET_KEY=your-secret-key-change-this-in-production
```

## Step 3: Verify ODBC Driver

To check which ODBC drivers are available on your system:

**Windows:**
1. Open "ODBC Data Source Administrator" (64-bit)
   - Press `Win + R`, type `odbcad32.exe`, press Enter
2. Go to the "Drivers" tab
3. Look for "ODBC Driver 17 for SQL Server" or "ODBC Driver 18 for SQL Server"
4. Update `DB_DRIVER` in `.env` to match the exact driver name

## Step 4: Test the Connection

The application will automatically create the `users` table when it starts. The table structure is:

```sql
CREATE TABLE [dbo].[users] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [username] NVARCHAR(100) NOT NULL UNIQUE,
    [email] NVARCHAR(255) NOT NULL UNIQUE,
    [password_hash] NVARCHAR(255) NOT NULL,
    [full_name] NVARCHAR(255),
    [created_at] DATETIME2 DEFAULT GETDATE(),
    [updated_at] DATETIME2 DEFAULT GETDATE()
);
```

## Step 5: Start the Application

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the backend server:
   ```bash
   python -m uvicorn main:app --reload --port 8001
   ```

3. The application will automatically:
   - Connect to the database
   - Create the users table if it doesn't exist
   - Be ready to accept login/register requests

## Troubleshooting

### Connection Error: "Driver not found"
- Install the correct ODBC driver from Microsoft
- Verify the driver name matches exactly in your `.env` file

### Connection Error: "Cannot open database"
- Verify the database name is correct
- Ensure SQL Server is running
- Check that the user has permissions to access the database

### Connection Error: "Login failed"
- For Windows Authentication: Ensure your Windows user has access to SQL Server
- For SQL Authentication: Verify username and password are correct

### Table Creation Error
- Ensure the database user has CREATE TABLE permissions
- Check SQL Server error logs for detailed error messages

## Security Notes

1. **Never commit `.env` file** to version control
2. **Change SECRET_KEY** to a secure random string in production
3. **Use strong passwords** for database accounts
4. **Enable SSL/TLS** for production database connections

