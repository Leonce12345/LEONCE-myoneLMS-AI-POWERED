import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Upload, FileText, CheckCircle2, Clock } from 'lucide-react';

const Assignments = () => {
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
            <h1 className="text-2xl font-bold text-slate-800">Assignments & Exams</h1>
          </div>
          {user.role === 'instructor' && (
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-md hover:bg-cyan-600 transition flex items-center gap-2">
              <Upload className="w-4 h-4" /> Create Assignment
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {[
            { title: 'Biology Lab Report', course: 'Biology', due: 'Due Today, 11:59 PM', status: 'Pending', color: 'yellow' },
            { title: 'Data Analysis Project', course: 'Data Analysis', due: 'Due Oct 16, 9:00 AM', status: 'Graded', grade: 'A+', color: 'green' },
            { title: 'Python Final Exam', course: 'Python Prog.', due: 'Due Oct 20, 10:00 AM', status: 'Locked', color: 'slate' },
          ].map((assignment, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${assignment.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' : assignment.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{assignment.title}</h3>
                  <p className="text-sm text-slate-500">{assignment.course} • {assignment.due}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {assignment.status === 'Graded' ? (
                   <div className="text-right">
                     <p className="text-xs text-slate-500">Score</p>
                     <p className="font-bold text-green-600 text-lg">{assignment.grade}</p>
                   </div>
                ) : (
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${
                    assignment.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {assignment.status === 'Pending' ? <Clock className="w-4 h-4"/> : null}
                    {assignment.status}
                  </span>
                )}
                <button className="border border-slate-200 px-4 py-2 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
                  {user.role === 'student' ? 'View Details' : 'Review'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Assignments;