import React, { useState } from 'react';
import { signin, signup, setAuth } from '../utils/auth';
import { ThemeProvider } from '../components/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/theme.css'; // Import theme variables
import '../styles/login.css'; // Import login styles

interface Props {
  onSuccess: (token: string, username: string) => void;
}

const Login: React.FC<Props> = ({ onSuccess }) => {
  return (
    <ThemeProvider defaultRole="student">
      <LoginContent onSuccess={onSuccess} />
    </ThemeProvider>
  );
};

const LoginContent: React.FC<Props> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (isSignup) {
      if (!username || !password || !firstName || !lastName) {
        setError('Please fill out all fields');
        return;
      }
    } else {
      if (!username || !password) {
        setError('Please enter your email and password');
        return;
      }
    }
    try {
      setLoading(true);
      const { token } = isSignup
        ? await signup(username, password, firstName, lastName)
        : await signin(username, password);
      setAuth(token, username);
      onSuccess(token, username);
    } catch (err: any) {
      setError(err?.message || (isSignup ? 'Signup failed' : 'Login failed'));
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
              <div className="brand-subtitle">Student Portal</div>
            </div>
          </div>
          <h2 className="brand-heading">{isSignup ? 'Create your student account' : 'Access your academic journey'}</h2>
          <p className="brand-description">
            {isSignup
              ? 'Set up your student credentials to access grades, assignments, and academic resources.'
              : 'Sign in to view your grades, assignments, attendance, and connect with your academic community.'
            }
          </p>
        </div>

        {/* Right: Login/Signup Card */}
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">{isSignup ? 'Create Password' : 'Student Login'}</h1>
            <p className="login-subtitle">
              {isSignup ? 'Enter details to set your password' : 'Sign in to access your student dashboard'}
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

            {isSignup && (
              <div className="signup-name-grid">
                <div className="form-group">
                  <label className="form-label">First name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={isSignup}
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
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder={isSignup ? 'Choose a strong password' : '••••••••'}
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
              {loading ? (isSignup ? 'Creating…' : 'Signing in…') : (isSignup ? 'Create Password' : 'Sign In')}
            </button>
          </form>

          <p className="login-footer">
            {isSignup ? (
              <>Already registered? <button className="signup-link" type="button" onClick={() => setIsSignup(false)}>Back to Sign in</button></>
            ) : (
              <>New student? <button className="signup-link" type="button" onClick={() => setIsSignup(true)}>Create your password</button></>
            )}
          </p>
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Login;
