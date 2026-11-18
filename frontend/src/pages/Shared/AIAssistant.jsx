import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Sparkles, Send, FileText } from 'lucide-react';

const AIAssistant = () => {
  const navigate = useNavigate();
  // Determine role from local storage for the sidebar
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student' };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role={user.role} user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen flex flex-col">
        
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">AI Teaching Assistant <Sparkles className="w-5 h-5 text-cyan-500"/></h1>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden max-w-4xl mx-auto w-full">
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Vector Search Active
            </div>
            <span className="text-xs text-slate-400">Answers generated from course notes</span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
             {/* AI Message */}
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4"/></div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 text-sm text-slate-700 shadow-sm">
                 Hello! I have analyzed the PDFs uploaded for this course. What would you like to know?
               </div>
             </div>
             {/* User Message */}
             <div className="flex gap-3 justify-end">
               <div className="bg-cyan-500 p-3 rounded-2xl rounded-tr-none text-sm text-white shadow-sm">
                 Can you explain the difference between a list and a tuple in Python?
               </div>
             </div>
             {/* AI Message */}
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4"/></div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 text-sm text-slate-700 shadow-sm">
                 Based on the notes in <strong>Chapter 2.pdf</strong>: Lists are mutable (you can change them), while tuples are immutable (they cannot be changed after creation). 
                 <div className="mt-2 bg-slate-100 p-2 rounded text-xs flex items-center gap-1 text-slate-500"><FileText className="w-3 h-3"/> Source: Chapter 2.pdf, Page 14</div>
               </div>
             </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="relative">
              <input type="text" placeholder="Ask me anything about the course notes..." className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-400 text-sm bg-slate-50" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 text-white p-2 rounded-lg hover:bg-cyan-600 transition"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIAssistant;