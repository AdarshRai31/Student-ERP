// src/components/Performance/StudentPerformance.tsx
import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Search } from 'lucide-react';
import './StudentPerformance.css';

const StudentPerformance: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [students] = useState([
    {
      id: 'S001',
      name: 'John Doe',
      section: 'CS-A',
      performance: {
        assignments: 85,
        exams: 78,
        attendance: 92,
        overall: 82
      }
    },
    {
      id: 'S002',
      name: 'Jane Smith',
      section: 'CS-A',
      performance: {
        assignments: 92,
        exams: 88,
        attendance: 95,
        overall: 90
      }
    },
    {
      id: 'S003',
      name: 'Robert Johnson',
      section: 'CS-B',
      performance: {
        assignments: 78,
        exams: 82,
        attendance: 85,
        overall: 80
      }
    },
    {
      id: 'S004',
      name: 'Emily Davis',
      section: 'CS-B',
      performance: {
        assignments: 95,
        exams: 90,
        attendance: 98,
        overall: 93
      }
    },
  ]);

  const filteredStudents = students.filter(student => {
    const matchesSubject = selectedSubject === '' || true; // In a real app, this would filter by subject
    const matchesSection = selectedSection === '' || student.section === selectedSection;
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSection && matchesSearch;
  });

  const getPerformanceTrend = (student: typeof students[0]) => {
    if (student.performance.overall >= 85) return 'high';
    if (student.performance.overall >= 70) return 'medium';
    return 'low';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'high') return <TrendingUp size={16} />;
    if (trend === 'medium') return <span>→</span>;
    return <TrendingDown size={16} />;
  };

  return (
    <div className="student-performance">
      <div className="page-header">
        <h2>Student Performance</h2>
        <div className="header-actions">
          <button className="btn-primary">
            <BarChart3 size={16} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            <option value="Data Structures">Data Structures</option>
            <option value="Algorithms">Algorithms</option>
            <option value="Database Systems">Database Systems</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="section">Section</label>
          <select
            id="section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">All Sections</option>
            <option value="CS-A">CS-A</option>
            <option value="CS-B">CS-B</option>
            <option value="CS-C">CS-C</option>
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

      <div className="performance-summary">
        <h3>Class Performance Summary</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <span className="value">
              {Math.round(students.reduce((sum, student) => sum + student.performance.overall, 0) / students.length)}%
            </span>
            <span className="label">Average Performance</span>
          </div>
          <div className="summary-card">
            <span className="value">
              {students.filter(student => student.performance.overall >= 85).length}
            </span>
            <span className="label">High Performers</span>
          </div>
          <div className="summary-card">
            <span className="value">
              {students.filter(student => student.performance.overall < 70).length}
            </span>
            <span className="label">Need Improvement</span>
          </div>
        </div>
      </div>

      <div className="students-list">
        <h3>Student Performance Details</h3>
        {filteredStudents.length === 0 ? (
          <p className="no-data">No students found for the selected filters.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Section</th>
                  <th>Assignments</th>
                  <th>Exams</th>
                  <th>Attendance</th>
                  <th>Overall</th>
                  <th>Trend</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const trend = getPerformanceTrend(student);
                  return (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td className="student-name">{student.name}</td>
                      <td>{student.section}</td>
                      <td className={`grade ${student.performance.assignments >= 80 ? 'high' : student.performance.assignments >= 60 ? 'medium' : 'low'}`}>
                        {student.performance.assignments}%
                      </td>
                      <td className={`grade ${student.performance.exams >= 80 ? 'high' : student.performance.exams >= 60 ? 'medium' : 'low'}`}>
                        {student.performance.exams}%
                      </td>
                      <td className={`grade ${student.performance.attendance >= 80 ? 'high' : student.performance.attendance >= 60 ? 'medium' : 'low'}`}>
                        {student.performance.attendance}%
                      </td>
                      <td className={`grade overall ${trend}`}>
                        {student.performance.overall}%
                      </td>
                      <td className={`trend ${trend}`}>
                        {getTrendIcon(trend)}
                      </td>
                      <td>
                        <button className="btn-secondary">View Details</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPerformance;
