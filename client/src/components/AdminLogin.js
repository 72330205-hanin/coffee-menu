import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import '../styles/AdminLogin.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/api/admin/login`, {
        password
      });

      if (res.data.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Wrong password. Please try again.');
    }
  };

  return (
    <section className="admin-login-page">
      <div className="admin-login-container">
        <h1 className="admin-login-title">Welcome Back</h1>
        <p className="admin-login-subtitle">
          Enter your password to access the admin panel
        </p>

        <div className="admin-login-card">
          <form onSubmit={handleSubmit}>
            <label className="admin-login-label">Password</label>

            <div className="admin-password-wrapper">
              <span className="admin-input-icon">
                <LockOutlinedIcon />
              </span>

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                className="admin-login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="admin-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <VisibilityOutlinedIcon />
                ) : (
                  <VisibilityOffOutlinedIcon />
                )}
              </button>
            </div>

            {error && <p className="admin-login-error">{error}</p>}

            <button type="submit" className="admin-login-btn">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;