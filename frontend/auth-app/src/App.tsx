import React from 'react';
import './App.css';

const App: React.FC = () => {
  const handleRoleSelect = (role: string): void => {
    let dashboardUrl = '';

    switch (role) {
      case 'admin':
        dashboardUrl = 'http://localhost:3001'; // college-erp-dashboard
        break;
      case 'faculty':
        dashboardUrl = 'http://localhost:3002'; // faculty-dashboard
        break;
      case 'family':
        dashboardUrl = 'http://localhost:3003'; // family-dashboard
        break;
      case 'student':
        dashboardUrl = 'http://localhost:3004'; // student-dashboard
        break;
      default:
        return;
    }

    // Store role in localStorage for dashboard to use
    localStorage.setItem('selectedRole', role);
    // Open selected dashboard in a new tab/window (original behavior)
    window.open(dashboardUrl, '_blank');
  };

  return (
    <div className="App">
      <div className="role-selection-container">
        <div className="role-selection-card">
          <div className="role-selection-header">
            <h1>College ERP System</h1>
            <p>Select your role to access the dashboard</p>
          </div>

          <div className="role-buttons">
            <button
              className="role-btn admin-btn"
              onClick={() => handleRoleSelect('admin')}
            >
              <div className="role-icon">👑</div>
              <div className="role-info">
                <h3>Admin</h3>
                <p>College Administration</p>
              </div>
            </button>

            <button
              className="role-btn faculty-btn"
              onClick={() => handleRoleSelect('faculty')}
            >
              <div className="role-icon">👨‍🏫</div>
              <div className="role-info">
                <h3>Faculty</h3>
                <p>Teaching Staff</p>
              </div>
            </button>

            <button
              className="role-btn family-btn"
              onClick={() => handleRoleSelect('family')}
            >
              <div className="role-icon">👨‍👩‍👧‍👦</div>
              <div className="role-info">
                <h3>Parent/Family</h3>
                <p>Student Guardians</p>
              </div>
            </button>

            <button
              className="role-btn student-btn"
              onClick={() => handleRoleSelect('student')}
            >
              <div className="role-icon">🎓</div>
              <div className="role-info">
                <h3>Student</h3>
                <p>College Students</p>
              </div>
            </button>
          </div>

          <div className="instructions">
            <h4>How to test:</h4>
            <ol>
              <li>Click on any role button above</li>
              <li>The respective dashboard will open in a new tab/window</li>
              <li>Make sure all dashboard servers are running on their respective ports</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
