import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Sparkles, Send, FileText, Loader2 } from 'lucide-react';

const AIAssistant = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student' };

  // General Chat State
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Student Specific State (Vector Search)
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const messagesEndRef = useRef(null);

  // Fetch courses only if the user is a student
  useEffect(() => {
    if (user.role === 'student') {
      const fetchMyCourses = async () => {
        try {
          const response = await api.get('/courses');
          const enrolled = response.data.filter(c => c.enrolledStudents?.includes(user._id || user.id));
          setCourses(enrolled);
          if (enrolled.length > 0) setSelectedCourse(enrolled[0]._id);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      fetchMyCourses();
    }
  }, [user._id, user.id, user.role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Validation for students
    if (user.role === 'student' && !selectedCourse) {
      alert("Please enroll in a course with uploaded materials first.");
      return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      let response;
      if (user.role === 'student') {
        // Student asks based on specific course PDFs
        response = await api.post('/ai/ask', { courseId: selectedCourse, question: userMessage });
      } else {
        // Admin/Instructor asks general platform questions
        response = await api.post('/ai/general-chat', { question: userMessage });
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role={user.role} user={user} />
      
      <div className="flex-1 p-6 overflow-y-auto h-screen flex flex-col">
        
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            AI Teaching Assistant <Sparkles className="w-5 h-5 text-cyan-500"/>
          </h1>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden max-w-4xl mx-auto w-full h-[75vh]">
          
          {/* Top Bar */}
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> 
              {user.role === 'student' ? 'Vector Search Active' : 'Platform Assistant Active'}
            </div>
            
            {/* Show Course Dropdown ONLY for Students */}
            {user.role === 'student' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Select Course:</span>
                <select 
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  {courses.length === 0 ? (
                    <option value="">No enrolled courses</option>
                  ) : (
                    courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4"/>
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl text-sm shadow-sm max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-cyan-500 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4"/>
                </div>
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none text-sm text-slate-500 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-500" /> 
                  {user.role === 'student' ? 'Searching course notes...' : 'Thinking...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <form onSubmit={handleSendMessage} className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping || (user.role === 'student' && courses.length === 0)}
                placeholder={
                  user.role === 'student' && courses.length === 0 
                    ? "Enroll in a course to ask questions..." 
                    : "Ask me anything..."
                } 
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-400 text-sm bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed" 
              />
              <button 
                type="submit" 
                disabled={isTyping || !input.trim() || (user.role === 'student' && courses.length === 0)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 text-white p-2 rounded-lg hover:bg-cyan-600 transition disabled:bg-cyan-300"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIAssistant;