// src/components/ClassManagement/ClassManager.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Upload } from 'lucide-react';
import './ClassManager.css';

const ClassManager: React.FC = () => {
  const location = useLocation();

  const classSections = [
    { id: 'CS-A', name: 'Computer Science A', subject: 'Data Structures' },
    { id: 'CS-B', name: 'Computer Science B', subject: 'Algorithms' },
    { id: 'CS-C', name: 'Computer Science C', subject: 'Database Systems' },
  ];

  return (
    <div className="class-manager">
      <div className="page-header">
        <h2>Class Management</h2>
        <div className="header-actions">
          <Link to="/timetable" className="action-btn">
            <Calendar size={16} />
            <span>Upload Timetable</span>
          </Link>
          <Link to="/materials" className="action-btn">
            <Upload size={16} />
            <span>Upload Materials</span>
          </Link>
        </div>
      </div>

      <div className="classes-grid">
        {classSections.map((section) => (
          <div key={section.id} className="class-card">
            <div className="class-header">
              <h3>{section.name}</h3>
              <span className="class-id">{section.id}</span>
            </div>
            <div className="class-details">
              <p className="subject">{section.subject}</p>
              <div className="class-stats">
                <div className="stat">
                  <span className="value">42</span>
                  <span className="label">Students</span>
                </div>
                <div className="stat">
                  <span className="value">85%</span>
                  <span className="label">Attendance</span>
                </div>
              </div>
            </div>
            <div className="class-actions">
              <button className="btn-primary">View Details</button>
              <button className="btn-secondary">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassManager;
