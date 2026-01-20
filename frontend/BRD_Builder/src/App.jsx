import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import './App.css';
import Login from './components/Login';
import UserMenu from './components/UserMenu';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [activePage, setActivePage] = useState('home'); // 'home' or 'excel-to-brd'
  const [excel, setExcel] = useState(null);
  const [template, setTemplate] = useState(null);
  const [filterMode, setFilterMode] = useState('none'); // 'none' | 'final' | 'final_or_approved'
  const [sheetName, setSheetName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');
    
    if (token && storedUsername) {
      // Verify token is still valid
      verifyToken(token).then((isValid) => {
        if (isValid) {
          setIsAuthenticated(true);
          setUsername(storedUsername);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('username');
        }
      });
    }
  }, []);

  // API URL from environment variable or default to localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleLoginSuccess = (token, user) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  // Check backend connection on mount
  React.useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        setBackendStatus('error');
      }
    };
    checkBackend();
  }, []);

  const handleGenerate = async () => {
    if (!excel) {
      alert('Please select the Excel file.');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You must be logged in to generate documents.');
      setIsAuthenticated(false);
      return;
    }

    setIsGenerating(true);
    try {
      const fd = new FormData();
      fd.append('excel', excel);
      if (template) fd.append('template', template);
      if (sheetName) fd.append('sheet_name', sheetName);
      fd.append('filter_mode', filterMode);

      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        const errorMsg = msg.error || msg.message || msg.detail || res.statusText || 'Unknown error occurred';
        
        // If unauthorized, logout user
        if (res.status === 401) {
          handleLogout();
          alert('Your session has expired. Please login again.');
          return;
        }
        
        alert(`Error: ${errorMsg}\n\nStatus: ${res.status}\nPlease ensure the backend server is running on http://localhost:8001`);
        return;
      }

      const blob = await res.blob();
      saveAs(blob, 'Business Requirements Document - updated.docx');
    } catch (error) {
      let errorMessage = 'Failed to connect to the backend server.';
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Failed to connect to the backend server.\n\nPlease ensure:\n1. Backend is running on http://localhost:8001\n2. Check browser console for CORS errors\n3. Verify network connectivity';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-left">
            <img 
              alt="IQVIA logo" 
              className="header-logo-img"
              src="https://bayer-itr.icc.solutions.iqvia.com/IQVIA-ITR-CM-Bayer-API/Content/Img/Apollo/iqvia.png?id=Wed%20Dec%2010%202025%2013:30:39%20GMT+0000"
            />
            <div className="header-title">
              <div className="header-title-main">IQVIA Docuflow</div>
              <div className="header-title-sub">IQVIA - AI‑Powered Automation Solutions</div>
            </div>
          </div>
          <div className="header-metrics">
            <UserMenu username={username} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>IQVIA DocuFlow</h2>
            <p>Powered by AI Automation</p>
          </div>
          <hr className="sidebar-divider" />
          <nav className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-label">Navigation</div>
              <div 
                className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => setActivePage('home')}
              >
                <span className="nav-icon">🏠</span>
                <span>Home</span>
              </div>
              <div 
                className={`nav-item ${activePage === 'excel-to-brd' ? 'active' : ''}`}
                onClick={() => setActivePage('excel-to-brd')}
              >
                <span className="nav-icon">📄</span>
                <span>Excel to BRD</span>
              </div>
            </div>
          </nav>
          <div className="sidebar-footer">
            <div>Version: 1.0.0</div>
            <div>Build: 2025-12-16</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-card">
            {activePage === 'home' ? (
              <div className="home-container">
                <div className="welcome-banner">
                  <h2 className="welcome-title">Welcome to IQVIA Docuflow — Powered by AI Automation</h2>
                  <p className="welcome-subtitle">
                    Automate your workflows with powerful AI-driven tools
                  </p>
                </div>
                <p className="copyright-text">
                  ©2025 IQVIA Docuflow - AI Automation
                </p>
              </div>
            ) : (
              <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  Excel File (.xlsx) *
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setExcel(e.target.files?.[0] ?? null)}
                  className="form-input-file"
                />
                {excel && (
                  <div className="file-info">
                    ✓ Selected: {excel.name}
                  </div>
                )}
              </div>

              {/* <div className="form-group">
                <label className="form-label">
                  Optional Word Template (.docx)
                </label>
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => setTemplate(e.target.files?.[0] ?? null)}
                  className="form-input-file"
                />
                {template && (
                  <div className="file-info">
                    ✓ Selected: {template.name}
                  </div>
                )}
                <div className="form-hint">
                  If omitted, server uses <code>templates/template.docx</code>.
                </div>
              </div> */}

              {/* <div className="form-group">
                <label className="form-label">
                  Sheet Name (Optional)
                </label>
                <input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="e.g., Sheet1"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Filter Mode
                </label>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="form-select"
                >
                  <option value="none">Include all rows</option>
                  <option value="final">Only Status = Final</option>
                  <option value="final_or_approved">Status = Final or Approved</option>
                </select>
              </div> */}

              <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={isGenerating || !excel}
              >
                {isGenerating ? 'Generating...' : 'Generate BRD (.docx)'}
              </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
