// src/components/Attendance/AttendanceManager.tsx
import React, { useState } from 'react';
import { Save, Download, Send } from 'lucide-react';
import './AttendanceManager.css';

const AttendanceManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [selectedSection, setSelectedSection] = useState('CS-A');
  
  const [attendance, setAttendance] = useState([
    { id: '1', studentId: 'S001', studentName: 'John Doe', status: 'present' as const },
    { id: '2', studentId: 'S002', studentName: 'Jane Smith', status: 'present' as const },
    { id: '3', studentId: 'S003', studentName: 'Robert Johnson', status: 'absent' as const },
    { id: '4', studentId: 'S004', studentName: 'Emily Davis', status: 'late' as const },
  ]);

  const handleStatusChange = (id: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(attendance.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const handleSave = () => {
    // Save attendance logic here
    alert('Attendance saved successfully!');
  };

  const handleNotifyAbsent = () => {
    const absentStudents = attendance.filter(s => s.status === 'absent');
    if (absentStudents.length === 0) {
      alert('No absent students to notify.');
      return;
    }
    alert(`Notification sent to ${absentStudents.length} absent students.`);
  };

  return (
    <div className="attendance-manager">
      <div className="page-header">
        <h2>Attendance Management</h2>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleSave}>
            <Save size={16} />
            <span>Save Attendance</span>
          </button>
          <button className="btn-secondary">
            <Download size={16} />
            <span>Generate Report</span>
          </button>
          <button className="btn-warning" onClick={handleNotifyAbsent}>
            <Send size={16} />
            <span>Notify Absent</span>
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
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
            <option value="CS-A">CS-A</option>
            <option value="CS-B">CS-B</option>
            <option value="CS-C">CS-C</option>
          </select>
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((student) => (
              <tr key={student.id}>
                <td>{student.studentId}</td>
                <td>{student.studentName}</td>
                <td>
                  <select
                    value={student.status}
                    onChange={(e) => handleStatusChange(student.id, e.target.value as any)}
                    className={`status-select ${student.status}`}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="attendance-summary">
        <div className="summary-item present">
          <span className="count">{attendance.filter(s => s.status === 'present').length}</span>
          <span className="label">Present</span>
        </div>
        <div className="summary-item absent">
          <span className="count">{attendance.filter(s => s.status === 'absent').length}</span>
          <span className="label">Absent</span>
        </div>
        <div className="summary-item late">
          <span className="count">{attendance.filter(s => s.status === 'late').length}</span>
          <span className="label">Late</span>
        </div>
        <div className="summary-item total">
          <span className="count">{attendance.length}</span>
          <span className="label">Total</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManager;
