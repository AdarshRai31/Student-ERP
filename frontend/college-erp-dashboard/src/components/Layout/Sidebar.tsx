import React from 'react';
import { 
  FiHome, FiUsers, FiBook, FiDollarSign, 
  FiCalendar, FiBookOpen, FiBell,
  FiBarChart, FiHelpCircle,
  FiClipboard, FiPieChart
} from 'react-icons/fi';
import './Sidebar.css';  

interface SidebarProps {
  // Static sidebar: props retained for compatibility but not used
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  isMobile?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

type MenuItem = { icon: React.ElementType; label: string; path: string };

const menuItems: MenuItem[] = [
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

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <>
      <div className={`sidebar expanded`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">College ERP</h1>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className="sidebar-item"
            >
              <item.icon className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;