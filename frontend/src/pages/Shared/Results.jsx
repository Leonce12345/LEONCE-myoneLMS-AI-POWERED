import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Download, Loader2, CheckSquare, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Results = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student' };
  
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Instructor State
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [finalGradeData, setFinalGradeData] = useState({ finalScore: '', finalGrade: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get('/academic/my-records');
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleFinalGradeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/academic/grade-final/${selectedRecord._id}`, {
        finalScore: Number(finalGradeData.finalScore),
        finalGrade: finalGradeData.finalGrade
      });
      // Update local state to reflect change without full reload
      setRecords(records.map(r => r._id === selectedRecord._id ? { ...r, finalScore: finalGradeData.finalScore, finalGrade: finalGradeData.finalGrade } : r));
      setSelectedRecord(null);
      setFinalGradeData({ finalScore: '', finalGrade: '' });
      alert('Final grade published successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save final grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- INSTRUCTOR VIEW ---
  if (user.role === 'instructor') {
    return (
      <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center flex">
        <Sidebar role={user.role} user={user} />
        <div className="flex-1 p-6 overflow-y-auto h-screen relative z-10">
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
              <h1 className="text-2xl font-bold text-slate-800">Publish Final Grades</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Enrolled Students & Final Grades</h3>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40 text-cyan-500"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : records.length === 0 ? (
              <div className="p-10 text-center text-slate-500">No academic records found.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Current Final Score</th>
                    <th className="px-6 py-4">Final Grade</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-slate-800">{record.studentId?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-slate-600">{record.courseId?.title || 'Unknown Course'}</td>
                      <td className="px-6 py-4 font-bold text-cyan-600">{record.finalScore ? `${record.finalScore}%` : 'Not Graded'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${record.finalGrade ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {record.finalGrade || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => {
                            setSelectedRecord(record);
                            setFinalGradeData({ finalScore: record.finalScore || '', finalGrade: record.finalGrade || '' });
                          }}
                          className="border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1"
                        >
                          <CheckSquare className="w-3 h-3"/> Enter Final Grade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Final Grade Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setSelectedRecord(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Publish Final Grade</h2>
              <p className="text-sm text-slate-500 mb-4">{selectedRecord.studentId?.name} - {selectedRecord.courseId?.title}</p>
              
              <form onSubmit={handleFinalGradeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Final Score (%)</label>
                  <input 
                    type="number" 
                    min="0" max="100" required
                    value={finalGradeData.finalScore}
                    onChange={(e) => setFinalGradeData({...finalGradeData, finalScore: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 text-sm"
                    placeholder="e.g., 85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Letter Grade</label>
                  <input 
                    type="text" required
                    value={finalGradeData.finalGrade}
                    onChange={(e) => setFinalGradeData({...finalGradeData, finalGrade: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 text-sm"
                    placeholder="e.g., A, B+, C"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-green-500 text-white font-medium py-2.5 rounded-xl hover:bg-green-600 transition flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Final Grade'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- STUDENT VIEW ---
  const resultData = records.map(record => ({
    subject: record.courseId?.title || 'Unknown Course',
    score: record.finalScore || 0,
    grade: record.finalGrade || 'N/A'
  })).filter(r => r.score > 0); 

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role={user.role} user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Results & Grading</h1>
          </div>
          <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-medium text-sm shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-cyan-500"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : resultData.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-slate-500 shadow-sm border border-slate-100">
            No final results published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Performance Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resultData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {resultData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score >= 50 ? '#06b6d4' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Grade Breakdown</h2>
              <div className="space-y-4">
                {resultData.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-800">{r.subject}</p>
                      <p className="text-xs text-slate-500">{r.score}% Score</p>
                    </div>
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      r.score >= 80 ? 'bg-green-100 text-green-700' : r.score >= 50 ? 'bg-cyan-100 text-cyan-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Results;