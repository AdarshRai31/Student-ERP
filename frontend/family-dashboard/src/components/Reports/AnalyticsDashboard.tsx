import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './AnalyticsDashboard.css';

const gradeData = [
  { subject: 'Math', grade: 88 },
  { subject: 'Science', grade: 92 },
  { subject: 'English', grade: 85 },
  { subject: 'History', grade: 78 },
  { subject: 'Art', grade: 95 }
];

const attendanceData = [
  { month: 'Jan', present: 20, absent: 2 },
  { month: 'Feb', present: 18, absent: 4 },
  { month: 'Mar', present: 22, absent: 0 },
  { month: 'Apr', present: 19, absent: 3 },
  { month: 'May', present: 21, absent: 1 }
];

const performanceData = [
  { name: 'Excellent', value: 45 },
  { name: 'Good', value: 30 },
  { name: 'Average', value: 15 },
  { name: 'Needs Improvement', value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="analytics-dashboard">
      <h2>Performance Analytics</h2>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Subject Grades</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="grade" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Monthly Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#82ca9d" />
              <Bar dataKey="absent" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"

              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="export-actions">
        <button className="export-btn">Export PDF Report</button>
        <button className="export-btn">Export Excel Data</button>
        <button className="export-btn">Print Report</button>
      </div>
    </div>
  );
};
