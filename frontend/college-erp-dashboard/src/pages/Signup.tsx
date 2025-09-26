import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, setAuth } from '../utils/auth';
import { ThemeProvider } from '../components/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/theme.css'; // Import theme variables
import '../styles/login.css'; // Import login styles

const Signup: React.FC = () => {
  return (
    <ThemeProvider defaultRole="admin">
      <SignupContent />
    </ThemeProvider>
  );
};

const SignupContent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password || !firstName || !lastName) {
      setError('Please fill out all fields');
      return;
    }
    try {
      setLoading(true);
      const { token } = await signup(username, password, firstName, lastName);
      setAuth(token, username);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-grid">
        {/* Left: Brand/Illustration */}
        <div className="brand-section">
          <div className="brand-header">
            <div className="brand-logo">CE</div>
            <div className="brand-text">
              <div className="brand-title">College ERP</div>
              <div className="brand-subtitle">Admin Portal</div>
            </div>
          </div>
          <h2 className="brand-heading">Create your secure password</h2>
          <p className="brand-description">Set up your account credentials to access the administrative dashboard and manage your institution effectively.</p>
        </div>

        {/* Right: Signup Card */}
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Create Password</h1>
            <p className="login-subtitle">Enter your registered email and details to set your password</p>
          </div>

          <form onSubmit={onSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="signup-name-grid">
              <div className="form-group">
                <label className="form-label">First name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Creating...' : 'Create Password'}
            </button>
          </form>

          <p className="login-footer">
            Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
          </p>
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Signup;
