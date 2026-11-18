import React from 'react';
import { Navigate } from 'react-router-dom';

const DashboardRedirect = () => {
  // 1. Synchronously extract token from URL if redirected from Social Login
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

  // 2. Read user data from local storage
  const storedUser = localStorage.getItem('user_data') || localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role?.toLowerCase()?.trim();

  // 3. Redirect based on role
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (role === 'instructor') {
    return <Navigate to="/instructor/dashboard" replace />;
  }
  
  // Default to student dashboard if no role is found or role is student
  // If no user is found at all, you might want to redirect to login instead:
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/student/dashboard" replace />;
};

export default DashboardRedirect;