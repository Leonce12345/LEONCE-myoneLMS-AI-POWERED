import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { useTheme } from '../../hooks/useTheme';
import { 
  Search, Bell, Moon, Sun, User, Users, FileText, DollarSign, 
  Video, Upload, Send, Settings, CheckCircle2, XCircle, BookOpen, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Alex Mwangi', role: 'admin', avatar: 'https://i.pravatar.cc/150?img=11' };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], courses: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Dashboard Stats State
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalRevenue: 0,
    recentTransactions: [],
    revenueData: []
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // AI CHAT STATES
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ users: [], courses: [] });
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/search?q=${searchQuery}`);
        setSearchResults(res.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (type, query) => {
    setShowDropdown(false);
    setSearchQuery('');
    if (type === 'user') navigate(`/admin/users?q=${query}`);
    if (type === 'course') navigate(`/admin/courses?q=${query}`);
  };

  // AI CHAT FUNCTION
  const handleAiChat = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const res = await api.post('/ai/general-chat', { question: aiQuery });
      setAiResponse(res.data.answer);
    } catch (error) {
      setAiResponse("Sorry, I couldn't connect to the AI right now.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Static data remains for charts not yet tied to DB logic
  const aiUsageData = [
    { name: 'Mon', value: 40 }, { name: 'Tue', value: 60 }, { name: 'Wed', value: 80 },
    { name: 'Thu', value: 50 }, { name: 'Fri', value: 90 }, { name: 'Sat', value: 60 }, { name: 'Sun', value: 70 },
  ];
  const attendanceData = [
    { name: 'Present', value: 87, color: '#06b6d4' },
    { name: 'Absent', value: 8, color: '#f59e0b' },
    { name: 'Late', value: 5, color: '#eab308' },
  ];
  const paymentsData = [
    { name: 'Paid', value: 92, color: '#06b6d4' },
    { name: 'Pending', value: 5, color: '#e0f2fe' },
    { name: 'Failed', value: 3, color: '#94a3b8' },
  ];
  const resultsData = [
    { name: 'A', value: 45, color: '#0ea5e9' },
    { name: 'B', value: 35, color: '#38bdf8' },
    { name: 'C', value: 20, color: '#7dd3fc' },
  ];

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex flex-col lg:flex-row transition-colors duration-300">
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/80 pointer-events-none transition-colors duration-300"></div>
      
      <Sidebar role="admin" user={user} />

      <div className="flex-1 w-full min-w-0 p-4 lg:p-6 overflow-y-auto h-screen relative z-10">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-sm border border-white/50 dark:border-slate-800 gap-4 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text text-2xl lg:text-3xl font-extrabold flex items-center gap-2">
              <span className="text-cyan-500 text-2xl lg:text-3xl">🎓</span> LearnHub
            </div>
          </div>
          
          <div className="relative w-full lg:w-96 z-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search students/courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.length >= 2) setShowDropdown(true); }}
              className="w-full pl-10 pr-10 py-2 rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-cyan-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" 
            />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500 w-5 h-5 animate-spin" />}

            {showDropdown && (searchResults.users.length > 0 || searchResults.courses.length > 0) && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                {searchResults.users.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-2 py-1">Users</p>
                    {searchResults.users.map(u => (
                      <div key={u._id} onClick={() => handleResultClick('user', u.name)} className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-3 transition">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-lg text-blue-600 dark:text-blue-400"><Users className="w-4 h-4"/></div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{u.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{u.role} • {u.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.courses.length > 0 && (
                  <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-2 py-1">Courses</p>
                    {searchResults.courses.map(c => (
                      <div key={c._id} onClick={() => handleResultClick('course', c.title)} className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-3 transition">
                        <div className="bg-cyan-100 dark:bg-cyan-900/50 p-1.5 rounded-lg text-cyan-600 dark:text-cyan-400"><BookOpen className="w-4 h-4"/></div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{c.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <Bell className="text-slate-500 dark:text-slate-400 w-5 h-5 cursor-pointer hover:text-cyan-500" />
            <div onClick={toggleTheme} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} 
              <span className="hidden sm:inline">Theme</span>
              <div className="w-10 h-5 bg-slate-300 dark:bg-cyan-600 rounded-full relative transition-colors">
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
            <div className="flex items-center gap-3 border-l dark:border-slate-700 pl-4 ml-auto lg:ml-0">
              <img src={user.avatar} alt="Admin" className="w-10 h-10 rounded-full object-cover border border-cyan-400 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-slate-800 dark:text-white text-sm leading-tight truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition min-w-0" onClick={() => navigate('/admin/users')}>
            <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-xl text-cyan-500 shrink-0"><Users className="w-8 h-8" /></div>
            <div className="min-w-0">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate">Total Students</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate">
                {isLoadingStats ? '...' : stats.totalStudents}
              </h3>
              <p className="text-green-500 text-xs font-bold">+8.2%</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition min-w-0" onClick={() => navigate('/admin/users')}>
            <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-xl text-cyan-500 shrink-0"><Users className="w-8 h-8" /></div>
            <div className="min-w-0">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate">Total Instructors</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate">
                {isLoadingStats ? '...' : stats.totalInstructors}
              </h3>
              <p className="text-green-500 text-xs font-bold">+4</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition min-w-0" onClick={() => navigate('/admin/courses')}>
            <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-xl text-cyan-500 shrink-0"><FileText className="w-8 h-8" /></div>
            <div className="min-w-0">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate">Total Courses</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate">
                {isLoadingStats ? '...' : stats.totalCourses}
              </h3>
              <p className="text-green-500 text-xs font-bold">+3</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition min-w-0" onClick={() => navigate('/admin/payments')}>
            <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-xl text-cyan-500 shrink-0"><DollarSign className="w-8 h-8" /></div>
            <div className="min-w-0">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate">
                KES {isLoadingStats ? '...' : stats.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-green-500 text-xs font-bold">+12.5%</p>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h3 className="font-bold text-slate-800 dark:text-white">Revenue Overview</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">All Time</span>
            </div>
            <div className="h-48 w-full">
              {isLoadingStats ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>
              ) : stats.revenueData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">No revenue data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.revenueData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12}} />
                    <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', color: theme === 'dark' ? '#fff' : '#000' }} />
                    <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">STK Push Live Feed</h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {isLoadingStats ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-cyan-500" /></div>
              ) : stats.recentTransactions.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No recent transactions.</p>
              ) : (
                stats.recentTransactions.map((txn, idx) => (
                  <div key={idx} className="flex flex-wrap justify-between items-center text-sm gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${txn.resultCode === 0 ? 'bg-green-500' : txn.resultCode === -1 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                      <span className="text-slate-700 dark:text-slate-300 truncate capitalize">
                        {txn.resultCode === 0 ? 'Paid' : txn.resultCode === -1 ? 'Pending' : 'Failed'} {txn.phoneNumber}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-white shrink-0">KES {txn.amount || 0}</span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-lg border border-cyan-100 dark:border-cyan-800 text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pending STK:</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 break-words">
                {stats.recentTransactions.filter(t => t.resultCode === -1).length} pending
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h3 className="font-bold text-slate-800 dark:text-white">AI Usage</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Mon-Sun</span>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiUsageData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', color: theme === 'dark' ? '#fff' : '#000' }}/>
                  <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Attendance</h3>
            <h2 className="text-3xl font-bold text-cyan-500 mb-4">87% <span className="text-lg text-slate-500 dark:text-slate-400 font-medium">Present</span></h2>
            <div className="flex flex-wrap items-center gap-6">
              <div className="w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={attendanceData} innerRadius={30} outerRadius={40} paddingAngle={2} dataKey="value" stroke="none">
                      {attendanceData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-sm min-w-0">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0"></span><span className="text-slate-600 dark:text-slate-300 truncate">87% Present</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0"></span><span className="text-slate-600 dark:text-slate-300 truncate">8% Absent</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0"></span><span className="text-slate-600 dark:text-slate-300 truncate">5% Late</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">Manage Results</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">3 Labs • 124 Participating</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="flex-1 min-w-[120px] bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-200 dark:hover:bg-cyan-800 transition"><Upload className="w-4 h-4" /> Publish</button>
              <button className="flex-1 min-w-[120px] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"><FileText className="w-4 h-4" /> PDF</button>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Active</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-100 dark:border-green-800/50 min-w-0"><span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span><span className="text-green-700 dark:text-green-400 truncate">Grace • Today 10:32 AM • Online</span></div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 min-w-0"><span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span><span className="text-slate-600 dark:text-slate-400 truncate">Sarah • 2 days ago • Offline</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Payments</h3>
            <div className="flex flex-wrap items-center justify-around mb-6 gap-4">
              <div className="w-16 h-16 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentsData} innerRadius={20} outerRadius={30} dataKey="value" stroke="none">
                      {paymentsData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 min-w-0">
                <p className="flex items-center gap-1 truncate"><span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0"></span> Paid 92%</p>
                <p className="flex items-center gap-1 truncate"><span className="w-2 h-2 rounded-full bg-cyan-100 dark:bg-cyan-900 shrink-0"></span> Pending 5%</p>
                <p className="flex items-center gap-1 truncate"><span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span> Failed 3%</p>
              </div>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Results</h3>
            <div className="flex flex-wrap items-center justify-around gap-4">
              <div className="w-16 h-16 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={resultsData} innerRadius={20} outerRadius={30} dataKey="value" stroke="none">
                      {resultsData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 min-w-0">
                <p className="truncate">A 45%</p><p className="truncate">B 35%</p><p className="truncate">C 20%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center gap-3 min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white w-full text-left mb-2 truncate">Course & Module Creation</h3>
            <button className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-3 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-500 transition"><Video className="w-5 h-5 shrink-0"/> Video Upload</button>
            <button className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-3 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-500 transition"><Upload className="w-5 h-5 shrink-0"/> PDF Upload</button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white mb-1 truncate">Student Enrollment</h3>
            <div className="flex justify-between items-end mb-2 mt-4">
              <span className="text-lg font-bold text-slate-800 dark:text-white truncate">Progress 62%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-4">
              <div className="bg-cyan-500 h-3 rounded-full" style={{ width: '62%' }}></div>
            </div>
            <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition truncate">Grading Dashboard</button>
          </div>

          {/* AI Teaching Assistant Card - NOW FUNCTIONAL */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2 truncate">✨ AI Teaching Assistant</h3>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 mb-4 bg-green-50 dark:bg-green-900/20 w-max px-2 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span> <span className="truncate">12 participants online</span></div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 space-y-1">
              <p className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded truncate"><FileText className="w-3 h-3 shrink-0"/> Upload PDFs • Embeddings</p>
              <p className="text-center font-medium text-slate-600 dark:text-slate-300 truncate">LLM answer only from provided notes</p>
            </div>
            
            {/* Chat Display Area */}
            {aiResponse && (
              <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 max-h-32 overflow-y-auto">
                {aiResponse}
              </div>
            )}

            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-cyan-400 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" 
              />
              <button 
                onClick={handleAiChat} disabled={isAiLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 text-white p-1.5 rounded-lg hover:bg-cyan-600 transition flex items-center justify-center min-w-[32px]"
              >
                {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4 shrink-0" />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;