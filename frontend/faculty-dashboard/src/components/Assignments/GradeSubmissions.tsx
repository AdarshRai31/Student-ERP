// src/components/Assignments/GradeSubmissions.tsx
import React, { useState } from 'react';
import { Save, Download, Search, CheckCircle } from 'lucide-react';
import './GradeSubmissions.css';

// Define types
type GradedSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  grade: number; // must exist
  feedback: string;
  file: string;
  status: 'graded';
};

type SubmittedSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  grade?: number; // optional
  feedback: string;
  file: string;
  status: 'submitted';
};

type Submission = GradedSubmission | SubmittedSubmission;

const GradeSubmissions: React.FC = () => {
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [assignments] = useState([
    { id: '1', title: 'Data Structures Assignment 1', subject: 'Data Structures', section: 'CS-A' },
    { id: '2', title: 'Algorithms Problem Set', subject: 'Algorithms', section: 'CS-B' },
  ]);

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      assignmentId: '1',
      studentId: 'S001',
      studentName: 'John Doe',
      submissionDate: '2023-10-12',
      grade: 85,
      feedback: 'Good work, but could be more detailed in section 3.',
      file: 'assignment1_john_doe.pdf',
      status: 'graded',
    },
    {
      id: '2',
      assignmentId: '1',
      studentId: 'S002',
      studentName: 'Jane Smith',
      submissionDate: '2023-10-11',
      feedback: '',
      file: 'assignment1_jane_smith.pdf',
      status: 'submitted',
    },
    {
      id: '3',
      assignmentId: '1',
      studentId: 'S003',
      studentName: 'Robert Johnson',
      submissionDate: '2023-10-10',
      grade: 92,
      feedback: 'Excellent work! Very thorough.',
      file: 'assignment1_robert_johnson.pdf',
      status: 'graded',
    },
  ]);

  const handleGradeChange = (id: string, grade: number) => {
    setSubmissions(submissions.map(sub =>
      sub.id === id ? { ...sub, grade } as Submission : sub
    ));
  };

  const handleFeedbackChange = (id: string, feedback: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === id ? { ...sub, feedback } as Submission : sub
    ));
  };

  const handleSaveGrade = (id: string) => {
    setSubmissions(submissions.map(sub => {
      if (sub.id === id) {
        if (sub.grade !== undefined) {
          return { ...sub, status: 'graded' } as GradedSubmission;
        } else {
          alert('Please enter a grade before saving');
        }
      }
      return sub;
    }));
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesAssignment = selectedAssignment === '' || sub.assignmentId === selectedAssignment;
    const matchesSearch = searchTerm === '' ||
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAssignment && matchesSearch;
  });

  return (
    <div className="grade-submissions">
      <div className="page-header">
        <h2>Grade Submissions</h2>
        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={16} />
            <span>Export Grades</span>
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="assignment">Assignment</label>
          <select
            id="assignment"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            <option value="">All Assignments</option>
            {assignments.map(assignment => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title} ({assignment.subject} - {assignment.section})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group search-group">
          <label htmlFor="search">Search Students</label>
          <div className="search-input">
            <Search size={16} />
            <input
              type="text"
              id="search"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="submissions-list">
        <h3>Student Submissions</h3>
        {filteredSubmissions.length === 0 ? (
          <p className="no-data">No submissions found for the selected filters.</p>
        ) : (
          <div className="submissions-grid">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <div className="student-info">
                    <h4>{submission.studentName}</h4>
                    <p className="student-id">{submission.studentId}</p>
                  </div>
                  <div className={`status ${submission.status}`}>
                    {submission.status === 'graded' ? (
                      <CheckCircle size={16} />
                    ) : null}
                    <span>{submission.status}</span>
                  </div>
                </div>

                <div className="submission-details">
                  <p className="submission-date">
                    Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                  </p>
                  <p className="file-name">{submission.file}</p>
                </div>

                <div className="grading-section">
                  <div className="grade-input">
                    <label htmlFor={`grade-${submission.id}`}>Grade</label>
                    <input
                      type="number"
                      id={`grade-${submission.id}`}
                      min="0"
                      max="100"
                      value={submission.grade ?? ''}
                      onChange={(e) => handleGradeChange(submission.id, parseInt(e.target.value))}
                      placeholder="Enter grade"
                    />
                    <span>/100</span>
                  </div>

                  <div className="feedback-input">
                    <label htmlFor={`feedback-${submission.id}`}>Feedback</label>
                    <textarea
                      id={`feedback-${submission.id}`}
                      value={submission.feedback}
                      onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                      placeholder="Enter feedback for the student"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="submission-actions">
                  <button className="btn-secondary">Download</button>
                  <button
                    className="btn-primary"
                    onClick={() => handleSaveGrade(submission.id)}
                  >
                    <Save size={16} />
                    <span>Save Grade</span>
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

export default GradeSubmissions;
