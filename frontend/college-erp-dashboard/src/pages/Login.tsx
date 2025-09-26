import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signin, setAuth } from '../utils/auth';
import { ThemeProvider } from '../components/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/theme.css'; // Import theme variables
import '../styles/login.css'; // Import login styles

const LoginContent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Detect role from URL path
  const getCurrentRole = () => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/faculty')) return 'faculty';
    if (path.startsWith('/student')) return 'student';
    return 'admin';
  };

  const currentRole = getCurrentRole();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError('Please enter your email and password');
      return;
    }
    try {
      setLoading(true);
      const { token } = await signin(username, password);
      setAuth(token, username);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed');
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
              <div className="brand-subtitle">
                {currentRole === 'admin' ? 'Admin Portal' :
                 currentRole === 'faculty' ? 'Faculty Portal' : 'Student Portal'}
              </div>
            </div>
          </div>
          <h2 className="brand-heading">
            {currentRole === 'admin' ? 'Manage your institution seamlessly' :
             currentRole === 'faculty' ? 'Teach, assess and communicate effortlessly' :
             'Access your academic journey'}
          </h2>
          <p className="brand-description">
            {currentRole === 'admin'
              ? 'Access academic operations, monitor performance and keep data in sync across departments.'
              : currentRole === 'faculty'
              ? 'Upload materials, track attendance and manage class activities in one place.'
              : 'Sign in to view your grades, assignments, attendance, and connect with your academic community.'}
          </p>
        </div>

        {/* Right: Login Card */}
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">
              {currentRole === 'admin' ? 'Admin Login' :
               currentRole === 'faculty' ? 'Faculty Login' : 'Student Login'}
            </h1>
            <p className="login-subtitle">
              {currentRole === 'admin' ? 'Sign in to access the ERP dashboard' :
               currentRole === 'faculty' ? 'Sign in to access the faculty dashboard' :
               'Sign in to access your student dashboard'}
            </p>
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
                autoComplete="username"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="login-footer">
            Need an account? Ask the administrator to register your email in the system, then{' '}
            <Link to="/signup" className="signup-link">create your password</Link> via the signup flow.
          </p>
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
};

const Login: React.FC = () => {
  return (
    <ThemeProvider defaultRole="admin">
      <LoginContent />
    </ThemeProvider>
  );
};

export default Login;
