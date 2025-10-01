import React from 'react';
import './GuardianDetails.css';

interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  role: 'Primary' | 'Secondary';
}

interface GuardianDetailsProps {
  guardians: Guardian[];
}

export const GuardianDetails: React.FC<GuardianDetailsProps> = ({ guardians }) => {
  return (
    <div className="guardian-details">
      <h3>Parent/Guardian Details</h3>
      
      <div className="guardians-list">
        {guardians.map(guardian => (
          <div key={guardian.id} className="guardian-card">
            <div className="guardian-header">
              <h4>{guardian.name}</h4>
              <span className={`role-badge ${guardian.role.toLowerCase()}`}>
                {guardian.role}
              </span>
            </div>
            
            <div className="guardian-info">
              <p className="relationship">{guardian.relationship}</p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <span className="icon">📞</span>
                  <a href={`tel:${guardian.phone}`}>{guardian.phone}</a>
                </div>
                
                <div className="contact-item">
                  <span className="icon">✉️</span>
                  <a href={`mailto:${guardian.email}`}>{guardian.email}</a>
                </div>
              </div>
            </div>
            
            <div className="guardian-actions">
              <button className="contact-btn">Call</button>
              <button className="contact-btn">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
