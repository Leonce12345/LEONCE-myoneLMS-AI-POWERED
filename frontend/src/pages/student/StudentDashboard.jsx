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

  // AI CHAT STATES
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  return (
    // CHANGED: Main layout stacks on mobile
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex flex-col lg:flex-row p-4 transition-colors duration-300">
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/80 pointer-events-none transition-colors duration-300"></div>
      
      <Sidebar role="student" user={user} />

      <div className="flex-1 w-full min-w-0 lg:pl-6 overflow-y-auto h-screen pb-10 relative z-10">
        
        {/* CHANGED: Header responsive */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-slate-900 rounded-2xl p-4 mb-4 shadow-sm border border-white/50 dark:border-slate-800 transition-colors duration-300 gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="bg-gradient-to-r from-blue-700 to-cyan-500 text-transparent bg-clip-text text-2xl lg:text-3xl font-extrabold flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400 text-2xl lg:text-3xl">🎓</span> LearnHub
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white truncate">Welcome back {user.name},</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <div onClick={toggleTheme} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} <span className="hidden sm:inline">Theme</span>
              <div className="w-8 h-4 bg-slate-300 dark:bg-cyan-600 rounded-full relative ml-1 transition-colors shrink-0"><div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div></div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </div>
              <div className="w-10 h-10 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer shrink-0" onClick={() => navigate('/student/profile')}>
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* CHANGED: Banner responsive */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-4 flex flex-col md:flex-row justify-between items-center mb-6 shadow-md gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">📢</span>
            <p className="font-medium text-sm md:text-base break-words">Pay your fees first to unlock courses, assignments and learning services - M-Pesa STK Push</p>
          </div>
          <button onClick={() => navigate('/student/payments')} className="bg-white text-blue-600 font-bold px-6 py-2 rounded-lg hover:bg-blue-50 transition shrink-0 w-full md:w-auto">PAY FIRST</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative cursor-pointer hover:shadow-md transition min-w-0" onClick={() => navigate('/student/courses')}>
              <Lock className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 w-6 h-6 shrink-0" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-2 truncate">My Courses</h3>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">4 Active</span>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded flex items-center gap-1 shrink-0"><Lock className="w-3 h-3"/> LOCKED</span>
              </div>
              <div className="mb-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 truncate">Completed 68%</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full flex items-center justify-end pr-1" style={{ width: '68%' }}>
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-right text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">68%</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative min-w-0">
              <Lock className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 w-6 h-6 shrink-0" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-1 truncate">Next Class Today 2pm</h3>
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-2 truncate">Biology Cell Structure</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Join in 35 min<br/>Pay to Unlock</p>
              <button onClick={() => navigate('/student/payments')} className="w-full border border-cyan-500 text-cyan-600 dark:text-cyan-400 font-medium py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition truncate">
                <Lock className="w-4 h-4 shrink-0"/> Pay to Unlock
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 truncate">Upcoming Assignments</h3>
              <div className="space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm flex items-center gap-1 truncate"><Lock className="w-3 h-3 text-slate-400 shrink-0"/> Biology Lab Report</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-4 truncate">Due Today 11:59pm</p>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1 shrink-0"><Lock className="w-3 h-3"/> LOCKED</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 truncate"><FlaskConical className="w-4 h-4 shrink-0"/> Virtual Lab</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded flex items-center gap-1 text-sm truncate"><Lock className="w-3 h-3 shrink-0"/> Python</span>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1 rounded flex items-center gap-1 text-xs truncate"><Lock className="w-3 h-3 shrink-0"/> LOCKED</span>
              </div>
              <button className="w-full bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-500 font-medium py-2 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 truncate">Launch Lab <Lock className="w-4 h-4 shrink-0"/></button>
            </div>

          </div>

          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 truncate">Continue Learning</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex flex-wrap justify-between text-sm mb-1 gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">Python <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">Mod 5/7</span></span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">70%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{width: '70%'}}></div></div>
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0"/>
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap justify-between text-sm mb-1 gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">Data Analysis <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">Mod 3/6</span></span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">45%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{width: '45%'}}></div></div>
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 truncate">Results</h3>
              <div className="space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm truncate">Biology</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">85% A LOCKED</p>
                    </div>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1 shrink-0"><Lock className="w-3 h-3"/> LOCKED</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center min-w-0">
                  <Mail className="w-6 h-6 text-slate-500 dark:text-slate-400 mb-2 shrink-0"/>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1 truncate">Email Instructor</h4>
                  <button className="border border-cyan-500 text-cyan-500 dark:text-cyan-400 text-xs font-medium px-4 py-1.5 rounded-lg w-full hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition truncate">Send Email</button>
               </div>
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center min-w-0">
                  <h4 className="font-bold text-slate-800 dark:text-white text-xs mb-2 truncate">Grading</h4>
                  <div className="w-16 h-16 relative mb-2 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={gradingData} innerRadius={20} outerRadius={30} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                          {gradingData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">68%</div>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">Overall 68%</p>
               </div>
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 col-span-1 sm:col-span-2 min-w-0">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1 truncate">Discussion Forums</h4>
                  <p className="text-xs text-green-500 flex items-center gap-1 truncate"><span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span> 12 peers online</p>
               </div>
            </div>

          </div>

          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
              <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h3 className="font-bold text-slate-800 dark:text-white truncate">My Payments</h3>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded shrink-0">UNLOCKED</span>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4 min-w-0">
                <div className="flex items-center gap-2 mb-1 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-white text-sm truncate">Data Analysis</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Receipt #MPESA-784921</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-4 min-w-0">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 truncate">Next Fee: Biology</p>
                <p className="text-slate-800 dark:text-white font-medium text-sm mb-2 truncate">KES 1 - M-Pesa STK Push</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    placeholder="Phone 254..." 
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

            {/* AI Teaching Assistant Card - NOW FUNCTIONAL */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2 truncate">AI Teaching Assistant ✨</h3>
              
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
                  className="w-full pl-3 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-cyan-400 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" 
                />
                <button 
                  onClick={handleAiChat} disabled={isAiLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-cyan-500 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition text-xs font-medium flex items-center justify-center min-w-[50px]"
                >
                  {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : 'Send'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;