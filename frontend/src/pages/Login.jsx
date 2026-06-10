import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import './Login.css';

export default function Login() {
  const [tab, setTab]         = useState('login'); // 'login' | 'register'
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const { save, profile, isLoggedIn } = useProfile();
  const navigate = useNavigate();

  /* ── Login form ── */
  const [loginEmail, setLoginEmail]   = useState('');
  const [loginPass,  setLoginPass]    = useState('');

  /* ── Register form ── */
  const [regFirst,  setRegFirst]  = useState('');
  const [regLast,   setRegLast]   = useState('');
  const [regEmail,  setRegEmail]  = useState('');
  const [regPhone,  setRegPhone]  = useState('');
  const [regPass,   setRegPass]   = useState('');
  const [regPass2,  setRegPass2]  = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    // Check stored accounts
    const accounts = JSON.parse(localStorage.getItem('mobix_accounts') || '[]');
    const found = accounts.find(a => a.email === loginEmail && a.password === loginPass);
    if (!found) {
      setError('ელ-ფოსტა ან პაროლი არასწორია');
      return;
    }
    save({ firstName: found.firstName, lastName: found.lastName, email: found.email, phone: found.phone });
    navigate('/profile');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (regPass !== regPass2) { setError('პაროლები არ ემთხვევა'); return; }
    if (regPass.length < 6)   { setError('პაროლი მინ. 6 სიმბოლო'); return; }
    const accounts = JSON.parse(localStorage.getItem('mobix_accounts') || '[]');
    if (accounts.find(a => a.email === regEmail)) {
      setError('ეს ელ-ფოსტა უკვე რეგისტრირებულია');
      return;
    }
    const newAccount = { firstName: regFirst, lastName: regLast, email: regEmail, phone: regPhone, password: regPass };
    localStorage.setItem('mobix_accounts', JSON.stringify([...accounts, newAccount]));
    save({ firstName: regFirst, lastName: regLast, email: regEmail, phone: regPhone });
    setSuccess('რეგისტრაცია წარმატებით დასრულდა!');
    setTimeout(() => navigate('/profile'), 1000);
  };

  if (isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-box">
          <div className="already-logged">
            <div className="already-avatar">{profile.firstName?.[0]}{profile.lastName?.[0]}</div>
            <p>გამარჯობა, <strong>{profile.firstName}!</strong></p>
            <p className="already-sub">უკვე შესული ხარ სისტემაში</p>
            <Link to="/profile" className="login-submit-btn">პროფილზე გადასვლა</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-box">
        {/* Logo */}
        <Link to="/" className="login-logo">Mobi<span>X</span></Link>

        {/* Tabs */}
        <div className="login-tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError(''); }}>
            შესვლა
          </button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError(''); }}>
            რეგისტრაცია
          </button>
          <div className={`tab-indicator ${tab === 'register' ? 'right' : ''}`} />
        </div>

        {error   && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        {/* ── Login ── */}
        {tab === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
              <label>ელ-ფოსტა</label>
              <input type="email" placeholder="example@mail.com" value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)} required />
            </div>
            <div className="login-field">
              <label>პაროლი</label>
              <input type="password" placeholder="••••••••" value={loginPass}
                onChange={e => setLoginPass(e.target.value)} required />
            </div>
            <button type="submit" className="login-submit-btn">შესვლა</button>
            <p className="login-switch">
              ანგარიში არ გაქვს?{' '}
              <button type="button" onClick={() => setTab('register')}>დარეგისტრირდი</button>
            </p>
          </form>
        )}

        {/* ── Register ── */}
        {tab === 'register' && (
          <form className="login-form" onSubmit={handleRegister}>
            <div className="login-row">
              <div className="login-field">
                <label>სახელი</label>
                <input type="text" placeholder="გიორგი" value={regFirst}
                  onChange={e => setRegFirst(e.target.value)} required />
              </div>
              <div className="login-field">
                <label>გვარი</label>
                <input type="text" placeholder="მაისურაძე" value={regLast}
                  onChange={e => setRegLast(e.target.value)} required />
              </div>
            </div>
            <div className="login-field">
              <label>ელ-ფოსტა</label>
              <input type="email" placeholder="example@mail.com" value={regEmail}
                onChange={e => setRegEmail(e.target.value)} required />
            </div>
            <div className="login-field">
              <label>ტელეფონი</label>
              <input type="tel" placeholder="+995 5XX XXX XXX" value={regPhone}
                onChange={e => setRegPhone(e.target.value)} />
            </div>
            <div className="login-field">
              <label>პაროლი</label>
              <input type="password" placeholder="მინ. 6 სიმბოლო" value={regPass}
                onChange={e => setRegPass(e.target.value)} required />
            </div>
            <div className="login-field">
              <label>პაროლის დადასტურება</label>
              <input type="password" placeholder="••••••••" value={regPass2}
                onChange={e => setRegPass2(e.target.value)} required />
            </div>
            <button type="submit" className="login-submit-btn">რეგისტრაცია</button>
            <p className="login-switch">
              უკვე გაქვს ანგარიში?{' '}
              <button type="button" onClick={() => setTab('login')}>შესვლა</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
