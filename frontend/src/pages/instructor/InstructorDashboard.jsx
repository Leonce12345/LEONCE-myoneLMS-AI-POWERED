import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { useTheme } from '../../hooks/useTheme';
import { 
  Eye, Plus, Moon, Sun, ShieldCheck, BookOpen, Users, DollarSign, Star, 
  Edit, Video, Upload, CheckCircle2, Sparkles, Send
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Sarah Njoki', role: 'instructor' };

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/courses/instructor/${user._id || user.id}`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user.id || user._id) fetchCourses();
  }, [user.id, user._id]);

  const enrollmentData = [
    { name: 'Data Science', value: 120, color: '#0ea5e9' },
    { name: 'Python', value: 95, color: '#38bdf8' },
    { name: 'UX', value: 78, color: '#7dd3fc' },
    { name: 'Biology', value: 25, color: '#bae6fd' },
    { name: 'Data Analysis', value: 24, color: '#e0f2fe' },
  ];

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex flex-col lg:flex-row transition-colors duration-300">
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/80 pointer-events-none transition-colors duration-300"></div>
      
      <Sidebar role="instructor" user={user} />

      <div className="flex-1 w-full min-w-0 p-4 lg:p-6 overflow-y-auto h-screen relative z-10">
        
        {/* CHANGED: Header responsive */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="text-blue-600 dark:text-blue-400 text-3xl lg:text-4xl font-extrabold flex items-center gap-2">
              LearnHub <span className="text-3xl lg:text-4xl">🎓</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 hidden md:block ml-4 mt-2 font-medium">Instructor Dashboard</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <Eye className="w-4 h-4" /> <span className="hidden sm:inline">View as Student</span>
            </button>
            <button onClick={() => navigate('/instructor/courses/create')} className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md hover:shadow-lg transition">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add New Course</span>
            </button>

            <div onClick={toggleTheme} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} <span className="hidden sm:inline">Theme</span>
            </div>

            <div className="bg-cyan-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4" /> <span className="hidden sm:inline">RBAC Instructor</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* CHANGED: Stats Grid responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center cursor-pointer hover:shadow-md min-w-0" onClick={() => navigate('/instructor/courses')}>
                <BookOpen className="w-6 h-6 text-cyan-500 mb-2 shrink-0" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">My Courses</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate">{courses.length}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Active</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center cursor-pointer hover:shadow-md min-w-0">
                <Users className="w-6 h-6 text-cyan-500 mb-2 shrink-0" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">Total Students</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate">342</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">= 120 + 95...</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center cursor-pointer hover:shadow-md min-w-0" onClick={() => navigate('/instructor/payments')}>
                <DollarSign className="w-6 h-6 text-cyan-500 mb-2 shrink-0" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">Total Earnings</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate">KES 128000</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">= 45000...</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center cursor-pointer hover:shadow-md min-w-0">
                <Star className="w-6 h-6 text-cyan-500 mb-2 shrink-0" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">Avg Rating</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate">4.8</h3>
                <div className="text-yellow-400 text-xs truncate">★★★★★</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">124 reviews</p>
              </div>
            </div>

            {/* CHANGED: Table responsive wrapper */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h3 className="font-bold text-slate-800 dark:text-white">My Courses</h3>
                <button onClick={() => navigate('/instructor/courses/create')} className="text-cyan-500 text-sm font-medium flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Add Course</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[500px]">
                  <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Course</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Students</th>
                      <th className="px-4 py-3 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan="4" className="text-center py-4 text-slate-500 dark:text-slate-400">Loading courses...</td></tr>
                    ) : courses.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-4 text-slate-500 dark:text-slate-400">No courses created yet.</td></tr>
                    ) : (
                      courses.map((c) => (
                        <tr key={c._id} className="border-b last:border-0 border-slate-100 dark:border-slate-800">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="bg-cyan-50 dark:bg-cyan-900/30 p-1.5 rounded text-cyan-500 shrink-0"><BookOpen className="w-4 h-4"/></div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-white truncate">{c.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === 'Draft' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>{c.status || 'Published'}</span>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">0</td>
                          <td className="px-4 py-3">
                            <button onClick={() => navigate(`/instructor/courses/${c._id}`)} className="border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Edit</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative min-w-0">
               <Sparkles className="w-5 h-5 text-cyan-400 absolute top-4 right-4 shrink-0" />
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 truncate">Manage Results</h3>
               <div className="space-y-4">
                 <div className="flex flex-wrap items-center gap-4">
                   <span className="w-24 font-medium text-slate-700 dark:text-slate-300 text-sm truncate">Biology</span>
                   <div className="flex-1 min-w-[100px] bg-slate-100 dark:bg-slate-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full w-[85%]"></div></div>
                   <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8">85%</span>
                   <button className="border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Upload</button>
                 </div>
                 <div className="flex flex-wrap items-center gap-4">
                   <span className="w-24 font-medium text-slate-700 dark:text-slate-300 text-sm truncate">Data Analysis</span>
                   <div className="flex-1 min-w-[100px] bg-slate-100 dark:bg-slate-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full w-[92%]"></div></div>
                   <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8">92%</span>
                   <button className="border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Upload</button>
                 </div>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 truncate">Student Questions from AI</h3>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex gap-3 min-w-0">
                  <img src="https://i.pravatar.cc/150?img=4" className="w-8 h-8 rounded-full shrink-0" alt="student"/>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">Explain overfitting?</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Reply to M</p>
                    <button className="mt-2 bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-cyan-600">Answer</button>
                  </div>
                </div>
                <div className="text-left md:text-right min-w-0">
                  <p className="text-sm text-slate-600 dark:text-slate-300 truncate">Can you check the setup?</p>
                  <button className="mt-2 border border-cyan-500 text-cyan-500 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-cyan-50 dark:hover:bg-cyan-900/30">Reply</button>
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 truncate">Recent Enrollments</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src="https://i.pravatar.cc/150?img=12" className="w-10 h-10 rounded-full shrink-0" alt="student"/>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">James</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Today • Enrolled Data Science</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <img src="https://i.pravatar.cc/150?img=33" className="w-10 h-10 rounded-full shrink-0" alt="student"/>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">David</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Yesterday • Enrolled Python</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white mb-2 w-full text-left truncate">Course Enrollment Pie</h3>
              <div className="w-40 h-40 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={enrollmentData} innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                      {enrollmentData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full mt-4 space-y-2">
                {enrollmentData.map((e, i) => (
                  <div key={i} className="flex justify-between text-xs text-slate-600 dark:text-slate-300 min-w-0">
                    <span className="flex items-center gap-2 truncate"><span className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: e.color}}></span><span className="truncate">{e.name}</span></span>
                    <span className="font-medium text-slate-800 dark:text-white shrink-0">{e.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white mb-1 truncate">Mark Attendance Today</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 truncate">Intro to Data Science</p>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 min-w-0">
                   <div className="flex items-center gap-2 min-w-0"><img src="https://i.pravatar.cc/150?img=12" className="w-6 h-6 rounded-full shrink-0" alt="j"/><span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">James</span></div>
                   <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded font-medium shrink-0">Present</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 min-w-0">
                   <div className="flex items-center gap-2 min-w-0"><img src="https://i.pravatar.cc/150?img=33" className="w-6 h-6 rounded-full shrink-0" alt="d"/><span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">David</span></div>
                   <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2 py-0.5 rounded font-medium shrink-0">Absent</span>
                </div>
              </div>
              <button className="w-full bg-cyan-500 text-white font-medium py-2 rounded-xl hover:bg-cyan-600 transition truncate">Save</button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 truncate">Results Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-bold text-slate-700 dark:text-slate-300 w-4 shrink-0">A</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded h-4 relative min-w-[50px]"><div className="bg-cyan-500 h-4 rounded" style={{width: '45%'}}></div></div>
                  <span className="text-sm font-semibold w-8 shrink-0 text-slate-700 dark:text-slate-300">45%</span>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-bold text-slate-700 dark:text-slate-300 w-4 shrink-0">B</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded h-4 relative min-w-[50px]"><div className="bg-cyan-400 h-4 rounded" style={{width: '35%'}}></div></div>
                  <span className="text-sm font-semibold w-8 shrink-0 text-slate-700 dark:text-slate-300">35%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;