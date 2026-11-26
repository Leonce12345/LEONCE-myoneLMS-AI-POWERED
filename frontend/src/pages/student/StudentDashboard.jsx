import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { useTheme } from '../../hooks/useTheme';
import { 
  Bell, Moon, Sun, Lock, PlayCircle, FileText, CheckCircle2, 
  Send, MessageSquare, FlaskConical, Mail, Loader2 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Grace', role: 'student' };

  const [phone, setPhone] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const gradingData = [
    { name: 'Overall', value: 68, color: '#06b6d4' },
    { name: 'Remaining', value: 32, color: theme === 'dark' ? '#334155' : '#e2e8f0' },
  ];

  const handlePayNow = async () => {
    if (!phone || phone.length < 12) {
      alert("Please enter a valid phone number (e.g., 254712345678)");
      return;
    }
    setIsPaying(true);
    try {
      await api.post('/mpesa/stkpush', {
        phone: phone,
        amount: 1, 
        courseId: "YOUR_COURSE_ID_HERE", 
        studentId: user._id || user.id
      });
      alert("STK Push sent! Please check your phone to enter your M-Pesa PIN.");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to initiate payment");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex p-4 transition-colors duration-300">
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/80 pointer-events-none transition-colors duration-300"></div>
      
      <Sidebar role="student" user={user} />

      <div className="flex-1 pl-6 overflow-y-auto h-screen pb-10 relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white dark:bg-slate-900 rounded-2xl p-4 mb-4 shadow-sm border border-white/50 dark:border-slate-800 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-700 to-cyan-500 text-transparent bg-clip-text text-3xl font-extrabold flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400 text-3xl">🎓</span> LearnHub
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white ml-4">Welcome back {user.name},</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* THEME TOGGLE BUTTON */}
            <div onClick={toggleTheme} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Theme
              <div className="w-8 h-4 bg-slate-300 dark:bg-cyan-600 rounded-full relative ml-1 transition-colors"><div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div></div>
            </div>

            <div className="relative">
              <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </div>
            <div className="w-10 h-10 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer" onClick={() => navigate('/student/profile')}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-3 flex justify-between items-center mb-6 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-xl">📢</span>
            <p className="font-medium">Pay your fees first to unlock courses assignments and learning services - M-Pesa STK Push Pay Now</p>
          </div>
          <button onClick={() => navigate('/student/payments')} className="bg-white text-blue-600 font-bold px-6 py-2 rounded-lg hover:bg-blue-50 transition">PAY FIRST</button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* My Courses */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative cursor-pointer hover:shadow-md transition" onClick={() => navigate('/student/courses')}>
              <Lock className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 w-6 h-6" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">My Courses</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300">4 Active</span>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded flex items-center gap-1"><Lock className="w-3 h-3"/> LOCKED</span>
              </div>
              <div className="mb-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed 68% • LOCKED = (70+45+80+77)/4</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full flex items-center justify-end pr-1" style={{ width: '68%' }}>
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-right text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">68%</p>
            </div>

            {/* Next Class */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative">
              <Lock className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 w-6 h-6" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">Next Class Today 2pm</h3>
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-2">Biology Cell Structure</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Join in 35 min<br/>Pay to Unlock</p>
              <button onClick={() => navigate('/student/payments')} className="w-full border border-cyan-500 text-cyan-600 dark:text-cyan-400 font-medium py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition">
                <Lock className="w-4 h-4"/> Pay to Unlock
              </button>
            </div>

            {/* Upcoming Assignments */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Upcoming Assignments</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm flex items-center gap-1"><Lock className="w-3 h-3 text-slate-400"/> Biology Lab Report</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-4">Due Today 11:59pm</p>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1"><Lock className="w-3 h-3"/> LOCKED</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm flex items-center gap-1"><Lock className="w-3 h-3 text-slate-400"/> Data Analysis</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-4">Due Oct 16 9:00am</p>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1"><Lock className="w-3 h-3"/> LOCKED</span>
                </div>
              </div>
            </div>

            {/* Virtual Lab */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4"><FlaskConical className="w-4 h-4"/> Virtual Lab</h3>
              <div className="flex gap-2 mb-4">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded flex items-center gap-1 text-sm"><Lock className="w-3 h-3"/> Python</span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded flex items-center gap-1 text-sm"><Lock className="w-3 h-3"/> Biology</span>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1 rounded flex items-center gap-1 text-xs"><Lock className="w-3 h-3"/> LOCKED</span>
              </div>
              <button className="w-full bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-500 font-medium py-2 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">Launch Lab <Lock className="w-4 h-4"/></button>
            </div>

          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            
            {/* Continue Learning */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Continue Learning</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Python <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">Module 5 of 7</span></span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">70%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{width: '70%'}}></div></div>
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500"/>
                  </div>
                  <p className="text-right text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">70% LOCKED</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Data Analysis <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">Module 3 of 6</span></span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">45%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{width: '45%'}}></div></div>
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500"/>
                  </div>
                   <p className="text-right text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">45% LOCKED</p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Biology</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">85% A LOCKED</p>
                    </div>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1"><Lock className="w-3 h-3"/> LOCKED</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Data Analysis</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">92% A+ matches Instructor</p>
                    </div>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1">A+ LOCKED</span>
                </div>
              </div>
            </div>

            {/* Email & Chat & Grading */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                  <Mail className="w-6 h-6 text-slate-500 dark:text-slate-400 mb-2"/>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">Email Instructor</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3">Send Email</p>
                  <button className="border border-cyan-500 text-cyan-500 dark:text-cyan-400 text-xs font-medium px-4 py-1.5 rounded-lg w-full hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition">Send Email</button>
               </div>
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                  <h4 className="font-bold text-slate-800 dark:text-white text-xs mb-2">Grading</h4>
                  <div className="w-16 h-16 relative mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={gradingData} innerRadius={20} outerRadius={30} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                          {gradingData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">68%</div>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Overall 68%</p>
               </div>
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 col-span-2">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">Discussion Forums</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Real-time Chat • Live</p>
                  <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 12 peers online</p>
               </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* My Payments */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white">My Payments</h3>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">UNLOCKED</span>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-slate-800 dark:text-white text-sm">Data Analysis</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium text-sm mb-1">KES 1500</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Receipt #MPESA-784921 • Paid Oct 10 2024</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-4">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Next Fee: Biology</p>
                <p className="text-slate-800 dark:text-white font-medium text-sm mb-2">KES 1 - M-Pesa STK Push</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Phone 254..." 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" 
                  />
                  <button 
                    onClick={handlePayNow}
                    disabled={isPaying}
                    className="bg-blue-500 text-white text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-blue-600 transition whitespace-nowrap flex items-center justify-center min-w-[70px]"
                  >
                    {isPaying ? <Loader2 className="w-3 h-3 animate-spin"/> : 'Pay Now'}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Teaching Assistant */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">AI Teaching Assistant ✨</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4">Vector Search • Ask me anything</p>
              <div className="relative">
                <input type="text" placeholder="Ask me anything..." className="w-full pl-3 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-cyan-400 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-cyan-500 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition text-xs font-medium">Send</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;