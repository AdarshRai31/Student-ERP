import React, { useState } from 'react';
import './PaymentHistory.css';

interface Payment {
  id: string;
  date: Date;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  receiptUrl: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(payment => payment.status === filter);

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="payment-history">
      <div className="payment-header">
        <h3>Payment History</h3>
        <div className="payment-filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'failed' ? 'active' : ''} 
            onClick={() => setFilter('failed')}
          >
            Failed
          </button>
        </div>
      </div>

      <div className="payment-summary">
        <div className="summary-card">
          <span className="summary-label">Total {filter === 'all' ? '' : filter} payments</span>
          <span className="summary-value">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="payments-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.date.toLocaleDateString()}</td>
                <td>{payment.description}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{payment.method}</td>
                <td>
                  <span className={`status-badge ${payment.status}`}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="receipt-btn"
                    onClick={() => window.open(payment.receiptUrl, '_blank')}
                    disabled={payment.status !== 'completed'}
                  >
                    Download Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="no-payments">
            No payments found for the selected filter
          </div>
        )}
      </div>
    </div>
  );
};
