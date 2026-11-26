import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SessionManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);
  
  // 1 minute = 60,000 milliseconds. 
  // Change this to (15 * 60 * 1000) for 15 minutes in production.
  const IDLE_TIMEOUT = 60 * 1000; 

  const logout = () => {
    // 1. Clear all auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_data');
    
    // 2. Alert the user (you can replace this with a custom toast/modal later)
    alert("Session Expired: You have been logged out due to 1 minute of inactivity.");
    
    // 3. Redirect to login
    navigate('/login');
  };

  const resetTimer = () => {
    // Don't run timer if on auth pages or if user isn't logged in
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
    const authPages = ['/login', '/register', '/forgot-password', '/otp-verification'];
    
    if (!token || authPages.includes(location.pathname)) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Reset the timer on every activity
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, IDLE_TIMEOUT);
  };

  useEffect(() => {
    // List of events that count as "activity"
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize the timer on mount / route change
    resetTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]); // Re-run when the route changes

  return null; // This component doesn't render anything visually
};

export default SessionManager;