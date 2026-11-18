import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, FileText, BarChart3, 
  FlaskConical, CreditCard, MessageSquare, User, Settings, 
  HelpCircle, LogOut, ShieldCheck, Video, Upload, Sparkles,
  BellRing
} from 'lucide-react';

const Sidebar = ({ role, user }) => {
  // Define menus based on role
  const menus = {
    admin: [
      { name: 'Switch Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { type: 'label', text: 'Main' },
      { name: 'Attendance', icon: FileText, path: '/admin/attendance' },
      { name: 'Assignments', icon: FileText, path: '/admin/assignments' },
      { name: 'Results', icon: BarChart3, path: '/admin/results' },
      { name: 'Virtual Lab', icon: FlaskConical, path: '/admin/virtual-lab' },
      { name: 'Payments STK', icon: CreditCard, path: '/admin/payments' },
      { name: 'Messages', icon: MessageSquare, path: '/admin/messages' },
      { name: 'AI Assistant', icon: Sparkles, path: '/admin/ai-assistant' },
      { type: 'label', text: 'Admin' },
      { name: 'Settings', icon: Settings, path: '/admin/settings', badge: '8' },
      { name: 'Profile', icon: User, path: '/admin/profile' },
      { name: 'RBAC System', icon: ShieldCheck, path: '/admin/rbac' },
    ],
    instructor: [
      { name: 'Attendance', icon: FileText, path: '/instructor/attendance' },
      { name: 'My Courses', icon: BookOpen, path: '/instructor/courses' },
      { name: 'Students', icon: Users, path: '/instructor/students' },
      { name: 'Assignments', icon: FileText, path: '/instructor/assignments' },
      { name: 'Results', icon: BarChart3, path: '/instructor/results' },
      { name: 'Virtual Lab', icon: FlaskConical, path: '/instructor/virtual-lab' },
      { name: 'Payments', icon: CreditCard, path: '/instructor/payments' },
      { name: 'Messages', icon: MessageSquare, path: '/instructor/messages' },
      { name: 'Profile', icon: User, path: '/instructor/profile' },
      { name: 'View Student', icon: LayoutDashboard, path: '/student/dashboard' },
      { name: 'Help & Support', icon: HelpCircle, path: '/instructor/help' },
    ],
    student: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
      { name: 'My Courses', icon: BookOpen, path: '/student/courses' },
      { name: 'Assignments', icon: FileText, path: '/student/assignments' },
      { name: 'Exams & Results', icon: BarChart3, path: '/student/results' },
      { name: 'Virtual Lab', icon: FlaskConical, path: '/student/virtual-lab' },
      { name: 'Payments', icon: CreditCard, path: '/student/payments' },
      { name: 'Messages', icon: MessageSquare, path: '/student/messages' },
      { name: 'Profile', icon: User, path: '/student/profile' },
    ]
  };

  return (
    <div className="w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 flex flex-col h-[calc(100vh-2rem)] m-4 overflow-y-auto border border-white/50">
      
      {/* Instructor Profile Card */}
      {role === 'instructor' && (
        <div className="flex flex-col items-center mb-6 pt-4 border-b pb-4">
          <img src={user?.avatar || "https://i.pravatar.cc/150?img=5"} alt="Profile" className="w-20 h-20 rounded-full border-4 border-blue-400 mb-2 object-cover" />
          <h3 className="font-bold text-slate-800 text-lg">{user?.name || 'Sarah Njoki'}</h3>
          <span className="text-blue-500 text-xs font-semibold uppercase tracking-wider">Instructor</span>
        </div>
      )}

      {/* Student RBAC Badge */}
      {role === 'student' && (
        <div className="mb-4">
          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-sm w-full block text-center border border-blue-200">RBAC • Student</span>
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {menus[role].map((item, index) => {
          if (item.type === 'label') {
            return <div key={index} className="text-xs font-bold text-slate-400 mt-4 mb-2 uppercase tracking-wider pl-2">{item.text}</div>;
          }
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-cyan-400 text-white font-medium shadow-md shadow-cyan-200' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </div>
              {item.badge && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;