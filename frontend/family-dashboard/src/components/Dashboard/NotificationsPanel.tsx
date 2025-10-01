import React, { useState } from 'react';
import './NotificationsPanel.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'alert' | 'reminder' | 'info' | 'urgent';
  read: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState(notifications);

  const markAsRead = (id: string) => {
    setActiveNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setActiveNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = activeNotifications.filter(n => !n.read).length;

  return (
    <div className="notifications-panel">
      <button 
        className={`notifications-toggle ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔 Notifications
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="mark-all-read" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>
          
          <div className="notifications-list">
            {activeNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {formatTimeSince(notification.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {activeNotifications.length === 0 && (
              <div className="no-notifications">
                No notifications to display
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'alert': return '⚠️';
    case 'reminder': return '⏰';
    case 'info': return 'ℹ️';
    case 'urgent': return '🚨';
    default: return '🔔';
  }
};

const formatTimeSince = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};
