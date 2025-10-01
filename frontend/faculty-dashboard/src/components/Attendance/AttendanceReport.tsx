// src/components/Attendance/AttendanceReport.tsx
import React, { useState } from 'react';
import { Download, Filter, Calendar, BarChart3 } from 'lucide-react';
import './AttendanceReport.css';

interface AttendanceRecord {
  date: string;
  subject: string;
  section: string;
  present: number;
  absent: number;
  late: number;
}

const AttendanceReport: React.FC = () => {
  const [filters, setFilters] = useState({
    subject: '',
    section: '',
    month: new Date().toISOString().slice(0, 7),
  });

  const [attendanceData] = useState<AttendanceRecord[]>([
    { date: '2023-10-01', subject: 'Data Structures', section: 'CS-A', present: 38, absent: 4, late: 2 },
    { date: '2023-10-02', subject: 'Algorithms', section: 'CS-B', present: 40, absent: 2, late: 0 },
    { date: '2023-10-03', subject: 'Database Systems', section: 'CS-C', present: 35, absent: 5, late: 2 },
    { date: '2023-10-04', subject: 'Data Structures', section: 'CS-A', present: 39, absent: 3, late: 0 },
    { date: '2023-10-05', subject: 'Algorithms', section: 'CS-B', present: 37, absent: 3, late: 2 },
  ]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const filteredData = attendanceData.filter(item => {
    return (
      (filters.subject === '' || item.subject === filters.subject) &&
      (filters.section === '' || item.section === filters.section) &&
      (filters.month === '' || item.date.startsWith(filters.month))
    );
  });

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    alert('Report download functionality would be implemented here');
  };

  return (
    <div className="attendance-report">
      <div className="page-header">
        <h2>Attendance Reports</h2>
        <button className="btn-primary" onClick={handleDownloadReport}>
          <Download size={16} />
          <span>Download Report</span>
        </button>
      </div>

      <div className="report-filters">
        <h3>
          <Filter size={20} />
          <span>Filter Reports</span>
        </h3>
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
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
              value={filters.section}
              onChange={(e) => handleFilterChange('section', e.target.value)}
            >
              <option value="">All Sections</option>
              <option value="CS-A">CS-A</option>
              <option value="CS-B">CS-B</option>
              <option value="CS-C">CS-C</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="month">
              <Calendar size={16} />
              <span>Month</span>
            </label>
            <input
              type="month"
              id="month"
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="report-summary">
        <h3>Summary</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <span className="value">{filteredData.length}</span>
            <span className="label">Classes</span>
          </div>
          <div className="summary-card">
            <span className="value">
              {filteredData.reduce((sum, item) => sum + item.present, 0)}
            </span>
            <span className="label">Total Present</span>
          </div>
          <div className="summary-card">
            <span className="value">
              {filteredData.reduce((sum, item) => sum + item.absent, 0)}
            </span>
            <span className="label">Total Absent</span>
          </div>
          <div className="summary-card">
            <span className="value">
              {Math.round(
                filteredData.reduce((sum, item) => sum + item.present, 0) /
                filteredData.reduce((sum, item) => sum + item.present + item.absent + item.late, 0) * 100
              )}%
            </span>
            <span className="label">Average Attendance</span>
          </div>
        </div>
      </div>

      <div className="report-table-container">
        <h3>Detailed Report</h3>
        {filteredData.length === 0 ? (
          <p className="no-data">No attendance records found for the selected filters.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Section</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Late</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  const total = item.present + item.absent + item.late;
                  const percentage = Math.round((item.present / total) * 100);
                  
                  return (
                    <tr key={index}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.subject}</td>
                      <td>{item.section}</td>
                      <td className="present">{item.present}</td>
                      <td className="absent">{item.absent}</td>
                      <td className="late">{item.late}</td>
                      <td className={`percentage ${percentage >= 80 ? 'high' : percentage >= 60 ? 'medium' : 'low'}`}>
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="report-charts">
        <h3>Visual Reports</h3>
        <div className="charts-container">
          <div className="chart-placeholder">
            <BarChart3 size={40} />
            <p>Attendance trends chart would be displayed here</p>
          </div>
          <div className="chart-placeholder">
            <BarChart3 size={40} />
            <p>Subject-wise comparison chart would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
