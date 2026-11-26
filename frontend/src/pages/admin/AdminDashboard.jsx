import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useTheme } from '../../hooks/useTheme';
import { 
  Search, Bell, Moon, Sun, User, Users, FileText, DollarSign, 
  Video, Upload, Send, Settings, CheckCircle2, XCircle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Alex Mwangi', role: 'admin', avatar: 'https://i.pravatar.cc/150?img=11' };

  // Chart Data ... (Keep your existing chart data here, I've omitted it for brevity but you should keep yours)
  const revenueData = [
    { name: 'Jan', value: 3000 }, { name: 'Feb', value: 4000 }, { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 }, { name: 'May', value: 6000 }, { name: 'Jul', value: 7000 },
  ];
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
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex transition-colors duration-300">
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/80 pointer-events-none transition-colors duration-300"></div>
      
      <Sidebar role="admin" user={user} />

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto h-screen relative z-10">
        
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-sm border border-white/50 dark:border-slate-800 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text text-3xl font-extrabold flex items-center gap-2">
              <span className="text-cyan-500 text-3xl">🎓</span> LearnHub
            </div>
          </div>
          
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search students/courses/instructors" className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-cyan-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
          </div>

          <div className="flex items-center gap-6">
            <Bell className="text-slate-500 dark:text-slate-400 w-5 h-5 cursor-pointer hover:text-cyan-500" />
            
            {/* THEME TOGGLE BUTTON */}
            <div onClick={toggleTheme} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} 
              <span>Theme</span>
              <div className="w-10 h-5 bg-slate-300 dark:bg-cyan-600 rounded-full relative transition-colors">
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l dark:border-slate-700 pl-4">
              <img src={user.avatar} alt="Admin" className="w-10 h-10 rounded-full object-cover border border-cyan-400" />
              <div>
                <p className="font-bold text-slate-800 dark:text-white text-sm leading-tight">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Top Stats Row */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/users')}>
            <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-xl text-cyan-500"><Users className="w-8 h-8" /></div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Students</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">12482</h3>
              <p className="text-green-500 text-xs font-bold">+8.2%</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/users')}>
            <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-xl text-cyan-500"><Users className="w-8 h-8" /></div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Instructors</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">164</h3>
              <p className="text-green-500 text-xs font-bold">+4</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/courses')}>
            <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-xl text-cyan-500"><FileText className="w-8 h-8" /></div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Courses</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">98</h3>
              <p className="text-green-500 text-xs font-bold">+3</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/payments')}>
            <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-xl text-cyan-500"><DollarSign className="w-8 h-8" /></div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">KES 4.2M</h3>
              <p className="text-green-500 text-xs font-bold">+12.5%</p>
            </div>
          </div>

          {/* Middle Row */}
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Revenue Overview</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Jan-Jul 4.2M</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
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
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">STK Push Live Feed</h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-slate-700 dark:text-slate-300">Paid TXN-88291 John K</span></div><span className="font-semibold text-slate-800 dark:text-white">KES 1500</span></div>
              <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-slate-700 dark:text-slate-300">Failed TXN-88288 Mercy W</span></div><span className="font-semibold text-slate-800 dark:text-white">KES 2500</span></div>
              <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-slate-700 dark:text-slate-300">Paid TXN-88284 Peter M</span></div><span className="font-semibold text-slate-800 dark:text-white">KES 1200</span></div>
            </div>
            <div className="mt-4 bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-lg border border-cyan-100 dark:border-cyan-800 text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pending STK:</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">3 pending KES 5700 = 1500 + 2200 + 2000</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">AI Usage</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Mon-Sun</span>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiUsageData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', color: theme === 'dark' ? '#fff' : '#000' }}/>
                  <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Attendance</h3>
            <h2 className="text-3xl font-bold text-cyan-500 mb-4">87% <span className="text-lg text-slate-500 dark:text-slate-400 font-medium">Present</span></h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={attendanceData} innerRadius={30} outerRadius={40} paddingAngle={2} dataKey="value" stroke="none">
                      {attendanceData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500"></span><span className="text-slate-600 dark:text-slate-300">87% Present</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-slate-600 dark:text-slate-300">8% Absent</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400"></span><span className="text-slate-600 dark:text-slate-300">5% Late</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">Manage Results</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">3 Labs • 124 Participating</p>
            <div className="flex gap-2 mb-4">
              <button className="flex-1 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-200 dark:hover:bg-cyan-800 transition"><Upload className="w-4 h-4" /> Publish</button>
              <button className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"><FileText className="w-4 h-4" /> Download PDF</button>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Active</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-100 dark:border-green-800/50"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-green-700 dark:text-green-400">Grace • Today 10:32 AM • Online</span></div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700"><span className="w-2 h-2 rounded-full bg-slate-400"></span><span className="text-slate-600 dark:text-slate-400">Sarah • 2 days ago • Offline</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Payments</h3>
            <div className="flex items-center justify-around mb-6">
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentsData} innerRadius={20} outerRadius={30} dataKey="value" stroke="none">
                      {paymentsData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Paid 92%</p>
                <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-100 dark:bg-cyan-900"></span> Pending 5%</p>
                <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Failed 3%</p>
              </div>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Results</h3>
            <div className="flex items-center justify-around">
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={resultsData} innerRadius={20} outerRadius={30} dataKey="value" stroke="none">
                      {resultsData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <p>A 45%</p><p>B 35%</p><p>C 20%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center gap-3">
            <h3 className="font-bold text-slate-800 dark:text-white w-full text-left mb-2">Course & Module Creation</h3>
            <button className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-3 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-500 transition"><Video className="w-5 h-5"/> Video Upload</button>
            <button className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-3 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-500 transition"><Upload className="w-5 h-5"/> PDF Upload</button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">Student Enrollment</h3>
            <div className="flex justify-between items-end mb-2 mt-4">
              <span className="text-lg font-bold text-slate-800 dark:text-white">Progress Tracking 62%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-4">
              <div className="bg-cyan-500 h-3 rounded-full" style={{ width: '62%' }}></div>
            </div>
            <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">Grading Dashboard</button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative">
            <h3 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">✨ AI Teaching Assistant</h3>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 mb-4 bg-green-50 dark:bg-green-900/20 w-max px-2 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-green-500"></span> Real-time Chat • 12 participants online</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 space-y-1">
              <p className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded"><FileText className="w-3 h-3"/> Upload PDFs • Extract Text • Chunk • Embeddings</p>
              <p className="text-center font-medium text-slate-600 dark:text-slate-300">LLM answer only from provided notes</p>
            </div>
            <div className="relative">
              <input type="text" placeholder="Ask me anything..." className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-cyan-400 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 text-white p-1.5 rounded-lg hover:bg-cyan-600 transition"><Send className="w-4 h-4" /></button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;