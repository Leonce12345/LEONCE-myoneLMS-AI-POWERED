// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  // 1. Immediately capture token from URL query params on mount
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');

  if (urlToken) {
    // Save tokens immediately
    localStorage.setItem('token', urlToken);
    localStorage.setItem('jwt_token', urlToken);

    try {
      // Decode JWT payload to build the user object
      const payloadBase64 = urlToken.split('.')[1];
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
      console.error("Error decoding JWT from URL:", err);
    }

    // Clean the ?token=... from the browser URL bar
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // 2. Retrieve token and user from localStorage
  const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
  const storedUser = localStorage.getItem('user_data') || localStorage.getItem('user');
  
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  // 3. If missing token or user, bounce to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 4. Role validation check
  const userRole = String(user.role || '').toLowerCase().trim();
  const allowed = allowedRoles ? allowedRoles.map(r => String(r).toLowerCase().trim()) : [];

  if (allowedRoles && allowed.length > 0 && !allowed.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}