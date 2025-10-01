import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ExamResults.css';

interface ExamResult {
  subject: string;
  score: number;
  maxScore: number;
  classAverage: number;
  grade: string;
}

interface ExamResultsProps {
  results: ExamResult[];
  examName: string;
  examDate: string;
}

export const ExamResults: React.FC<ExamResultsProps> = ({ results, examName, examDate }) => {
  const chartData = results.map(result => ({
    subject: result.subject,
    score: result.score,
    average: result.classAverage,
    fullMark: result.maxScore
  }));

  return (
    <div className="exam-results">
      <div className="exam-header">
        <h3>{examName} Results</h3>
        <span className="exam-date">{new Date(examDate).toLocaleDateString()}</span>
      </div>
      
      <div className="results-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#8884d8" name="Your Score" />
            <Bar dataKey="average" fill="#82ca9d" name="Class Average" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Class Average</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.subject}</td>
                <td>
                  <span className={`score ${getScoreClass(result.score, result.maxScore)}`}>
                    {result.score}/{result.maxScore}
                  </span>
                </td>
                <td>
                  <span className={`grade grade-${result.grade.toLowerCase()}`}>
                    {result.grade}
                  </span>
                </td>
                <td>{result.classAverage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getScoreClass = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'excellent';
  if (percentage >= 80) return 'good';
  if (percentage >= 70) return 'average';
  return 'poor';
};
