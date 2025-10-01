import React from 'react';
import './StatsCards.css';

interface StatsCardsProps {
  gpa: number;
  attendance: number;
  feesDue: number;
  upcomingEvents: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  gpa,
  attendance,
  feesDue,
  upcomingEvents
}) => {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <h3>Current GPA</h3>
          <p className="stat-value">{gpa}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">📅</div>
        <div className="stat-content">
          <h3>Attendance</h3>
          <p className="stat-value">{attendance}%</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <h3>Fees Due</h3>
          <p className="stat-value">${feesDue}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">🎉</div>
        <div className="stat-content">
          <h3>Upcoming Events</h3>
          <p className="stat-value">{upcomingEvents}</p>
        </div>
      </div>
    </div>
  );
};
