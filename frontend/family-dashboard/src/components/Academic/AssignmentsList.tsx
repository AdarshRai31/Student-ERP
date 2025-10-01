import React from 'react';
import './AssignmentsList.css';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  priority: 'high' | 'medium' | 'low';
}

interface AssignmentsListProps {
  assignments: Assignment[];
}

export const AssignmentsList: React.FC<AssignmentsListProps> = ({ assignments }) => {
  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'overdue': return '❗';
      default: return '';
    }
  };

  const getPriorityClass = (priority: Assignment['priority']) => {
    switch (priority) {
      case 'high': return 'high-priority';
      case 'medium': return 'medium-priority';
      case 'low': return 'low-priority';
      default: return '';
    }
  };

  return (
    <div className="assignments-list">
      <h3>Assignments</h3>
      <div className="assignments-container">
        {assignments.map(assignment => (
          <div key={assignment.id} className={`assignment-card ${getPriorityClass(assignment.priority)}`}>
            <div className="assignment-header">
              <span className="subject-badge">{assignment.subject}</span>
              <span className={`status-badge ${assignment.status}`}>
                {getStatusIcon(assignment.status)} {assignment.status}
              </span>
            </div>
            <h4 className="assignment-title">{assignment.title}</h4>
            <div className="assignment-due">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </div>
            <div className="assignment-actions">
              <button className="view-btn">View Details</button>
              {assignment.status !== 'completed' && (
                <button className="complete-btn">Mark Complete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
