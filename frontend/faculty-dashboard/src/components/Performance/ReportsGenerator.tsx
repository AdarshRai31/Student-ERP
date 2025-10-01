// src/components/Performance/ReportsGenerator.tsx
import React, { useState } from 'react';
import { Download, FileText, BarChart, Calendar } from 'lucide-react';
import './ReportsGenerator.css';

const ReportsGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('performance');
  const [dateRange, setDateRange] = useState({
    start: '2023-09-01',
    end: '2023-10-31',
  });
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const handleGenerateReport = () => {
    // In a real app, this would generate a report based on the selected parameters
    alert(`Generating ${reportType} report for ${selectedSubject || 'all subjects'} (${selectedSection || 'all sections'}) from ${dateRange.start} to ${dateRange.end}`);
  };

  const reportTypes = [
    { id: 'performance', label: 'Performance Report', icon: BarChart },
    { id: 'attendance', label: 'Attendance Report', icon: Calendar },
    { id: 'assignment', label: 'Assignment Report', icon: FileText },
  ];

  return (
    <div className="reports-generator">
      <div className="page-header">
        <h2>Generate Reports</h2>
      </div>

      <div className="report-configuration">
        <h3>Report Configuration</h3>
        
        <div className="config-section">
          <h4>Report Type</h4>
          <div className="report-type-selector">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className={`report-type-card ${reportType === type.id ? 'selected' : ''}`}
                  onClick={() => setReportType(type.id)}
                >
                  <Icon size={24} />
                  <span>{type.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="config-section">
          <h4>Date Range</h4>
          <div className="date-range-selector">
            <div className="date-input">
              <label htmlFor="start-date">From</label>
              <input
                type="date"
                id="start-date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="date-input">
              <label htmlFor="end-date">To</label>
              <input
                type="date"
                id="end-date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="config-section">
          <h4>Filters</h4>
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="report-subject">Subject</label>
              <select
                id="report-subject"
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
              <label htmlFor="report-section">Section</label>
              <select
                id="report-section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">All Sections</option>
                <option value="CS-A">CS-A</option>
                <option value="CS-B">CS-B</option>
                <option value="CS-C">CS-C</option>
              </select>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h4>Report Format</h4>
          <div className="format-selector">
            <label className="format-option">
              <input type="radio" name="format" value="pdf" defaultChecked />
              <span>PDF</span>
            </label>
            <label className="format-option">
              <input type="radio" name="format" value="excel" />
              <span>Excel</span>
            </label>
            <label className="format-option">
              <input type="radio" name="format" value="csv" />
              <span>CSV</span>
            </label>
          </div>
        </div>

        <div className="generate-section">
          <button className="btn-primary" onClick={handleGenerateReport}>
            <Download size={16} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      <div className="recent-reports">
        <h3>Recent Reports</h3>
        <div className="reports-list">
          <div className="report-item">
            <div className="report-info">
              <h4>Performance Report - CS-A</h4>
              <p>Generated on October 15, 2023</p>
              <span className="report-type">PDF</span>
            </div>
            <button className="btn-secondary">
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
          
          <div className="report-item">
            <div className="report-info">
              <h4>Attendance Summary - All Sections</h4>
              <p>Generated on October 10, 2023</p>
              <span className="report-type">Excel</span>
            </div>
            <button className="btn-secondary">
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
          
          <div className="report-item">
            <div className="report-info">
              <h4>Assignment Grades - Algorithms</h4>
              <p>Generated on October 5, 2023</p>
              <span className="report-type">CSV</span>
            </div>
            <button className="btn-secondary">
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsGenerator;
