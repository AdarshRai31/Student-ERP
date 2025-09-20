import React from "react";
import { Stats } from "../types";

interface Props {
  stats: Stats;
}

const StatsSection: React.FC<Props> = ({ stats }) => {
  return (
    <section className="stats-section">
      <div className="stats-grid">
        <div className="card stat-card attendance-stat">
          <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
          <div className="stat-info">
            <h3>{stats.attendance}%</h3>
            <p>Attendance</p>
          </div>
        </div>

        <div className="card stat-card cgpa-stat">
          <div className="stat-icon"><i className="fas fa-trophy"></i></div>
          <div className="stat-info">
            <h3>{stats.cgpa}</h3>
            <p>CGPA</p>
          </div>
        </div>

        <div className="card stat-card exam-stat">
          <div className="stat-icon"><i className="fas fa-file-alt"></i></div>
          <div className="stat-info">
            <h3>{stats.upcomingExams}</h3>
            <p>Upcoming Exams</p>
          </div>
        </div>

        <div className="card stat-card fee-stat">
          <div className="stat-icon"><i className="fas fa-credit-card"></i></div>
          <div className="stat-info">
            <h3>₹{stats.feesDue}</h3>
            <p>Fees Due</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
