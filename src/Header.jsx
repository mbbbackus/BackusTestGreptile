import React from 'react';

const Header = ({ title, onMenuClick }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <button className="menu-button" onClick={onMenuClick}>
          ☰
        </button>
        <h1 className="header-title">{title}</h1>
        <div className="header-actions">
          <button className="notification-btn">🔔</button>
          <div className="user-profile">
            <img src="/api/user/avatar" alt="Profile" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;