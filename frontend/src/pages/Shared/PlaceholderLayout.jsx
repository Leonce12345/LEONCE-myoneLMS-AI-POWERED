import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft } from 'lucide-react';

const PlaceholderLayout = ({ title, role }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: role, role: role };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role={role} user={user} />
      <div className="flex-1 p-8">
        <button onClick={() => navigate(`/${role}/dashboard`)} className="flex items-center gap-2 text-white bg-blue-600/50 hover:bg-blue-600 px-4 py-2 rounded-lg mb-6 backdrop-blur-sm transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-10 shadow-lg border border-white/50 h-[70vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">{title}</h1>
          <p className="text-slate-500 max-w-md">This page is currently under construction. You can add your specific features, forms, and tables here.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderLayout;