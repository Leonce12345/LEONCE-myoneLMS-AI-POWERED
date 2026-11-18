import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

const AdminPayments = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Alex Mwangi', role: 'admin' };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role="admin" user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/admin/dashboard')} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
          <h1 className="text-2xl font-bold text-slate-800">STK Push & Payments</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600"><CheckCircle2 className="w-6 h-6"/></div>
            <div><p className="text-slate-500 text-sm">Successful</p><h3 className="text-xl font-bold">KES 4.2M</h3></div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600"><Clock className="w-6 h-6"/></div>
            <div><p className="text-slate-500 text-sm">Pending STK</p><h3 className="text-xl font-bold">14</h3></div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl text-red-600"><XCircle className="w-6 h-6"/></div>
            <div><p className="text-slate-500 text-sm">Failed</p><h3 className="text-xl font-bold">3</h3></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr><th className="px-6 py-4">Txn ID</th><th className="px-6 py-4">Student</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: 'TXN-88291', name: 'John K', amt: '1500', status: 'Paid' },
                { id: 'TXN-88288', name: 'Mercy W', amt: '2500', status: 'Failed' },
                { id: 'TXN-88284', name: 'Peter M', amt: '1200', status: 'Paid' },
                { id: 'TXN-88280', name: 'Grace W', amt: '1500', status: 'Pending' },
              ].map((txn, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono text-slate-600">{txn.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{txn.name}</td>
                  <td className="px-6 py-4">KES {txn.amt}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${txn.status === 'Paid' ? 'bg-green-100 text-green-700' : txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{txn.status}</span>
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
export default AdminPayments;