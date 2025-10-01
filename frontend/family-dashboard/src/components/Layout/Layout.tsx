import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="content">
          {children}
        </div>
      </div>
      {isSidebarOpen && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};
