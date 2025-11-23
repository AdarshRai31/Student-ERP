import React from 'react';
import './TransportLogs.css';

interface TransportLog {
  id: string;
  date: string;
  route: string;
  pickupTime: string;
  dropoffTime: string;
  status: 'completed' | 'missed' | 'delayed';
  driver: string;
  vehicleNumber: string;
}

interface TransportLogsProps {
  logs?: TransportLog[];
}

export const TransportLogs: React.FC<TransportLogsProps> = ({ 
  logs = [] 
}) => {
  // Mock data if no logs provided
  const mockLogs: TransportLog[] = logs.length > 0 ? logs : [
    {
      id: '1',
      date: '2024-01-15',
      route: 'Route 42 - Downtown',
      pickupTime: '07:30 AM',
      dropoffTime: '08:15 AM',
      status: 'completed',
      driver: 'John Doe',
      vehicleNumber: 'BUS-001'
    },
    {
      id: '2',
      date: '2024-01-14',
      route: 'Route 42 - Downtown',
      pickupTime: '07:35 AM',
      dropoffTime: '08:20 AM',
      status: 'delayed',
      driver: 'John Doe',
      vehicleNumber: 'BUS-001'
    },
    {
      id: '3',
      date: '2024-01-13',
      route: 'Route 42 - Downtown',
      pickupTime: '07:30 AM',
      dropoffTime: '08:15 AM',
      status: 'completed',
      driver: 'John Doe',
      vehicleNumber: 'BUS-001'
    },
    {
      id: '4',
      date: '2024-01-12',
      route: 'Route 42 - Downtown',
      pickupTime: '07:30 AM',
      dropoffTime: '08:15 AM',
      status: 'completed',
      driver: 'Jane Smith',
      vehicleNumber: 'BUS-002'
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'missed':
        return 'status-missed';
      case 'delayed':
        return 'status-delayed';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="transport-logs">
      <h3>Transport History</h3>
      
      {mockLogs.length === 0 ? (
        <div className="no-logs">
          <p>No transport logs available</p>
        </div>
      ) : (
        <div className="logs-container">
          {mockLogs.map((log) => (
            <div key={log.id} className="log-card">
              <div className="log-header">
                <div className="log-date">{formatDate(log.date)}</div>
                <div className={`status-badge ${getStatusClass(log.status)}`}>
                  {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                </div>
              </div>
              
              <div className="log-details">
                <div className="log-row">
                  <span className="label">Route:</span>
                  <span className="value">{log.route}</span>
                </div>
                
                <div className="log-row">
                  <span className="label">Pickup:</span>
                  <span className="value">{log.pickupTime}</span>
                </div>
                
                <div className="log-row">
                  <span className="label">Drop-off:</span>
                  <span className="value">{log.dropoffTime}</span>
                </div>
                
                <div className="log-row">
                  <span className="label">Driver:</span>
                  <span className="value">{log.driver}</span>
                </div>
                
                <div className="log-row">
                  <span className="label">Vehicle:</span>
                  <span className="value">{log.vehicleNumber}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="logs-footer">
        <button className="view-all-btn">View All Logs</button>
      </div>
    </div>
  );
};


