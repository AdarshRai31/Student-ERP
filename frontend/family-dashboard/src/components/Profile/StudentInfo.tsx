import React from 'react';
import './StudentInfo.css';

interface Student {
  id: string;
  name: string;
  photo: string;
  class: string;
  section: string;
  gpa: number;
  attendance: number;
}

interface StudentInfoProps {
  student: Student;
}

export const StudentInfo: React.FC<StudentInfoProps> = ({ student }) => {
  return (
    <div className="student-info">
      <div className="student-header">
        <img src={student.photo} alt={student.name} className="student-photo" />
        <div className="student-details">
          <h3>{student.name}</h3>
          <p>Class: {student.class} - Section {student.section}</p>
        </div>
      </div>
      
      <div className="student-stats">
        <div className="stat">
          <span className="stat-label">Current GPA</span>
          <span className="stat-value">{student.gpa}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Attendance</span>
          <span className="stat-value">{student.attendance}%</span>
        </div>
      </div>
      
      <div className="student-actions">
        <button className="action-btn">View Profile</button>
        <button className="action-btn">Edit Details</button>
      </div>
    </div>
  );
};
