import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Charts.css';

const gradeData = [
  { month: 'Jan', math: 85, science: 78, english: 88 },
  { month: 'Feb', math: 82, science: 80, english: 85 },
  { month: 'Mar', math: 88, science: 85, english: 90 },
  { month: 'Apr', math: 90, science: 82, english: 87 },
];

const attendanceData = [
  { month: 'Jan', present: 22, absent: 2 },
  { month: 'Feb', present: 20, absent: 4 },
  { month: 'Mar', present: 23, absent: 1 },
  { month: 'Apr', present: 21, absent: 3 },
];

export const Charts: React.FC = () => {
  return (
    <div className="charts">
      <h3>Performance Analytics</h3>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h4>Grade Trends</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="math" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="science" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="english" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h4>Attendance Pattern</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#82ca9d" name="Present Days" />
              <Bar dataKey="absent" fill="#ff8042" name="Absent Days" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
