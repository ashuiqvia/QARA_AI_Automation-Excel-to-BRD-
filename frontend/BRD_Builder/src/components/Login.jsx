import React, { useState } from 'react';
import './Login.css';

// API URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { username, password }
        : { username, email, password, full_name: fullName || null };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Store token in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('username', data.username);

      // Call success callback
      onLoginSuccess(data.access_token, data.username);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side with image */}
      <div className="login-left">
        <img 
          src="/login-bg.jpg" 
          alt="Healthcare professional" 
          className="login-background-image"
          onError={(e) => {
            console.error('Failed to load login background image:', e);
            e.target.style.display = 'none';
          }}
          onLoad={() => {
            console.log('Login background image loaded successfully');
          }}
        />
        <div className="login-image-overlay"></div>
      </div>

      {/* Right side with form */}
      <div className="login-right">
        <div className="login-content">
          {/* Logo */}
          <div className="login-logo-container">
            <img 
              alt="IQVIA logo" 
              className="login-logo"
              src="https://bayer-itr.icc.solutions.iqvia.com/IQVIA-ITR-CM-Bayer-API/Content/Img/Apollo/iqvia.png?id=Wed%20Dec%2010%202025%2013:30:39%20GMT+0000"
            />
          </div>

          {/* Title */}
          <h1 className="login-title">
            {isLogin ? 'Log in to IQVIA DocuFlow' : 'Register for IQVIA DocuFlow'}
          </h1>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder=""
              />
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder=""
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name (Optional)</label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder=""
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=""
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Log in' : 'Register')}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="login-toggle">
            <button
              type="button"
              className="toggle-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setPassword('');
              }}
            >
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Log in"}
            </button>
          </div>

          {/* Footer */}
          <div className="login-page-footer">
            
           
          </div>
        </div>
      </div>
    </div>
  );
}

