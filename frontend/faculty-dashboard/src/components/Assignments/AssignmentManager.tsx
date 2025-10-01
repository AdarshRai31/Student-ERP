// src/components/Assignments/AssignmentManager.tsx
import React, { useState } from 'react';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';
import './AssignmentManager.css';

const AssignmentManager: React.FC = () => {
  const [assignments, setAssignments] = useState([
    {
      id: '1',
      title: 'Data Structures Assignment 1',
      subject: 'Data Structures',
      section: 'CS-A',
      deadline: '2023-11-15',
      maxGrade: 100,
      description: 'Implement linked list operations',
      attachments: ['assignment1.pdf'],
    },
    {
      id: '2',
      title: 'Algorithms Problem Set',
      subject: 'Algorithms',
      section: 'CS-B',
      deadline: '2023-11-20',
      maxGrade: 100,
      description: 'Solve complexity analysis problems',
      attachments: ['problemset.pdf'],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    section: '',
    deadline: '',
    maxGrade: 100,
    description: '',
    attachments: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...newAssignment,
      id: Date.now().toString(),
    };
    setAssignments([...assignments, newItem]);
    setNewAssignment({
      title: '',
      subject: '',
      section: '',
      deadline: '',
      maxGrade: 100,
      description: '',
      attachments: [],
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div className="assignment-manager">
      <div className="page-header">
        <h2>Assignment Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          <span>Create Assignment</span>
        </button>
      </div>

      {showForm && (
        <div className="assignment-form-container">
          <h3>Create New Assignment</h3>
          <form onSubmit={handleSubmit} className="assignment-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Database Systems">Database Systems</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="section">Section</label>
                <select
                  id="section"
                  value={newAssignment.section}
                  onChange={(e) => setNewAssignment({ ...newAssignment, section: e.target.value })}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="CS-A">CS-A</option>
                  <option value="CS-B">CS-B</option>
                  <option value="CS-C">CS-C</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="deadline">Deadline</label>
                <input
                  type="date"
                  id="deadline"
                  value={newAssignment.deadline}
                  onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxGrade">Maximum Grade</label>
              <input
                type="number"
                id="maxGrade"
                value={newAssignment.maxGrade}
                onChange={(e) => setNewAssignment({ ...newAssignment, maxGrade: parseInt(e.target.value) })}
                min="0"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Create Assignment</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="assignments-list">
        <h3>Current Assignments</h3>
        {assignments.length === 0 ? (
          <p className="no-data">No assignments created yet.</p>
        ) : (
          <div className="assignments-grid">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="assignment-card">
                <div className="assignment-header">
                  <h4>{assignment.title}</h4>
                  <span className="subject-badge">{assignment.subject}</span>
                </div>
                <div className="assignment-details">
                  <p className="section">Section: {assignment.section}</p>
                  <p className="deadline">
                    Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                  </p>
                  <p className="max-grade">Max Grade: {assignment.maxGrade}</p>
                  <p className="description">{assignment.description}</p>
                </div>
                <div className="assignment-actions">
                  <button className="icon-btn" title="Download">
                    <Download size={16} />
                  </button>
                  <button className="icon-btn" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="icon-btn delete" 
                    title="Delete"
                    onClick={() => handleDelete(assignment.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentManager;
