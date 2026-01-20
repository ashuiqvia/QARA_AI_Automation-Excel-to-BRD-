"""
Test script to diagnose database connection issues.
Run this to check if your database is properly configured.
"""
import sys
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("Database Connection Test")
print("=" * 60)
print()

# Check environment variables
print("1. Checking environment variables...")
DB_SERVER = os.getenv("DB_SERVER", "localhost")
DB_DATABASE = os.getenv("DB_DATABASE", "IQVIA_DocuFlow")
DB_USERNAME = os.getenv("DB_USERNAME", "")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_DRIVER = os.getenv("DB_DRIVER", "ODBC Driver 17 for SQL Server")
SECRET_KEY = os.getenv("SECRET_KEY", "")

print(f"   DB_SERVER: {DB_SERVER}")
print(f"   DB_DATABASE: {DB_DATABASE}")
print(f"   DB_USERNAME: {'***' if DB_USERNAME else '(empty - using Windows Auth)'}")
print(f"   DB_PASSWORD: {'***' if DB_PASSWORD else '(empty - using Windows Auth)'}")
print(f"   DB_DRIVER: {DB_DRIVER}")
print(f"   SECRET_KEY: {'Set' if SECRET_KEY else 'NOT SET (using default)'}")
print()

# Check if pyodbc is installed
print("2. Checking pyodbc installation...")
try:
    import pyodbc
    print("   [OK] pyodbc is installed")
except ImportError:
    print("   ✗ pyodbc is NOT installed")
    print("   Run: pip install pyodbc")
    sys.exit(1)
print()

# Check available ODBC drivers
print("3. Checking available ODBC drivers...")
try:
    drivers = pyodbc.drivers()
    print(f"   Found {len(drivers)} driver(s):")
    for driver in drivers:
        marker = " [OK]" if DB_DRIVER in driver else "     "
        print(f"   {marker} {driver}")
    
    if not any(DB_DRIVER in d for d in drivers):
        print(f"\n   [WARNING] Driver '{DB_DRIVER}' not found!")
        print("   Please install the correct ODBC driver or update DB_DRIVER in .env")
except Exception as e:
        print(f"   [ERROR] Error checking drivers: {e}")
print()

# Test database connection
print("4. Testing database connection...")
try:
    USE_WINDOWS_AUTH = not DB_USERNAME or not DB_PASSWORD
    
    if USE_WINDOWS_AUTH:
        conn_str = (
            f"DRIVER={{{DB_DRIVER}}};"
            f"SERVER={DB_SERVER};"
            f"DATABASE={DB_DATABASE};"
            f"Trusted_Connection=yes;"
        )
        print("   Using Windows Authentication")
    else:
        conn_str = (
            f"DRIVER={{{DB_DRIVER}}};"
            f"SERVER={DB_SERVER};"
            f"DATABASE={DB_DATABASE};"
            f"UID={DB_USERNAME};"
            f"PWD={DB_PASSWORD};"
        )
        print("   Using SQL Server Authentication")
    
    print(f"   Connection string: {conn_str.replace(DB_PASSWORD, '***') if DB_PASSWORD else conn_str}")
    print()
    
    conn = pyodbc.connect(conn_str, timeout=5)
    print("   [OK] Connection successful!")
    
    # Test query
    cursor = conn.cursor()
    cursor.execute("SELECT @@VERSION")
    version = cursor.fetchone()[0]
    print(f"   SQL Server version: {version.split(chr(10))[0]}")
    
    # Check if database exists and has users table
    cursor.execute("""
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'users'
    """)
    table_exists = cursor.fetchone()
    if table_exists:
        print("   [OK] 'users' table exists")
    else:
        print("   [WARNING] 'users' table does NOT exist (will be created on startup)")
    
    cursor.close()
    conn.close()
    
except pyodbc.Error as e:
    print(f"   [ERROR] Connection FAILED!")
    print(f"   Error: {e}")
    print()
    print("   Common issues:")
    print("   1. SQL Server is not running")
    print("   2. Database 'IQVIA_DocuFlow' does not exist")
    print("   3. Wrong server name or connection string")
    print("   4. ODBC driver not installed or wrong driver name")
    print("   5. Windows Authentication failed (check SQL Server permissions)")
    print()
    print("   Solutions:")
    print("   - Make sure SQL Server is running")
    print("   - Create the database using SQL Server Management Studio")
    print("   - Check your .env file configuration")
    print("   - Verify ODBC driver is installed")
    sys.exit(1)
except Exception as e:
    print(f"   [ERROR] Unexpected error: {e}")
    sys.exit(1)

print()
print("=" * 60)
print("[OK] All checks passed! Database is ready.")
print("=" * 60)

