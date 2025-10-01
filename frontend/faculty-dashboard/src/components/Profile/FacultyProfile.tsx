// src/components/Profile/FacultyProfile.tsx
import React, { useState } from 'react';
import { Faculty } from '../../types';
import './FacultyProfile.css';

const FacultyProfile: React.FC = () => {
  const [faculty] = useState<Faculty>({
    id: 'FAC-001',
    name: 'Dr. Jane Smith',
    department: 'Computer Science',
    subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
    contact: {
      email: 'jane.smith@university.edu',
      phone: '+1 (555) 123-4567',
      office: 'Building A, Room 305'
    },
    qualification: 'Ph.D. in Computer Science',
    joiningDate: '2018-09-01'
  });

  return (
    <div className="faculty-profile">
      <div className="profile-header">
        <h2>Faculty Profile</h2>
        <button className="edit-btn">Edit Profile</button>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <div className="avatar">
              <span>{faculty.name.charAt(0)}</span>
            </div>
            <div className="details">
              <h3>{faculty.name}</h3>
              <p className="faculty-id">{faculty.id}</p>
              <p className="department">{faculty.department}</p>
            </div>
          </div>

          <div className="profile-sections">
            <div className="profile-section">
              <h4>Subjects Taught</h4>
              <div className="subjects-list">
                {faculty.subjects.map((subject, index) => (
                  <span key={index} className="subject-tag">{subject}</span>
                ))}
              </div>
            </div>

            <div className="profile-section">
              <h4>Contact Information</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="label">Email:</span>
                  <span className="value">{faculty.contact.email}</span>
                </div>
                <div className="contact-item">
                  <span className="label">Phone:</span>
                  <span className="value">{faculty.contact.phone}</span>
                </div>
                <div className="contact-item">
                  <span className="label">Office:</span>
                  <span className="value">{faculty.contact.office}</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h4>Qualifications</h4>
              <p>{faculty.qualification}</p>
            </div>

            <div className="profile-section">
              <h4>Joining Date</h4>
              <p>{new Date(faculty.joiningDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <h4>Teaching Statistics</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">5</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">120</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">85%</span>
              <span className="stat-label">Attendance Avg</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">78%</span>
              <span className="stat-label">Performance Avg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
