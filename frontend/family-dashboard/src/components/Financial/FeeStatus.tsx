import React from 'react';
import './FeeStatus.css';

interface FeeStatusProps {
  totalAmount: number;
  paidAmount: number;
  dueDate: Date;
  status: 'paid' | 'partial' | 'pending';
}

export const FeeStatus: React.FC<FeeStatusProps> = ({
  totalAmount,
  paidAmount,
  dueDate,
  status
}) => {
  const dueText = dueDate.toLocaleDateString();
  const remainingAmount = totalAmount - paidAmount;
  const progressPercentage = (paidAmount / totalAmount) * 100;
  
  return (
    <div className="fee-status">
      <h3>Fee Status</h3>
      
      <div className="fee-progress">
        <div className="progress-bar">
          <div 
            className={`progress-fill ${status}`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {paidAmount.toLocaleString()} / {totalAmount.toLocaleString()}
        </div>
      </div>
      
      <div className="fee-details">
        <div className="fee-detail">
          <span className="label">Status:</span>
          <span className={`value status-${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        <div className="fee-detail">
          <span className="label">Due Date:</span>
          <span className="value">{dueText}</span>
        </div>
        
        <div className="fee-detail">
          <span className="label">Remaining:</span>
          <span className="value">${remainingAmount.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="fee-actions">
        <button className="pay-button">Pay Now</button>
        <button className="download-button">Download Receipt</button>
      </div>
    </div>
  );
};
