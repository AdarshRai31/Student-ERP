import React, { useState } from 'react';
import './RecommendationsBanner.css';

interface Recommendation {
  id: string;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  category: 'academic' | 'attendance' | 'health' | 'general';
  actionLabel?: string;
  actionUrl?: string;
}

interface RecommendationsBannerProps {
  recommendations: Recommendation[];
}

export const RecommendationsBanner: React.FC<RecommendationsBannerProps> = ({ recommendations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (recommendations.length === 0) return null;

  const currentRec = recommendations[currentIndex];

  const nextRecommendation = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevRecommendation = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  return (
    <div className={`recommendations-banner ${currentRec.priority} ${isExpanded ? 'expanded' : ''}`}>
      <div className="banner-content">
        <div className="banner-header">
          <span className="banner-icon">💡</span>
          <h4>{currentRec.title}</h4>
          <button 
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
        
        {isExpanded && (
          <div className="banner-details">
            <p>{currentRec.message}</p>
            {currentRec.actionLabel && (
              <button className="action-btn">
                {currentRec.actionLabel}
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="banner-controls">
        <button className="nav-btn" onClick={prevRecommendation}>◀</button>
        <span className="banner-counter">
          {currentIndex + 1} / {recommendations.length}
        </span>
        <button className="nav-btn" onClick={nextRecommendation}>▶</button>
        <button className="dismiss-btn">×</button>
      </div>
    </div>
  );
};
