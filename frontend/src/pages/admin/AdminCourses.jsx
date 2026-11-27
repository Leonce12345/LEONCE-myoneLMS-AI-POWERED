import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Search, Plus, BookOpen, Loader2 } from 'lucide-react';

const AdminCourses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Alex Mwangi', role: 'admin' };

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter((course) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (course.title && course.title.toLowerCase().includes(term)) ||
      (course.category && course.category.toLowerCase().includes(term)) ||
      (course.instructorId?.name && course.instructorId.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role="admin" user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
            <h1 className="text-2xl font-bold text-slate-800">All Courses</h1>
          </div>
          <button className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-md hover:bg-cyan-600 transition flex items-center gap-2"><Plus className="w-4 h-4" /> Create Course</button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-cyan-400" 
              />
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr><th className="px-6 py-4">Course Name</th><th className="px-6 py-4">Instructor</th><th className="px-6 py-4">Enrolled</th><th className="px-6 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No courses found matching "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="bg-cyan-50 p-2 rounded-lg text-cyan-500"><BookOpen className="w-4 h-4"/></div>
                      <span className="font-semibold text-slate-800">{course.title}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{course.instructorId?.name || 'Unknown Instructor'}</td>
                    <td className="px-6 py-4 font-medium">{course.enrolledStudents?.length || 0}</td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">{course.status || 'Published'}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminCourses;