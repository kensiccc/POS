export default function Header({ darkMode, onToggleDark, onOpenAdmin, onOpenDashboard, onLogout, currentUser }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="/house-blend-logo.png" alt="Sample POS" className="logo-img" />
        <div>
          <h1>☕ Sample POS</h1>
          <p>by Dev Kensic</p>
        </div>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span>{currentUser?.name || 'Guest'}</span>
          <small>{currentUser?.role === 'admin' ? 'Manager' : 'Cashier'}</small>
        </div>
        <button className="admin-btn" onClick={onOpenDashboard} title="Sales Dashboard">📊 Dashboard</button>
        {currentUser?.role === 'admin' && (
          <button className="admin-btn" onClick={onOpenAdmin}>⚙️ Manage</button>
        )}
        <button className="admin-btn" onClick={onLogout}>🚪 Logout</button>
        <div className={`toggle ${darkMode ? 'on' : ''}`} onClick={onToggleDark}>
          <div className="toggle-knob"></div>
          <span className="toggle-icon">☀️</span>
        </div>
      </div>
    </header>
  )
}


