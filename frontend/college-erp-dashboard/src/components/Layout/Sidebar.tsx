import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiHome, FiUsers, FiBook, FiDollarSign, 
  FiCalendar, FiBookOpen, FiBell, FiSettings,
  FiBarChart, FiHelpCircle, FiMessageSquare, FiX,
  FiClipboard, FiPieChart, FiChevronLeft
} from 'react-icons/fi';
import * as FiIcons from 'react-icons/fi';
import './Sidebar.css';  

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const menuItems = [
  { icon: FiIcons.FiHome, label: 'Dashboard', path: '/' },
  { icon: FiHome, label: 'Dashboard', path: '/' },
  { icon: FiUsers, label: 'Students', path: '/students' },
  { icon: FiUsers, label: 'Faculty', path: '/faculty' },
  { icon: FiBook, label: 'Courses', path: '/courses' },
  { icon: FiCalendar, label: 'Academic Calendar', path: '/academic-calendar' },
  { icon: FiDollarSign, label: 'Finance', path: '/finance' },
  { icon: FiClipboard, label: 'Attendance', path: '/attendance' },
  { icon: FiBookOpen, label: 'Library', path: '/library' },
  { icon: FiBell, label: 'Notices', path: '/notices' },
  { icon: FiBarChart, label: 'Analytics', path: '/analytics' },
  { icon: FiPieChart, label: 'Reports', path: '/reports' },
  { icon: FiHelpCircle, label: 'Support', path: '/support' },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobile, 
  setIsMobileOpen 
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <motion.div
        className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}
        animate={{ 
          width: isCollapsed ? 70 : 250,
          x: isMobile ? 0 : 0
        }}
        initial={false}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          {!isCollapsed && <h1 className="sidebar-title">College ERP</h1>}
          <div className="flex items-center">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="sidebar-toggle hidden lg:block"
            >
              <FiChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="sidebar-toggle lg:hidden"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className="sidebar-item"
              onClick={() => isMobile && setIsMobileOpen(false)}
            >
              <item.icon className="sidebar-icon" />
              {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
            </a>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;