import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Plus, Users, Edit, Loader2 } from 'lucide-react';

const MyCoursesInstructor = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Sarah Njoki', role: 'instructor' };
  
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get(`/courses/instructor/${user._id || user.id}`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user.id || user._id) fetchMyCourses();
  }, [user.id, user._id]);

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role="instructor" user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/instructor/dashboard')} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
            <h1 className="text-2xl font-bold text-slate-800">My Courses</h1>
          </div>
          <button onClick={() => navigate('/instructor/courses/create')} className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-md hover:bg-cyan-600 transition flex items-center gap-2"><Plus className="w-4 h-4" /> Add New</button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-cyan-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-10 text-center text-slate-500">
            You haven't created any courses yet. Click "Add New" to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="h-32 bg-slate-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center text-slate-400 font-medium">
                  {course.videoUrl ? 'Video Content Available' : 'No Video Uploaded'}
                  <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${course.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {course.status || 'Published'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{course.title}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-4"><Users className="w-4 h-4"/> 0 Students</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/instructor/courses/${course._id}`)} className="flex-1 bg-slate-100 text-slate-700 font-medium py-2 rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2"><Edit className="w-4 h-4"/> Manage</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyCoursesInstructor;