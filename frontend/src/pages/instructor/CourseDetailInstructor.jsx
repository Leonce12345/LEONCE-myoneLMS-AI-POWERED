import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Video, FileText, CheckCircle2, Users, Loader2 } from 'lucide-react';

const CourseDetailInstructor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Sarah Njoki', role: 'instructor' };
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await api.get(`/courses/instructor/course/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <h2 className="text-2xl font-bold mb-2">Course not found</h2>
        <button onClick={() => navigate('/instructor/courses')} className="text-cyan-500 hover:underline">Go back</button>
      </div>
    );
  }

  const enrolledCount = course.enrolledStudents?.length || 0;

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role="instructor" user={user} />
      
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/instructor/courses')} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{course.title}</h1>
            <p className="text-sm text-slate-500">Course Management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Course Info & Materials */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Course Materials</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Video className="w-4 h-4 text-cyan-500"/> 
                    {course.videoUrl ? 'Video Lesson' : 'No Video'}
                  </div>
                  {course.videoUrl && <span className="text-xs text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3"/> Uploaded</span>}
                </div>
                
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FileText className="w-4 h-4 text-red-500"/> 
                    {course.documentUrl ? 'PDF Notes' : 'No Document'}
                  </div>
                  {course.documentUrl && <span className="text-xs text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3"/> Uploaded</span>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Course Overview</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{course.description}</p>
              <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">Price</span>
                <span className="font-bold text-slate-800">KES {course.price}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Enrolled Students */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-500" /> Enrolled Students
                </h2>
                <span className="bg-cyan-100 text-cyan-700 font-bold px-3 py-1 rounded-full text-sm">
                  {enrolledCount} Total
                </span>
              </div>
              
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrolledCount === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-slate-500">
                        No students have enrolled in this course yet.
                      </td>
                    </tr>
                  ) : (
                    course.enrolledStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">
                              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <p className="font-semibold text-slate-800">{student.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{student.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailInstructor;