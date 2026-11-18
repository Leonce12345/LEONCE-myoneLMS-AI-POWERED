import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Search, Send } from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student' };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role={user.role} user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
          <h1 className="text-2xl font-bold text-slate-800">Discussion & Messages</h1>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex overflow-hidden max-w-5xl mx-auto w-full h-[75vh]">
          {/* Contact List */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Search peers..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-cyan-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {['James M.', 'David O.', 'Sarah Instructor'].map((name, i) => (
                <div key={i} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${i===0 ? 'bg-cyan-50/50 border-l-4 border-l-cyan-500' : ''}`}>
                  <p className="font-semibold text-slate-800 text-sm">{name}</p>
                  <p className="text-xs text-slate-500 truncate mt-1">Hey, did you check the new assignment?</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-50/30">
            <div className="p-4 border-b border-slate-100 bg-white">
              <h3 className="font-bold text-slate-800">James M.</h3>
              <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
               <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">JM</div>
                 <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 text-sm text-slate-700 shadow-sm">Hey, did you check the new assignment?</div>
               </div>
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input type="text" placeholder="Type a message..." className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-400 text-sm bg-slate-50" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 text-white p-1.5 rounded-lg hover:bg-cyan-600 transition"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Messages;