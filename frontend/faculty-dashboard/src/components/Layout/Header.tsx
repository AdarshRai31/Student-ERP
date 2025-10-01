// src/components/Layout/Header.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bell, 
  LogOut, 
  Settings, 
  Menu, 
  User, 
  Moon, 
  Sun, 
  MessageSquare,
  Calendar,
  ChevronDown,
  Check,
  X,
  RefreshCw,
  Edit3,
  Shield,
  HelpCircle
} from 'lucide-react';
import './Header.css';

export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  urgent: boolean;
  category: 'assignment' | 'meeting' | 'system' | 'announcement' | 'grade';
  actionUrl?: string;
}

interface HeaderProps {
  onMenuClick: () => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  userInfo?: {
    name: string;
    role: string;
    email: string;
    avatar?: string;
    department: string;
    employeeId?: string;
    status?: 'online' | 'away' | 'busy' | 'offline';
  };
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick,
  isDarkMode = false,
  onThemeToggle,
  userInfo = {
    name: 'Dr. Jane Smith',
    role: 'Professor',
    email: 'jane.smith@university.edu',
    department: 'Computer Science',
    employeeId: 'EMP001',
    status: 'online'
  },
  onLogout,
  onProfileClick,
  onSettingsClick
}) => {
  // Sample notifications with enhanced data structure
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'info',
      title: 'New Assignment Submission',
      message: 'John Doe submitted CS-301 Assignment #3',
      time: '10 mins ago',
      read: false,
      urgent: false,
      category: 'assignment',
      actionUrl: '/assignments/301/submissions'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Upcoming Meeting',
      message: 'Faculty meeting scheduled for 2:00 PM today',
      time: '1 hour ago',
      read: false,
      urgent: true,
      category: 'meeting',
      actionUrl: '/meetings/upcoming'
    },
    {
      id: 3,
      type: 'success',
      title: 'Timetable Updated',
      message: 'Schedule changes applied for next week',
      time: '3 hours ago',
      read: true,
      urgent: false,
      category: 'system'
    },
    {
      id: 4,
      type: 'error',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight at 11 PM',
      time: '5 hours ago',
      read: false,
      urgent: true,
      category: 'system'
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  // Refs for click outside detection
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Computed values
  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.urgent && !n.read).length;

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    switch (notificationFilter) {
      case 'unread':
        return !notification.read;
      case 'urgent':
        return notification.urgent;
      default:
        return true;
    }
  });

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notification actions
  const markAsRead = useCallback((notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  const refreshNotifications = useCallback(() => {
    // Simulate API call to refresh notifications
    console.log('Refreshing notifications...');
    // In real implementation, this would fetch from your API
  }, []);

  // Notification type styling
  const getNotificationTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getCategoryColor = (category: Notification['category']) => {
    switch (category) {
      case 'assignment': return 'var(--color-primary)';
      case 'meeting': return 'var(--color-warning)';
      case 'system': return 'var(--color-info)';
      case 'announcement': return 'var(--color-success)';
      case 'grade': return 'var(--color-purple)';
      default: return 'var(--color-gray)';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'busy': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle sidebar">
          <Menu size={24} />
        </button>
        
        <div className="header-title">
          <h1>Faculty Dashboard</h1>
          <span className="header-subtitle">{userInfo.department}</span>
        </div>
      </div>
      
      <div className="header-right">
        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="icon-btn" title="Messages" aria-label="Messages">
            <MessageSquare size={20} />
          </button>
          
          <button className="icon-btn" title="Calendar" aria-label="Calendar">
            <Calendar size={20} />
          </button>
        </div>

        {/* Theme Toggle */}
        {onThemeToggle && (
          <button 
            className="icon-btn theme-toggle" 
            onClick={onThemeToggle}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
        
        {/* Notifications */}
        <div className="notification-container" ref={notificationRef}>
          <button 
            className="icon-btn notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className={`notification-badge ${urgentCount > 0 ? 'urgent' : ''}`}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <div className="notification-title">
                  <h3>Notifications</h3>
                  <span className="notification-count">
                    {unreadCount} unread
                    {urgentCount > 0 && (
                      <span className="urgent-indicator"> · {urgentCount} urgent</span>
                    )}
                  </span>
                </div>
                
                <div className="notification-actions">
                  <button 
                    className="action-btn" 
                    onClick={refreshNotifications}
                    title="Refresh notifications"
                  >
                    <RefreshCw size={16} />
                  </button>
                  
                  {unreadCount > 0 && (
                    <button 
                      className="action-btn" 
                      onClick={markAllAsRead}
                      title="Mark all as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Filters */}
              <div className="notification-filters">
                {(['all', 'unread', 'urgent'] as const).map(filter => (
                  <button
                    key={filter}
                    className={`filter-btn ${notificationFilter === filter ? 'active' : ''}`}
                    onClick={() => setNotificationFilter(filter)}
                  >
                    {filter === 'all' && 'All'}
                    {filter === 'unread' && `Unread (${unreadCount})`}
                    {filter === 'urgent' && `Urgent (${urgentCount})`}
                  </button>
                ))}
              </div>
              
              <div className="notification-list">
                {filteredNotifications.length === 0 ? (
                  <div className="no-notifications">
                    <p>No {notificationFilter !== 'all' ? notificationFilter : ''} notifications</p>
                  </div>
                ) : (
                  filteredNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.urgent ? 'urgent' : ''}`}
                    >
                      <div className="notification-indicator">
                        <div 
                          className="category-indicator"
                          style={{ backgroundColor: getCategoryColor(notification.category) }}
                        />
                        <span className="type-icon">
                          {getNotificationTypeIcon(notification.type)}
                        </span>
                      </div>
                      
                      <div className="notification-content">
                        <div className="notification-header-item">
                          <h4 className="notification-title">{notification.title}</h4>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        <p className="notification-message">{notification.message}</p>
                        
                        <div className="notification-actions-item">
                          {notification.actionUrl && (
                            <button className="action-link">View Details</button>
                          )}
                          
                          <div className="notification-controls">
                            {!notification.read && (
                              <button 
                                className="control-btn"
                                onClick={() => markAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            
                            <button 
                              className="control-btn delete"
                              onClick={() => deleteNotification(notification.id)}
                              title="Delete notification"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {notification.urgent && !notification.read && (
                        <div className="urgent-badge">Urgent</div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {filteredNotifications.length > 0 && (
                <div className="notification-footer">
                  <button className="view-all-btn">View All Notifications</button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Enhanced Profile Menu */}
        <div className="profile-container" ref={profileRef}>
          <button 
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="User menu"
          >
            <div className="avatar">
              {userInfo.avatar ? (
                <img src={userInfo.avatar} alt={userInfo.name} />
              ) : (
                <div className="avatar-placeholder">
                  {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
              <div 
                className="status-indicator" 
                style={{ backgroundColor: getStatusColor(userInfo.status || 'offline') }}
                title={`Status: ${userInfo.status}`}
              />
            </div>
            <div className="user-info">
              <span className="user-name">{userInfo.name}</span>
              <span className="user-role">{userInfo.role} • {userInfo.department}</span>
            </div>
            <ChevronDown size={16} className="dropdown-icon" />
          </button>
          
          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="dropdown-avatar">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt={userInfo.name} />
                  ) : (
                    <div className="avatar-placeholder large">
                      {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                  <div 
                    className="status-indicator large" 
                    style={{ backgroundColor: getStatusColor(userInfo.status || 'offline') }}
                  />
                </div>
                <div className="dropdown-user-info">
                  <span className="dropdown-user-name">{userInfo.name}</span>
                  <span className="dropdown-user-role">{userInfo.role}</span>
                  <span className="dropdown-user-email">{userInfo.email}</span>
                  <span className="dropdown-user-id">ID: {userInfo.employeeId}</span>
                </div>
              </div>

              {/* Status Section */}
              <div className="profile-status-section">
                <h4 className="status-title">Status</h4>
                <div className="status-options">
                  {(['online', 'away', 'busy', 'offline'] as const).map(status => (
                    <button 
                      key={status}
                      className={`status-option ${userInfo.status === status ? 'active' : ''}`}
                      onClick={() => console.log(`Status changed to: ${status}`)}
                    >
                      <div 
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(status) }}
                      />
                      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="profile-dropdown-menu">
                <div className="menu-section">
                  <h4 className="section-title">Account</h4>
                  <button 
                    className="dropdown-item"
                    onClick={onProfileClick}
                  >
                    <User size={18} />
                    <div className="item-content">
                      <span className="item-title">My Profile</span>
                      <span className="item-description">View and edit your profile</span>
                    </div>
                  </button>
                  
                  <button 
                    className="dropdown-item"
                    onClick={onSettingsClick}
                  >
                    <Settings size={18} />
                    <div className="item-content">
                      <span className="item-title">Settings</span>
                      <span className="item-description">Account preferences</span>
                    </div>
                  </button>

                  <button className="dropdown-item">
                    <Edit3 size={18} />
                    <div className="item-content">
                      <span className="item-title">Edit Profile</span>
                      <span className="item-description">Update your information</span>
                    </div>
                  </button>
                </div>

                <div className="menu-section">
                  <h4 className="section-title">Communication</h4>
                  <button className="dropdown-item">
                    <MessageSquare size={18} />
                    <div className="item-content">
                      <span className="item-title">Messages</span>
                      <span className="item-description">3 unread messages</span>
                    </div>
                    <span className="item-badge">3</span>
                  </button>
                  
                  <button className="dropdown-item">
                    <Calendar size={18} />
                    <div className="item-content">
                      <span className="item-title">My Schedule</span>
                      <span className="item-description">View your calendar</span>
                    </div>
                  </button>
                </div>

                <div className="menu-section">
                  <h4 className="section-title">Support</h4>
                  <button className="dropdown-item">
                    <HelpCircle size={18} />
                    <div className="item-content">
                      <span className="item-title">Help Center</span>
                      <span className="item-description">Get support and help</span>
                    </div>
                  </button>

                  <button className="dropdown-item">
                    <Shield size={18} />
                    <div className="item-content">
                      <span className="item-title">Privacy & Security</span>
                      <span className="item-description">Manage your privacy settings</span>
                    </div>
                  </button>
                </div>
                
                <div className="menu-divider" />
                
                <button 
                  className="dropdown-item logout"
                  onClick={onLogout}
                >
                  <LogOut size={18} />
                  <div className="item-content">
                    <span className="item-title">Sign Out</span>
                    <span className="item-description">Sign out of your account</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
