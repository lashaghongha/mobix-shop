import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'mobixadmin';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'MobixAdmin2024';

export function isAdminLoggedIn() {
  return localStorage.getItem('admin_auth') === 'true';
}

export default function AdminLogin() {
  const [user, setUser]   = useState('');
  const [pass, setPass]   = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem('admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('მომხმარებელი ან პაროლი არასწორია');
    }
  };

  return (
    <div className="adm-login-bg">
      <div className="adm-login-box">
        <div className="adm-login-logo">
          Mobi<span style={{ color: '#c0152a', fontSize: '1.2em' }}>X</span>
          <span className="adm-login-tag">Admin</span>
        </div>
        <h2 className="adm-login-title">შესვლა</h2>

        {error && (
          <div className="adm-login-error">{error}</div>
        )}

        <form onSubmit={handleLogin} className="adm-login-form">
          <div className="adm-field">
            <label>მომხმარებელი</label>
            <input
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="mobixadmin"
              autoFocus
            />
          </div>
          <div className="adm-field">
            <label>პაროლი</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="adm-login-btn">შესვლა →</button>
        </form>
      </div>
    </div>
  );
}
