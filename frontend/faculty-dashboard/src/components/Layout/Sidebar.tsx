import React, { FC, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  BookOpen,
  Calendar,
  ClipboardList,
  BarChart3,
  MessageSquare,
  FileText,
  Upload,
  Download,
  Mail,
  HelpCircle,
  Book,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Home,
} from "lucide-react";
import "./Sidebar.css";

type ExpandableKey =
  | "classes"
  | "attendance"
  | "assignments"
  | "performance"
  | "communication";

type ExpandedState = Record<ExpandableKey, boolean>;

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobile: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

const INITIAL_EXPANDED: ExpandedState = {
  classes: false,
  attendance: false,
  assignments: false,
  performance: false,
  communication: false,
};

const Sidebar: FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobile,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<ExpandedState>(INITIAL_EXPANDED);

  // Automatically expand sections when their child is active
  useEffect(() => {
    const path = location.pathname;
    const newExpanded = { ...INITIAL_EXPANDED };
    
    if (path.startsWith("/classes") || path.startsWith("/timetable") || path.startsWith("/materials")) {
      newExpanded.classes = true;
    }
    if (path.startsWith("/attendance")) {
      newExpanded.attendance = true;
    }
    if (path.startsWith("/assignments") || path.startsWith("/grading")) {
      newExpanded.assignments = true;
    }
    if (path.startsWith("/performance") || path.startsWith("/reports")) {
      newExpanded.performance = true;
    }
    if (path.startsWith("/announcements") || path.startsWith("/messaging") || path.startsWith("/helpdesk")) {
      newExpanded.communication = true;
    }
    
    setExpanded(newExpanded);
  }, [location.pathname]);

  // If user collapses the sidebar, fold all expanded sections
  useEffect(() => {
    if (isCollapsed) setExpanded(INITIAL_EXPANDED);
  }, [isCollapsed]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) setIsMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleSection = (key: ExpandableKey) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path: string, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  // Menu definitions
  const menuItems = useMemo(
    () => [
      { path: "/", icon: Home, label: "Dashboard", exact: true },
      { path: "/profile", icon: User, label: "Profile" },
    ],
    []
  );

  const classManagementItems = useMemo(
    () => [
      { path: "/classes", icon: BookOpen, label: "Class Overview" },
      { path: "/timetable", icon: Calendar, label: "Timetable" },
      { path: "/materials", icon: Upload, label: "Study Materials" },
    ],
    []
  );

  const attendanceItems = useMemo(
    () => [
      { path: "/attendance", icon: ClipboardList, label: "Mark Attendance" },
      {
        path: "/attendance-reports",
        icon: Download,
        label: "Attendance Reports",
      },
    ],
    []
  );

  const assignmentItems = useMemo(
    () => [
      { path: "/assignments", icon: FileText, label: "Manage Assignments" },
      { path: "/grading", icon: Download, label: "Grade Submissions" },
    ],
    []
  );

  const performanceItems = useMemo(
    () => [
      { path: "/performance", icon: BarChart3, label: "Student Performance" },
      { path: "/reports", icon: Download, label: "Generate Reports" },
    ],
    []
  );

  const communicationItems = useMemo(
    () => [
      { path: "/announcements", icon: MessageSquare, label: "Announcements" },
      { path: "/messaging", icon: Mail, label: "Messaging" },
      { path: "/helpdesk", icon: HelpCircle, label: "Helpdesk" },
    ],
    []
  );

  const researchItem = { path: "/research", icon: Book, label: "Research" };

  const handleNavClick = () => {
    if (isMobile) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`sidebar-backdrop ${isMobile && isMobileOpen ? "visible" : ""}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden={!(isMobile && isMobileOpen)}
      />

      <aside
        className={[
          "sidebar",
          isCollapsed ? "collapsed" : "expanded",
          isMobile ? "mobile" : "desktop",
          isMobile && isMobileOpen ? "open" : "",
        ].join(" ")}
        aria-hidden={isMobile && !isMobileOpen}
      >
        <div className="sidebar-header">
          <div className="sidebar-title-wrap">
            <h1 className="sidebar-title">Faculty Portal</h1>
            {!isCollapsed && <div className="sidebar-subtitle">Dr. Jane Smith</div>}
          </div>

          <div className="sidebar-controls">
            {/* Desktop collapse toggle */}
            {!isMobile && (
              <button
                className="collapse-btn"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            )}

            {/* Mobile close button */}
            {isMobile && isMobileOpen && (
              <button
                className="close-btn"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close sidebar"
                title="Close"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
          {/* top static items */}
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path, !!item.exact);
            return (
              <Link
                key={idx}
                to={item.path}
                className={`sidebar-item ${active ? "active" : ""}`}
                onClick={handleNavClick}
                title={item.label}
              >
                <Icon size={18} />
                <span className="sidebar-item-label">{item.label}</span>
              </Link>
            );
          })}

          {/* Expandable sections */}
          <div className={`sidebar-section ${expanded.classes ? "expanded" : ""}`}>
            <button
              type="button"
              className={`sidebar-section-header ${
                classManagementItems.some((it) => isActive(it.path)) ? "active" : ""
              }`}
              onClick={() => toggleSection("classes")}
              aria-expanded={expanded.classes}
              title="Class Management"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleSection("classes");
                }
              }}
            >
              <div className="sidebar-section-header-content">
                <BookOpen size={18} />
                <span className="sidebar-item-label">Class Management</span>
              </div>
              {!isCollapsed && (expanded.classes ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>

            <div className={`sidebar-subitems ${expanded.classes && !isCollapsed ? "expanded" : ""}`}>
              {classManagementItems.map((it, i) => {
                const SubIcon = it.icon;
                const active = isActive(it.path);
                return (
                  <Link
                    key={i}
                    to={it.path}
                    className={`sidebar-subitem ${active ? "active" : ""}`}
                    onClick={handleNavClick}
                    title={it.label}
                  >
                    <SubIcon size={14} />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Other expandable sections follow the same pattern */}
          {/* ... (Attendance, Assignments, Performance, Communication sections) */}
          
          <div className={`sidebar-section ${expanded.attendance ? "expanded" : ""}`}>
            <button
              type="button"
              className={`sidebar-section-header ${
                attendanceItems.some((it) => isActive(it.path)) ? "active" : ""
              }`}
              onClick={() => toggleSection("attendance")}
              aria-expanded={expanded.attendance}
              title="Attendance"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleSection("attendance");
                }
              }}
            >
              <div className="sidebar-section-header-content">
                <ClipboardList size={18} />
                <span className="sidebar-item-label">Attendance</span>
              </div>
              {!isCollapsed && (expanded.attendance ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>

            <div className={`sidebar-subitems ${expanded.attendance && !isCollapsed ? "expanded" : ""}`}>
              {attendanceItems.map((it, i) => {
                const SubIcon = it.icon;
                const active = isActive(it.path);
                return (
                  <Link
                    key={i}
                    to={it.path}
                    className={`sidebar-subitem ${active ? "active" : ""}`}
                    onClick={handleNavClick}
                    title={it.label}
                  >
                    <SubIcon size={14} />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={`sidebar-section ${expanded.assignments ? "expanded" : ""}`}>
            <button
              type="button"
              className={`sidebar-section-header ${
                assignmentItems.some((it) => isActive(it.path)) ? "active" : ""
              }`}
              onClick={() => toggleSection("assignments")}
              aria-expanded={expanded.assignments}
              title="Assignments"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleSection("assignments");
                }
              }}
            >
              <div className="sidebar-section-header-content">
                <FileText size={18} />
                <span className="sidebar-item-label">Assignments</span>
              </div>
              {!isCollapsed && (expanded.assignments ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>

            <div className={`sidebar-subitems ${expanded.assignments && !isCollapsed ? "expanded" : ""}`}>
              {assignmentItems.map((it, i) => {
                const SubIcon = it.icon;
                const active = isActive(it.path);
                return (
                  <Link
                    key={i}
                    to={it.path}
                    className={`sidebar-subitem ${active ? "active" : ""}`}
                    onClick={handleNavClick}
                    title={it.label}
                  >
                    <SubIcon size={14} />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={`sidebar-section ${expanded.performance ? "expanded" : ""}`}>
            <button
              type="button"
              className={`sidebar-section-header ${
                performanceItems.some((it) => isActive(it.path)) ? "active" : ""
              }`}
              onClick={() => toggleSection("performance")}
              aria-expanded={expanded.performance}
              title="Performance"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleSection("performance");
                }
              }}
            >
              <div className="sidebar-section-header-content">
                <BarChart3 size={18} />
                <span className="sidebar-item-label">Performance</span>
              </div>
              {!isCollapsed && (expanded.performance ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>

            <div className={`sidebar-subitems ${expanded.performance && !isCollapsed ? "expanded" : ""}`}>
              {performanceItems.map((it, i) => {
                const SubIcon = it.icon;
                const active = isActive(it.path);
                return (
                  <Link
                    key={i}
                    to={it.path}
                    className={`sidebar-subitem ${active ? "active" : ""}`}
                    onClick={handleNavClick}
                    title={it.label}
                  >
                    <SubIcon size={14} />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={`sidebar-section ${expanded.communication ? "expanded" : ""}`}>
            <button
              type="button"
              className={`sidebar-section-header ${
                communicationItems.some((it) => isActive(it.path)) ? "active" : ""
              }`}
              onClick={() => toggleSection("communication")}
              aria-expanded={expanded.communication}
              title="Communication"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleSection("communication");
                }
              }}
            >
              <div className="sidebar-section-header-content">
                <MessageSquare size={18} />
                <span className="sidebar-item-label">Communication</span>
              </div>
              {!isCollapsed && (expanded.communication ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>

            <div className={`sidebar-subitems ${expanded.communication && !isCollapsed ? "expanded" : ""}`}>
              {communicationItems.map((it, i) => {
                const SubIcon = it.icon;
                const active = isActive(it.path);
                return (
                  <Link
                    key={i}
                    to={it.path}
                    className={`sidebar-subitem ${active ? "active" : ""}`}
                    onClick={handleNavClick}
                    title={it.label}
                  >
                    <SubIcon size={14} />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Single link */}
          <Link
            to={researchItem.path}
            className={`sidebar-item ${isActive(researchItem.path) ? "active" : ""}`}
            onClick={handleNavClick}
            title={researchItem.label}
          >
            <Book size={18} />
            <span className="sidebar-item-label">{researchItem.label}</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div>Faculty Dashboard v1.0</div>
          <div className="muted">© 2023 University</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
