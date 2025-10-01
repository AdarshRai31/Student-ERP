import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './UserSettings.css';

export const UserSettings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <div className="user-settings">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="setting-item">
          <span>Dark Mode</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isDark} 
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Notifications</h3>
        <div className="setting-item">
          <span>Email Notifications</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications.email} 
              onChange={() => handleNotificationChange('email')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <span>SMS Notifications</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications.sms} 
              onChange={() => handleNotificationChange('sms')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <span>Push Notifications</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications.push} 
              onChange={() => handleNotificationChange('push')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Account Settings</h3>
        <div className="setting-item">
          <span>Change Password</span>
          <button className="change-btn">Change</button>
        </div>
        
        <div className="setting-item">
          <span>Update Profile</span>
          <button className="update-btn">Update</button>
        </div>
        
        <div className="setting-item">
          <span>Language Preference</span>
          <select className="language-select">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="save-btn">Save Changes</button>
        <button className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};
