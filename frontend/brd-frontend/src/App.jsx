import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' or 'excel-to-brd'
  const [excel, setExcel] = useState(null);
  const [template, setTemplate] = useState(null);
  const [filterMode, setFilterMode] = useState('none'); // 'none' | 'final' | 'final_or_approved'
  const [sheetName, setSheetName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend connection on mount
  React.useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8001/health');
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

    setIsGenerating(true);
    try {
      const fd = new FormData();
      fd.append('excel', excel);
      if (template) fd.append('template', template);
      if (sheetName) fd.append('sheet_name', sheetName);
      fd.append('filter_mode', filterMode);

      const res = await fetch('http://localhost:8001/generate', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        const errorMsg = msg.error || msg.message || res.statusText || 'Unknown error occurred';
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
              <div className="header-title-main">QARA Team</div>
              <div className="header-title-sub">IQVIA - AI‑Powered Automation Solutions</div>
            </div>
          </div>
          <div className="header-metrics">
            <div className="metric">
              <div className={`metric-value ${backendStatus === 'connected' ? 'status-connected' : backendStatus === 'error' ? 'status-error' : 'status-checking'}`}>
                {backendStatus === 'connected' ? '✓' : backendStatus === 'error' ? '✗' : '...'}
              </div>
              <div className="metric-label metric-label-blue">
                {backendStatus === 'connected' ? 'Backend Connected' : backendStatus === 'error' ? 'Backend Offline' : 'Checking...'}
              </div>
            </div>
            <div className="metric">
              <div className="metric-value metric-value-green">100%</div>
              <div className="metric-label metric-label-green">Success Rate</div>
            </div>
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>QARA</h2>
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
                  <h2 className="welcome-title">Welcome to QARA — Powered by AI Automation</h2>
                  <p className="welcome-subtitle">
                    Automate your workflows with powerful AI-driven tools designed specifically for QARA Team.
                  </p>
                </div>
                <p className="copyright-text">
                  ©2025 QARA - QA Rapid Automation. Built with React.
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

              <div className="form-group">
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
              </div>

              <div className="form-group">
                <label className="form-label">
                  Sheet Name (Optional)
                </label>
                <input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="e.g., Chugai Requirements"
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
              </div>

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
