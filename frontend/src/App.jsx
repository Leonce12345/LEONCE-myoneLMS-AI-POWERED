import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import OtpVerification from './Auth/OtpVerification';
import ForgotPassword from './Auth/ForgotPassword';
import './App.css';

// Security & Redirects
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';
import SessionManager from './components/SessionManager'; // <-- ADDED: Session Timer

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminPayments from './pages/admin/AdminPayments';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import MyCoursesInstructor from './pages/instructor/MyCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import CourseDetailInstructor from './pages/instructor/CourseDetailInstructor';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyCoursesStudent from './pages/student/MyCourses';
import CourseDetailStudent from './pages/student/CourseDetailStudent';
import StudentPayments from './pages/student/Payments';
import StudentCertificates from './pages/student/Certificates'; 

// Shared Pages (FIXED CASE: 'Shared' instead of 'shared')
import Attendance from './pages/Shared/Attendance';
import Assignments from './pages/Shared/Assignments';
import Results from './pages/Shared/Results';
import Messages from './pages/Shared/Messages';
import Profile from './pages/Shared/Profile';
import VirtualLab from './pages/Shared/VirtualLab';
import AIAssistant from './pages/Shared/AIAssistant';

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Access Denied</h1>
      <p className="text-slate-600 mb-6">Your assigned role does not have permission to view this page.</p>
      <button onClick={() => window.history.back()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Go Back
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <SessionManager /> {/* <-- ADDED: Session Timer Component */}
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        
        {/* ================= ADMIN PORTAL ================= */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          {/* Shared routes accessed by admin */}
          <Route path="/admin/attendance" element={<Attendance />} />
          <Route path="/admin/assignments" element={<Assignments />} />
          <Route path="/admin/results" element={<Results />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/virtual-lab" element={<VirtualLab />} />
          <Route path="/admin/ai-assistant" element={<AIAssistant />} />
        </Route>

        {/* ================= INSTRUCTOR PORTAL ================= */}
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/courses" element={<MyCoursesInstructor />} />
          <Route path="/instructor/courses/create" element={<CreateCourse />} />
          <Route path="/instructor/courses/:id" element={<CourseDetailInstructor />} />
          {/* Shared routes accessed by instructor */}
          <Route path="/instructor/attendance" element={<Attendance />} />
          <Route path="/instructor/assignments" element={<Assignments />} />
          <Route path="/instructor/results" element={<Results />} />
          <Route path="/instructor/messages" element={<Messages />} />
          <Route path="/instructor/profile" element={<Profile />} />
          <Route path="/instructor/virtual-lab" element={<VirtualLab />} />
          <Route path="/instructor/ai-assistant" element={<AIAssistant />} />
        </Route>

        {/* ================= STUDENT PORTAL ================= */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<MyCoursesStudent />} />
          <Route path="/student/courses/:id" element={<CourseDetailStudent />} />
          <Route path="/student/payments" element={<StudentPayments />} />
          <Route path="/student/certificates" element={<StudentCertificates />} />
          
          {/* Shared routes accessed by student */}
          <Route path="/student/assignments" element={<Assignments />} />
          <Route path="/student/results" element={<Results />} />
          <Route path="/student/messages" element={<Messages />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/virtual-lab" element={<VirtualLab />} />
          <Route path="/student/ai-assistant" element={<AIAssistant />} />
        </Route>
        
        <Route path="*" element={<div className="text-center mt-20"><h1 className="text-3xl font-bold">404 - Page Not Found</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;