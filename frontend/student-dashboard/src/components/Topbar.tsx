import React from "react";
import { clearAuth } from "../utils/auth";

interface TopbarProps {
  title: string;
}

const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const onLogout = () => {
    clearAuth();
    window.location.reload();
  };
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 id="pageTitle">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
        <button className="notification-btn">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </button>
        <div className="profile-dropdown">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            alt="Profile"
            className="profile-avatar"
          />
          <span className="profile-name">Arjun Sharma</span>
          <i className="fas fa-chevron-down"></i>
        </div>
        <button className="btn btn--outline btn--sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
