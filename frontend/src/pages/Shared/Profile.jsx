import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Camera, Save } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student', email: 'user@example.com' };
  
  const [formData, setFormData] = useState({
    name: storedUser.name,
    email: storedUser.email,
    phone: '+254 700 000 000',
    bio: 'Passionate learner exploring new skills on LearnHub.'
  });

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role={storedUser.role} user={storedUser} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/${storedUser.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        </div>

        <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Cover & Avatar */}
          <div className="h-32 bg-gradient-to-r from-cyan-400 to-blue-500 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-24 h-24 bg-slate-200 rounded-full border-4 border-white flex items-center justify-center relative group cursor-pointer overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${storedUser.name}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-14 p-8">
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role (RBAC)</label>
                  <input type="text" value={storedUser.role.toUpperCase()} readOnly className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Bio</label>
                <textarea rows="3" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50"></textarea>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="button" className="bg-cyan-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:bg-cyan-600 transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;