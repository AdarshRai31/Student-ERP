import React, { useState, useEffect } from 'react';
import './BusTracker.css';

interface BusLocation {
  id: string;
  routeName: string;
  currentLocation: string;
  nextStop: string;
  estimatedArrival: string;
  status: 'on-time' | 'delayed' | 'arriving';
  latitude: number;
  longitude: number;
}

export const BusTracker: React.FC = () => {
  const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get bus location
    const fetchBusLocation = () => {
      setTimeout(() => {
        setBusLocation({
          id: '1',
          routeName: 'Route 42 - Downtown',
          currentLocation: '123 Main Street',
          nextStop: 'School Gate',
          estimatedArrival: '5 minutes',
          status: 'on-time',
          latitude: 40.7128,
          longitude: -74.0060
        });
        setLoading(false);
      }, 1000);
    };

    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bus-tracker">
        <h3>Bus Tracker</h3>
        <div className="loading">Loading bus location...</div>
      </div>
    );
  }

  if (!busLocation) {
    return (
      <div className="bus-tracker">
        <h3>Bus Tracker</h3>
        <div className="no-data">No bus information available</div>
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'on-time':
        return 'status-on-time';
      case 'delayed':
        return 'status-delayed';
      case 'arriving':
        return 'status-arriving';
      default:
        return '';
    }
  };

  return (
    <div className="bus-tracker">
      <h3>Bus Tracker</h3>
      
      <div className="bus-route">
        <div className="route-name">{busLocation.routeName}</div>
        <div className={`status-badge ${getStatusClass(busLocation.status)}`}>
          {busLocation.status.charAt(0).toUpperCase() + busLocation.status.slice(1).replace('-', ' ')}
        </div>
      </div>

      <div className="bus-location-details">
        <div className="location-item">
          <span className="label">Current Location:</span>
          <span className="value">{busLocation.currentLocation}</span>
        </div>
        
        <div className="location-item">
          <span className="label">Next Stop:</span>
          <span className="value">{busLocation.nextStop}</span>
        </div>
        
        <div className="location-item">
          <span className="label">Estimated Arrival:</span>
          <span className="value highlight">{busLocation.estimatedArrival}</span>
        </div>
      </div>

      <div className="map-placeholder">
        <div className="map-icon">📍</div>
        <p>Live tracking map would be displayed here</p>
        <small>Coordinates: {busLocation.latitude.toFixed(4)}, {busLocation.longitude.toFixed(4)}</small>
      </div>

      <div className="refresh-info">
        <small>Last updated: {new Date().toLocaleTimeString()}</small>
      </div>
    </div>
  );
};


