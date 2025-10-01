// src/components/Dashboard/DashboardHome.tsx
import React from 'react';
import { BarChart3, Users, BookOpen, Calendar, ClipboardList, TrendingUp, TrendingDown } from 'lucide-react';
import './DashboardHome.css';

const DashboardHome: React.FC = () => {
  // Sample data for the dashboard
  const stats = [
    { label: 'Total Students', value: 142, icon: Users, change: +5, trend: 'up' },
    { label: 'Active Courses', value: 5, icon: BookOpen, change: 0, trend: 'neutral' },
    { label: 'Classes This Week', value: 12, icon: Calendar, change: -2, trend: 'down' },
    { label: 'Pending Grading', value: 23, icon: ClipboardList, change: +8, trend: 'up' },
  ];

  const recentActivities = [
    { action: 'Graded assignments', course: 'Data Structures', time: '2 hours ago' },
    { action: 'Uploaded lecture notes', course: 'Algorithms', time: '5 hours ago' },
    { action: 'Marked attendance', course: 'Database Systems', time: 'Yesterday' },
    { action: 'Created new assignment', course: 'Data Structures', time: '2 days ago' },
  ];

  const upcomingEvents = [
    { title: 'Faculty Meeting', date: 'Tomorrow, 10:00 AM', location: 'Conference Room A' },
    { title: 'Midterm Exams', date: 'Next Week', location: 'All Classes' },
    { title: 'Department Review', date: 'Nov 15, 2:00 PM', location: 'Dean\'s Office' },
  ];

  return (
    <div className="dashboard-home">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back, Dr. Jane Smith. Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
              <div className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : 
                 stat.trend === 'down' ? <TrendingDown size={16} /> : null}
                <span>{stat.change !== 0 ? `${Math.abs(stat.change)}%` : 'No change'}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-column">
          <div className="dashboard-card">
            <h3>Recent Activities</h3>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-course">{activity.course}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn">View All Activities</button>
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-card">
            <h3>Upcoming Events</h3>
            <div className="events-list">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-date">
                    <span className="event-day">15</span>
                    <span className="event-month">NOV</span>
                  </div>
                  <div className="event-details">
                    <h4>{event.title}</h4>
                    <p>{event.date}</p>
                    <span className="event-location">{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn">View Calendar</button>
          </div>
        </div>
      </div>

      <div className="performance-card">
        <div className="performance-header">
          <h3>Class Performance Overview</h3>
          <select defaultValue="last_week">
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
            <option value="last_quarter">Last Quarter</option>
          </select>
        </div>
        <div className="performance-chart">
          <div className="chart-placeholder">
            <BarChart3 size={40} />
            <p>Performance chart would be displayed here</p>
          </div>
        </div>
        <div className="performance-stats">
          <div className="performance-stat">
            <span className="stat-value">85%</span>
            <span className="stat-label">Average Attendance</span>
          </div>
          <div className="performance-stat">
            <span className="stat-value">78%</span>
            <span className="stat-label">Average Grade</span>
          </div>
          <div className="performance-stat">
            <span className="stat-value">92%</span>
            <span className="stat-label">Submission Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
