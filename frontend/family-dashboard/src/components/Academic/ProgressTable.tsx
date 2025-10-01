import React from 'react';
import './ProgressTable.css';

interface Grade {
  subject: string;
  score: number;
  teacher: string;
  feedback: string;
  trend: 'up' | 'down' | 'stable';
}

interface ProgressTableProps {
  grades: Grade[];
}

export const ProgressTable: React.FC<ProgressTableProps> = ({ grades }) => {
  const getTrendIcon = (trend: Grade['trend']) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '↔️';
      default: return '';
    }
  };

  const getScoreClass = (score: number): string => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  };

  return (
    <div className="progress-table">
      <h3>Subject-wise Progress</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Score</th>
              <th>Teacher</th>
              <th>Feedback</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index}>
                <td className="subject">{grade.subject}</td>
                <td>
                  <span className={`score ${getScoreClass(grade.score)}`}>
                    {grade.score}%
                  </span>
                </td>
                <td className="teacher">{grade.teacher}</td>
                <td className="feedback">{grade.feedback}</td>
                <td className="trend">
                  <span className={`trend-${grade.trend}`}>
                    {getTrendIcon(grade.trend)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
