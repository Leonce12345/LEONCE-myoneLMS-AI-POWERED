import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function OtpVerification() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the email and purpose passed from Login or ForgotPassword
  const email = location.state?.email;
  const purpose = location.state?.purpose || 'login'; // login is default

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      // ============================================================
      // CASE 1: PASSWORD-RESET PURPOSE (from ForgotPassword.jsx)
      // ============================================================
      if (purpose === 'password-reset') {
        const response = await axios.post(`${BACKEND_URL}/api/auth/verify-reset-otp`, {
          email,
          otp,
        }, {
          withCredentials: true,
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        const data = response.data;

        // Store reset session for ForgotPassword step 3
        // Customized keys to match your system: app_*
        sessionStorage.setItem('app_password_reset_email', email);
        if (data.resetToken) {
          sessionStorage.setItem('app_password_reset_token', data.resetToken);
        }

        // Go back to ForgotPassword in step 3 (Set New Password)
        navigate('/forgot-password', { 
          replace: true,
          state: { 
            step: 3, 
            email: email, 
            resetReady: true 
          } 
        });
        return;
      }

      // ============================================================
      // CASE 2: NORMAL LOGIN PURPOSE (your existing logic - untouched)
      // ============================================================
      const response = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, {
        email,
        otp,
      }, {
        withCredentials: true,
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      const data = response.data;

      if (!data.token || !data.user) {
        console.error('OTP verification response is missing the token or user:', data);
        alert('Verification succeeded but the server did not return a valid login session.');
        return;
      }

      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      localStorage.setItem('user', JSON.stringify(data.user));

      const role = String(data.user?.role || 'student').toLowerCase().trim();
      
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'instructor') {
        navigate('/instructor/dashboard', { replace: true });
      } else {
        navigate('/payment-form', { replace: true });
      }

    } catch (error) {
      if (error.response) {
        alert(`Verification failed: ${error.response.data?.error || error.response.data?.message || 'Invalid code'}`);
      } else {
        alert("Could not connect to the server.");
      }
    }
  };

  if (!email) return null;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F9FAFB', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px', width: '100%',
        maxWidth: '440px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', textAlign: 'center', boxSizing: 'border-box'
      }}>
        
        <div style={{
          width: '48px', height: '48px', backgroundColor: '#EFF6FF', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#2563EB'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
          {purpose === 'password-reset' ? 'Verify Reset Code' : 'Enter 2FA Code'}
        </h2>
        <p style={{ fontSize: '15px', color: '#6B7280', margin: '0 0 28px 0' }}>
          {purpose === 'password-reset' ? 'We sent a password reset code to' : 'We sent a 6-digit code to'} <br/><strong>{email}</strong>
        </p>

        <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" 
            placeholder="123456" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            maxLength="6" 
            required 
            style={{ width: '100%', height: '46px', textAlign: 'center', letterSpacing: '4px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '18px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', height: '48px', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
            Verify Code
          </button>
        </form>

        <p style={{ marginTop: '24px', marginBottom: '0', fontSize: '14px', color: '#6B7280' }}>
          Didn't receive it or want to use a different account?{' '}
          <Link to="/login" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}