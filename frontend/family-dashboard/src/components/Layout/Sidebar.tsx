import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  'Dashboard', 'Academics', 'Attendance', 'Communication',
  'Fees', 'Transport', 'Health', 'Reports', 'Settings'
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [activeSection, setActiveSection] = React.useState<string>('dashboard');

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => document.getElementById(item.toLowerCase()));
      const scrollPosition = window.scrollY + 100; // offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {
    e.preventDefault();
    const section = document.getElementById(item.toLowerCase());
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(item.toLowerCase());
      toggleSidebar(); // optionally close sidebar on click
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Family Dashboard</h2>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className={`sidebar-link${activeSection === item.toLowerCase() ? ' active' : ''}`}
                onClick={(e) => handleClick(e, item)}
              >
                {getMenuItemIcon(item)} {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const getMenuItemIcon = (item: string): string => {
  switch (item) {
    case 'Dashboard': return '📊';
    case 'Academics': return '📚';
    case 'Attendance': return '📅';
    case 'Communication': return '📱';
    case 'Fees': return '💰';
    case 'Transport': return '🚌';
    case 'Health': return '🏥';
    case 'Reports': return '📈';
    case 'Settings': return '⚙️';
    default: return '🔗';
  }
};
