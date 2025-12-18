"""
Database connection and user management module for SQL Server.
"""
import pyodbc
import logging
from typing import Optional, Dict
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("brd-utility")

# Database configuration - can be set via environment variables
DB_SERVER = os.getenv("DB_SERVER", "localhost")
DB_DATABASE = os.getenv("DB_DATABASE", "IQVIA_DocuFlow")
DB_USERNAME = os.getenv("DB_USERNAME", "")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_DRIVER = os.getenv("DB_DRIVER", "ODBC Driver 17 for SQL Server")

# Use Windows Authentication if username/password not provided
USE_WINDOWS_AUTH = not DB_USERNAME or not DB_PASSWORD


def get_connection_string() -> str:
    """Generate connection string for SQL Server."""
    if USE_WINDOWS_AUTH:
        # Windows Authentication
        conn_str = (
            f"DRIVER={{{DB_DRIVER}}};"
            f"SERVER={DB_SERVER};"
            f"DATABASE={DB_DATABASE};"
            f"Trusted_Connection=yes;"
        )
    else:
        # SQL Server Authentication
        conn_str = (
            f"DRIVER={{{DB_DRIVER}}};"
            f"SERVER={DB_SERVER};"
            f"DATABASE={DB_DATABASE};"
            f"UID={DB_USERNAME};"
            f"PWD={DB_PASSWORD};"
        )
    return conn_str


def get_db_connection():
    """Get a database connection."""
    try:
        conn_str = get_connection_string()
        conn = pyodbc.connect(conn_str)
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise


def init_database():
    """Initialize database and create users table if it doesn't exist."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create users table
        create_table_sql = """
        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
        BEGIN
            CREATE TABLE [dbo].[users] (
                [id] INT IDENTITY(1,1) PRIMARY KEY,
                [username] NVARCHAR(100) NOT NULL UNIQUE,
                [email] NVARCHAR(255) NOT NULL UNIQUE,
                [password_hash] NVARCHAR(255) NOT NULL,
                [full_name] NVARCHAR(255),
                [created_at] DATETIME2 DEFAULT GETDATE(),
                [updated_at] DATETIME2 DEFAULT GETDATE()
            );
            CREATE INDEX IX_users_username ON [dbo].[users]([username]);
            CREATE INDEX IX_users_email ON [dbo].[users]([email]);
        END
        """
        
        cursor.execute(create_table_sql)
        conn.commit()
        logger.info("Database initialized successfully. Users table created/verified.")
        cursor.close()
        conn.close()
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        raise


def create_user(username: str, email: str, password_hash: str, full_name: Optional[str] = None) -> bool:
    """Create a new user in the database."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        insert_sql = """
        INSERT INTO [dbo].[users] (username, email, password_hash, full_name)
        VALUES (?, ?, ?, ?)
        """
        
        cursor.execute(insert_sql, (username, email, password_hash, full_name))
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"User '{username}' created successfully.")
        return True
    except pyodbc.IntegrityError as e:
        logger.warning(f"User creation failed - duplicate username or email: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise


def get_user_by_username(username: str) -> Optional[Dict]:
    """Get user by username."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        select_sql = """
        SELECT id, username, email, password_hash, full_name, created_at, updated_at
        FROM [dbo].[users]
        WHERE username = ?
        """
        
        cursor.execute(select_sql, (username,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if row:
            return {
                "id": row[0],
                "username": row[1],
                "email": row[2],
                "password_hash": row[3],
                "full_name": row[4],
                "created_at": row[5],
                "updated_at": row[6]
            }
        return None
    except Exception as e:
        logger.error(f"Error getting user: {str(e)}")
        raise


def get_user_by_email(email: str) -> Optional[Dict]:
    """Get user by email."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        select_sql = """
        SELECT id, username, email, password_hash, full_name, created_at, updated_at
        FROM [dbo].[users]
        WHERE email = ?
        """
        
        cursor.execute(select_sql, (email,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if row:
            return {
                "id": row[0],
                "username": row[1],
                "email": row[2],
                "password_hash": row[3],
                "full_name": row[4],
                "created_at": row[5],
                "updated_at": row[6]
            }
        return None
    except Exception as e:
        logger.error(f"Error getting user by email: {str(e)}")
        raise

