import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { secureFetch } from '../utils/authApi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetReady, setResetReady] = useState(false);

  useEffect(() => {
    const stateEmail = location.state?.email;
    const purpose = location.state?.purpose;
    if (stateEmail) setEmail(stateEmail);
    else {
      const stored = sessionStorage.getItem('app_password_reset_email');
      if (stored) setEmail(stored);
    }
    if (purpose === 'password-reset' || sessionStorage.getItem('app_password_reset_token')) {
      setResetReady(true);
    }
  }, [location.state]);

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, checks: {} };
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    return { score: Object.values(checks).filter(Boolean).length, checks };
  }, [password]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return alert('Enter email');
    setIsLoading(true);
    try {
      await secureFetch('/api/auth/forgot-password', { method: 'POST', body: { email: cleanEmail } });
      sessionStorage.setItem('app_password_reset_email', cleanEmail);
      navigate('/otp-verification', { replace: true, state: { email: cleanEmail, purpose: 'password-reset' } });
    } catch (err) { alert(err.message); }
    finally { setIsLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!email ||!resetReady) { navigate('/login'); return; }
    if (password!== confirmPassword) return alert('Passwords do not match');
    if (passwordStrength.score < 4) return alert('Weak password: need 8+, uppercase, number, special');
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('app_password_reset_token') || '';
      await secureFetch('/api/auth/reset-password', { method: 'POST', body: { email: email.trim().toLowerCase(), newPassword: password,...(token? { resetToken: token } : {}) } });
      localStorage.clear();
      sessionStorage.removeItem('app_password_reset_email');
      sessionStorage.removeItem('app_password_reset_token');
      alert('Password reset successful!');
      navigate('/login', { replace: true });
    } catch (err) { alert(err.message); }
    finally { setIsLoading(false); }
  };

  const cardStyle = { maxWidth: '420px', width: '100%', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '32px', margin: '20px' };
  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };

  if (resetReady) {
    const isResetMode = location.pathname.includes('reset') || location.state?.purpose === 'password-reset' || sessionStorage.getItem('app_password_reset_token');
    if (isResetMode) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
          <div style={cardStyle}>
            <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>Reset Password</h2>
            <p style={{ textAlign: 'center', color: '#2563eb', fontSize: '14px' }}>{email}</p>
            <form onSubmit={handleResetPassword} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <input style={inputStyle} type={showPassword? 'text' : 'password'} placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>{showPassword? 'Hide' : 'Show'}</button>
              </div>
              <div style={{ position: 'relative' }}>
                <input style={inputStyle} type={showConfirmPassword? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>{showConfirmPassword? 'Hide' : 'Show'}</button>
              </div>
              <button style={btnStyle} type="submit" disabled={isLoading}>{isLoading? 'Resetting...' : 'Reset Password'}</button>
            </form>
          </div>
        </div>
      );
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold' }}>Forgot Password</h2>
        <p style={{ textAlign: 'center', color: '#666', marginTop: '8px' }}>Enter your email and we'll send you a verification code.</p>
        <form onSubmit={handleRequestReset} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input style={inputStyle} type="email" placeholder="leoncemucho@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <button style={btnStyle} type="submit" disabled={isLoading}>{isLoading? 'Sending...' : 'Send Code'}</button>
          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            <span>Remember your password? </span><Link to="/login" style={{ color: '#2563eb', fontWeight: '600' }}>Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;