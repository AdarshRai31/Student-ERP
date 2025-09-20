import React from "react";

interface SidebarProps {
  onNavigate: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const navItems = [
    { section: "dashboard", label: "Dashboard", icon: "fas fa-th-large" },
    { section: "profile", label: "Profile", icon: "fas fa-user" },
    { section: "attendance", label: "Attendance", icon: "fas fa-calendar-check" },
    { section: "exams", label: "Exams", icon: "fas fa-file-alt" },
    { section: "assignments", label: "Assignments", icon: "fas fa-book-open" },
    { section: "fees", label: "Fees", icon: "fas fa-credit-card" },
    { section: "library", label: "Library", icon: "fas fa-book" },
    { section: "notices", label: "Notices", icon: "fas fa-bell" },
    { section: "communication", label: "Messages", icon: "fas fa-comment-dots" },
    { section: "settings", label: "Settings", icon: "fas fa-cog" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-graduation-cap"></i>
          <span>College ERP</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a
            key={item.section}
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.section);
            }}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
