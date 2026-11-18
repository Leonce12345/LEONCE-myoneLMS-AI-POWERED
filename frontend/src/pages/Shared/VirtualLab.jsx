import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Play, Server, Lock, FlaskConical } from 'lucide-react';

const VirtualLab = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student' };

  const labs = [
    { name: 'Python Data Science Lab', desc: 'Jupyter Notebook environment with Pandas & NumPy.', status: 'Available', icon: '🐍' },
    { name: 'Biology Cell Simulator', desc: 'Interactive 3D models of cell structures.', status: 'Available', icon: '🧬' },
    { name: 'Network Security Lab', desc: 'Simulated environment to test penetration tools.', status: 'Locked', icon: '🛡️' },
  ];

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role={user.role} user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-cyan-500" /> Virtual Labs
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab, i) => (
            <div key={i} className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group ${lab.status === 'Locked' ? 'opacity-80' : ''}`}>
              {lab.status === 'Locked' && (
                <div className="absolute top-4 right-4 bg-slate-100 p-1.5 rounded-full"><Lock className="w-4 h-4 text-slate-500"/></div>
              )}
              
              <div className="text-4xl mb-4">{lab.icon}</div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">{lab.name}</h3>
              <p className="text-sm text-slate-500 mb-6 h-10">{lab.desc}</p>
              
              <button 
                disabled={lab.status === 'Locked'}
                className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
                  lab.status === 'Locked' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-md shadow-cyan-100'
                }`}
              >
                {lab.status === 'Locked' ? <><Lock className="w-4 h-4"/> Locked</> : <><Play className="w-4 h-4"/> Launch Lab</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default VirtualLab;