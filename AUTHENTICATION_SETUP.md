# Authentication System Setup

## Overview

A complete authentication system has been implemented for IQVIA DocuFlow with the following features:

- **Login Page**: Beautiful, modern login interface
- **User Registration**: New users can create accounts
- **Password Hashing**: Passwords are securely hashed using bcrypt
- **JWT Tokens**: Secure session management with JSON Web Tokens
- **SQL Server Integration**: User data stored in SQL Server database
- **Protected Routes**: Main application requires authentication
- **Auto-redirect**: Successful login redirects to IQVIA DocuFlow main page

## Files Created/Modified

### Backend Files

1. **`backend/database.py`** - Database connection and user management
   - SQL Server connection using pyodbc
   - User table creation and management
   - Supports Windows Authentication and SQL Server Authentication

2. **`backend/auth.py`** - Authentication utilities
   - Password hashing with bcrypt
   - JWT token creation and validation
   - User authentication dependency for FastAPI routes

3. **`backend/main.py`** - Updated with authentication endpoints
   - `/api/auth/register` - User registration
   - `/api/auth/login` - User login
   - `/api/auth/me` - Get current user info
   - `/generate` - Now requires authentication

4. **`backend/requirements.txt`** - Updated dependencies
   - `pyodbc` - SQL Server connection
   - `bcrypt` - Password hashing
   - `python-jose` - JWT token handling
   - `passlib` - Password hashing utilities
   - `python-dotenv` - Environment variable management

5. **`backend/DATABASE_SETUP.md`** - Database setup guide

### Frontend Files

1. **`frontend/BRD_Builder/src/components/Login.jsx`** - Login component
   - Login and registration forms
   - Error handling
   - Token management

2. **`frontend/BRD_Builder/src/components/Login.css`** - Login page styling
   - Modern, responsive design
   - Gradient background
   - Smooth animations

3. **`frontend/BRD_Builder/src/App.jsx`** - Updated main app
   - Authentication state management
   - Route protection
   - Token verification
   - Logout functionality
   - Auto-redirect after login

## Setup Instructions

### 1. Database Setup

Follow the instructions in `backend/DATABASE_SETUP.md` to:
- Create the SQL Server database
- Configure connection settings
- Set up environment variables

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
DB_SERVER=localhost
DB_DATABASE=IQVIA_DocuFlow
DB_USERNAME=
DB_PASSWORD=
DB_DRIVER=ODBC Driver 17 for SQL Server
SECRET_KEY=your-secret-key-change-this-in-production
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend/BRD_Builder
npm install
```

### 4. Start the Application

**Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8001
```

**Frontend:**
```bash
cd frontend/BRD_Builder
npm run dev
```

## How It Works

1. **User Registration/Login**:
   - User visits the application
   - Sees the login page (if not authenticated)
   - Can register a new account or login
   - Password is hashed using bcrypt before storage

2. **Authentication Flow**:
   - Upon successful login, a JWT token is generated
   - Token is stored in browser's localStorage
   - Token is included in all API requests via Authorization header

3. **Protected Routes**:
   - Main application checks for valid token on load
   - If token is invalid or missing, user is redirected to login
   - All protected API endpoints verify the token

4. **Session Management**:
   - Tokens expire after 30 days
   - User can logout to clear the token
   - Token is automatically verified on each request

## Database Schema

The `users` table structure:

```sql
- id (INT, Primary Key, Auto-increment)
- username (NVARCHAR(100), Unique, Not Null)
- email (NVARCHAR(255), Unique, Not Null)
- password_hash (NVARCHAR(255), Not Null)
- full_name (NVARCHAR(255), Nullable)
- created_at (DATETIME2, Default: GETDATE())
- updated_at (DATETIME2, Default: GETDATE())
```

## Security Features

- ✅ Passwords are hashed using bcrypt (industry standard)
- ✅ JWT tokens for secure session management
- ✅ Token expiration (30 days)
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configuration for frontend
- ✅ Environment variables for sensitive data

## Testing

1. Start both backend and frontend servers
2. Navigate to the frontend URL (usually http://localhost:5173)
3. You should see the login page
4. Click "Register" to create a new account
5. After registration, you'll be automatically logged in and redirected to the main page
6. You can logout and login again with your credentials

## Troubleshooting

### Database Connection Issues
- Verify SQL Server is running
- Check `.env` file configuration
- Ensure ODBC driver is installed
- See `DATABASE_SETUP.md` for detailed troubleshooting

### Authentication Issues
- Check browser console for errors
- Verify backend is running on port 8001
- Check that token is being stored in localStorage
- Verify CORS settings allow your frontend origin

### Password Issues
- Ensure passwords meet any requirements (currently no minimum requirements)
- Check that password hashing is working (check database for hashed values)

## Next Steps

- Consider adding password strength requirements
- Add password reset functionality
- Implement role-based access control (RBAC)
- Add user profile management
- Add session timeout warnings
- Implement refresh tokens for better security

