import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const StudentPayments = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Grace', role: 'student' };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role="student" user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/student/dashboard')} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
          <h1 className="text-2xl font-bold text-slate-800">My Payments</h1>
        </div>

        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Next Fee: Biology</h2>
            <p className="text-3xl font-bold text-slate-800 mb-1">KES 1,500</p>
            <p className="text-sm text-slate-500 mb-6">M-Pesa STK Push</p>
            <div className="flex gap-3">
              <input type="text" placeholder="Enter Phone (2547...)" className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50" />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition whitespace-nowrap">Pay Now</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Payment History</h2>
            <div className="flex justify-between items-center p-4 border border-green-100 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600"/>
                <div>
                  <p className="font-semibold text-slate-800">Data Analysis</p>
                  <p className="text-xs text-slate-500">Receipt #MPESA-784921</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">KES 1500</p>
                <p className="text-xs text-slate-500">Oct 10, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentPayments;