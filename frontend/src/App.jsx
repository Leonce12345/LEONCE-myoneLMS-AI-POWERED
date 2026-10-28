import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import OtpVerification from './Auth/OtpVerification';
import ForgotPassword from './Auth/ForgotPassword'; // ===== NEW IMPORT
import './App.css';

// Role-Specific Dashboards
import AdminDashboard from './pages/admin/Dashboard';
import InstructorDashboard from './pages/instructor/Dashboard';
import StudentDashboard from './pages/student/Dashboard';

// Security Component
import ProtectedRoute from './components/ProtectedRoute';

function Unauthorized() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ color: '#ef4444', fontSize: '36px' }}>403 - Access Denied</h1>
      <p style={{ color: '#64748b' }}>Your assigned role does not have permission to view this page.</p>
      <button 
        onClick={() => window.history.back()} 
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px' }}
      >
        Go Back
      </button>
    </div>
  );
}

function DashboardRedirect() {
  // Synchronously extract token from URL if redirected from Social Login (Google/Facebook/TikTok)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('jwt_token', token);
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const userObj = {
        _id: decodedPayload.id,
        id: decodedPayload.id,
        email: decodedPayload.email,
        name: decodedPayload.name,
        role: decodedPayload.role
      };
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('user_data', JSON.stringify(userObj));
    } catch (err) {
      console.error("Error parsing JWT payload in DashboardRedirect:", err);
    }
  }

  const storedUser = localStorage.getItem('user_data') || localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role?.toLowerCase()?.trim();

  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'instructor') return <Navigate to="/instructor/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ===== NEW ROUTE ===== */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* PAYMENT DISABLED - Redirect any payment link to dashboard */}
        <Route path="/payment-form" element={<Navigate to="/student/dashboard" replace />} />
        
        {/* Admin Portal */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Instructor Portal */}
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        </Route>

        {/* Student Portal */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        <Route path="/dashboard" element={<DashboardRedirect />} />
        
        {/* 404 Route */}
        <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '100px' }}><h1>404 - Page Not Found</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;