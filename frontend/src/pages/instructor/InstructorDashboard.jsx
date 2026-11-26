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
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex transition-colors duration-300">
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/80 pointer-events-none transition-colors duration-300"></div>
      
      <Sidebar role="instructor" user={user} />

      <div className="flex-1 p-4 overflow-y-auto h-screen relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-6 pl-4">
          <div className="flex items-center gap-2">
            <div className="text-blue-600 dark:text-blue-400 text-4xl font-extrabold flex items-center gap-2">
              LearnHub <span className="text-4xl">🎓</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 ml-4 mt-2 font-medium">Instructor Dashboard</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <Eye className="w-4 h-4" /> View as Student
            </button>
            <button onClick={() => navigate('/instructor/courses/create')} className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md hover:shadow-lg transition">
              <Plus className="w-4 h-4" /> Add New Course
            </button>

            {/* THEME TOGGLE BUTTON */}
            <div onClick={toggleTheme} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Theme
            </div>

            <div className="bg-cyan-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4" /> RBAC Instructor
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center cursor-pointer hover:shadow-md" onClick={() => navigate('/instructor/courses')}>
                <BookOpen className="w-6 h-6 text-cyan-500 mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">My Courses</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{courses.length}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center cursor-pointer hover:shadow-md">
                <Users className="w-6 h-6 text-cyan-500 mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Total Students</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">342</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">= 120 + 95 + 78 + 25 + 24</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center cursor-pointer hover:shadow-md" onClick={() => navigate('/instructor/payments')}>
                <DollarSign className="w-6 h-6 text-cyan-500 mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Total Earnings</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">KES 128000</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">= 45000 + 32000 + 27000 + 12000</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center cursor-pointer hover:shadow-md">
                <Star className="w-6 h-6 text-cyan-500 mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Avg Rating</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">4.8</h3>
                <div className="text-yellow-400 text-xs">★★★★★</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">124 reviews</p>
              </div>
            </div>

            {/* My Courses Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white">My Courses</h3>
                <button onClick={() => navigate('/instructor/courses/create')} className="text-cyan-500 text-sm font-medium flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Add New Course</button>
              </div>
              <table className="w-full text-sm text-left">
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
                          <div className="flex items-center gap-2">
                            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-1.5 rounded text-cyan-500"><BookOpen className="w-4 h-4"/></div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white">{c.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{c.category}</p>
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

            {/* Manage Results */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative">
               <Sparkles className="w-5 h-5 text-cyan-400 absolute top-4 right-4" />
               <h3 className="font-bold text-slate-800 dark:text-white mb-4">Manage Results</h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                   <span className="w-24 font-medium text-slate-700 dark:text-slate-300 text-sm">Biology</span>
                   <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full w-[85%]"></div></div>
                   <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8">85%</span>
                   <button className="border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Upload</button>
                   <button className="border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Download PDF</button>
                   <button className="border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Publish</button>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className="w-24 font-medium text-slate-700 dark:text-slate-300 text-sm">Data Analysis</span>
                   <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full w-[92%]"></div></div>
                   <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8">92%</span>
                   <button className="border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Upload</button>
                   <button className="border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Download PDF</button>
                   <button className="border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Publish</button>
                 </div>
               </div>
            </div>

            {/* Student Questions from AI */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Student Questions from AI</h3>
              <div className="flex justify-between items-start bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex gap-3">
                  <img src="https://i.pravatar.cc/150?img=4" className="w-8 h-8 rounded-full" alt="student"/>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">Explain overfitting?</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Reply to M</p>
                    <button className="mt-2 bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-cyan-600">Answer</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Can you check the titration setup?</p>
                  <button className="mt-2 border border-cyan-500 text-cyan-500 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-cyan-50 dark:hover:bg-cyan-900/30">Reply</button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Recent Enrollments */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Recent Enrollments</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=12" className="w-10 h-10 rounded-full" alt="student"/>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">James</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Today 10:42 AM • Online • Enrolled Data Science</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=33" className="w-10 h-10 rounded-full" alt="student"/>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">David</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Yesterday • Offline • Enrolled Python</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Enrollment Pie */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center">
              <h3 className="font-bold text-slate-800 dark:text-white mb-2 w-full text-left">Course Enrollment Pie</h3>
              <div className="w-40 h-40 relative">
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
                  <div key={i} className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{backgroundColor: e.color}}></span>{e.name}</span>
                    <span className="font-medium text-slate-800 dark:text-white">{e.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mark Attendance Today */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">Mark Attendance Today</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Intro to Data Science</p>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                   <div className="flex items-center gap-2"><img src="https://i.pravatar.cc/150?img=12" className="w-6 h-6 rounded-full" alt="j"/><span className="text-sm font-medium text-slate-700 dark:text-slate-300">James</span></div>
                   <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded font-medium">Present</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                   <div className="flex items-center gap-2"><img src="https://i.pravatar.cc/150?img=33" className="w-6 h-6 rounded-full" alt="d"/><span className="text-sm font-medium text-slate-700 dark:text-slate-300">David</span></div>
                   <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2 py-0.5 rounded font-medium">Absent</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                   <div className="flex items-center gap-2"><img src="https://i.pravatar.cc/150?img=5" className="w-6 h-6 rounded-full" alt="m"/><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mary</span></div>
                   <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs px-2 py-0.5 rounded font-medium">Late</span>
                </div>
              </div>
              <button className="w-full bg-cyan-500 text-white font-medium py-2 rounded-xl hover:bg-cyan-600 transition">Save</button>
            </div>

            {/* Results Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Results Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700 dark:text-slate-300 w-4">A</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded h-4 relative"><div className="bg-cyan-500 h-4 rounded" style={{width: '45%'}}></div></div>
                  <span className="text-sm font-semibold w-8 text-slate-700 dark:text-slate-300">45%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700 dark:text-slate-300 w-4">B</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded h-4 relative"><div className="bg-cyan-400 h-4 rounded" style={{width: '35%'}}></div></div>
                  <span className="text-sm font-semibold w-8 text-slate-700 dark:text-slate-300">35%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700 dark:text-slate-300 w-4">C</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded h-4 relative"><div className="bg-cyan-300 h-4 rounded" style={{width: '20%'}}></div></div>
                  <span className="text-sm font-semibold w-8 text-slate-700 dark:text-slate-300">20%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Last Active</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Grace</p>
                <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Today 10:32 AM • Online</p>
              </div>
            </div>

            {/* Course & Module Creation */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">Course & Module Creation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Real-time Chat<br/>Live discussions</p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500"/> Enrollment Tracking</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500"/> Progress Monitoring</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500"/> Grading</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800"><Video className="w-3 h-3"/> Video Upload</button>
                <button className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800"><Upload className="w-3 h-3"/> PDF Upload</button>
              </div>
            </div>

            {/* AI Teaching Assistant */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative">
              <Sparkles className="w-5 h-5 text-cyan-400 absolute top-4 right-4" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">AI Teaching Assistant</h3>
              <ul className="text-xs text-slate-500 dark:text-slate-400 mb-4 space-y-1 list-disc pl-4">
                <li>Vector Search</li>
                <li>Upload PDFs</li>
                <li>Extract Text</li>
                <li>Chunk Embeddings</li>
                <li>LLM answer only from notes</li>
              </ul>
              <div className="relative">
                <input type="text" placeholder="Ask me anything..." className="w-full pl-3 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-cyan-400 text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-cyan-500 text-white p-1.5 rounded-lg hover:bg-cyan-600 transition"><Send className="w-3 h-3" /></button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;