import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

const Attendance = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student' };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role={user.role} user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Attendance Overview</h1>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600"><CheckCircle2 className="w-6 h-6"/></div>
            <div><p className="text-slate-500 text-sm">Present</p><h3 className="text-xl font-bold text-slate-800">87%</h3></div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl text-red-600"><XCircle className="w-6 h-6"/></div>
            <div><p className="text-slate-500 text-sm">Absent</p><h3 className="text-xl font-bold text-slate-800">8%</h3></div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600"><Clock className="w-6 h-6"/></div>
            <div><p className="text-slate-500 text-sm">Late</p><h3 className="text-xl font-bold text-slate-800">5%</h3></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Recent Logs</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="Search student..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-cyan-400" />
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr><th className="px-6 py-4">Student Name</th><th className="px-6 py-4">Course</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Grace Wambui', course: 'Intro to Data Science', date: 'Today, 10:00 AM', status: 'Present' },
                { name: 'David Ochieng', course: 'Intro to Data Science', date: 'Today, 10:00 AM', status: 'Absent' },
                { name: 'Mary Njoroge', course: 'Intro to Data Science', date: 'Today, 10:00 AM', status: 'Late' },
                { name: 'John Kamau', course: 'Python Prog.', date: 'Yesterday, 2:00 PM', status: 'Present' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-semibold text-slate-800">{log.name}</td>
                  <td className="px-6 py-4 text-slate-600">{log.course}</td>
                  <td className="px-6 py-4 text-slate-500">{log.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${log.status === 'Present' ? 'bg-green-100 text-green-700' : log.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Attendance;