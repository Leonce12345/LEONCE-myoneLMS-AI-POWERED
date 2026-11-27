import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Camera, Save, Lock, Loader2 } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student', email: 'user@example.com' };
  
  const [formData, setFormData] = useState({
    name: storedUser.name || '',
    email: storedUser.email || '',
    phone: storedUser.phone || '+254 700 000 000',
    bio: storedUser.bio || 'Passionate learner exploring new skills on LearnHub.'
  });
  const [avatarFile, setAvatarFile] = useState(null);
  
  // Helper to format the URL correctly
  const getAvatarUrl = (path, name) => {
    if (!path) return `https://ui-avatars.com/api/?name=${name}&background=random`;
    if (path.startsWith('/uploads/')) return `http://localhost:5000${path}`;
    return path;
  };

  const [avatarPreview, setAvatarPreview] = useState(getAvatarUrl(storedUser.avatar, storedUser.name));
  
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('bio', formData.bio);
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      const res = await api.put('/auth/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update local storage so Sidebar updates instantly
      localStorage.setItem('user_data', JSON.stringify(res.data.user));
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      alert('Profile updated successfully!');
      
      // Force a small reload of the page to reflect new avatar globally
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("New passwords do not match!");
    }
    if (passwords.newPassword.length < 8) {
      return alert("Password must be at least 8 characters.");
    }

    setIsUpdatingPassword(true);
    try {
      await api.put('/auth/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      alert('Password changed successfully!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex transition-colors duration-300">
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/80 pointer-events-none transition-colors duration-300"></div>
      
      <Sidebar role={storedUser.role} user={storedUser} />
      
      <div className="flex-1 p-6 overflow-y-auto h-screen relative z-10">
        
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/${storedUser.role}/dashboard`)} className="bg-white/80 dark:bg-slate-800 p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
        </div>

        <div className="max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-8">
          
          {/* Cover & Avatar */}
          <div className="h-32 bg-gradient-to-r from-cyan-400 to-blue-500 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-md">
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-14 p-8">
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address (Read-Only)</label>
                  <input type="email" value={formData.email} readOnly className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role (RBAC)</label>
                  <input type="text" value={storedUser.role.toUpperCase()} readOnly className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Bio</label>
                <textarea rows="3" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"></textarea>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="submit" disabled={isUpdatingProfile} className="bg-cyan-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:bg-cyan-600 transition flex items-center gap-2 disabled:opacity-70">
                  {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Password Reset Section */}
        <div className="max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-500" /> Security Settings
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your account password here.</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwords.oldPassword} 
                  onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" 
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.newPassword} 
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" 
                    placeholder="Min. 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.confirmPassword} 
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white" 
                    placeholder="Re-type new password"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="submit" disabled={isUpdatingPassword} className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:bg-slate-900 dark:hover:bg-slate-600 transition flex items-center gap-2 disabled:opacity-70">
                  {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} 
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
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