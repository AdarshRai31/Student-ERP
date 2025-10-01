import React, { useState } from 'react';
import './TopNavbar.css';

interface TopNavbarProps {
  toggleSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="top-navbar">
      <div className="nav-left">
        <button className="menu-btn" onClick={toggleSidebar}>☰</button>
        <h1>Family Dashboard</h1>
      </div>
      
      <div className="nav-right">
        <button className="notification-btn">🔔 <span className="notification-count">3</span></button>
        
        <div className="profile-menu">
          <button 
            className="profile-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <span className="user-avatar">👤</span>
            <span className="user-name">John Doe</span>
          </button>
          
          {isProfileOpen && (
            <div className="profile-dropdown">
              <a href="#profile" className="dropdown-item">Profile</a>
              <a href="#settings" className="dropdown-item">Settings</a>
              <div className="dropdown-divider"></div>
              <a href="#logout" className="dropdown-item">Logout</a>
            </div>
          )}
        </div>
        
        <button className="theme-toggle">🌙</button>
      </div>
    </header>
  );
};
