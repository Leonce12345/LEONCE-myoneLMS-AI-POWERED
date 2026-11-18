import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, PlayCircle, FileText, Lock, Sparkles, Loader2, Download } from 'lucide-react';

const CourseDetailStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Grace', role: 'student' };
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('video'); // 'video' or 'pdf'

  // The backend URL is needed to construct the full path to the uploaded files
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
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
        <button onClick={() => navigate('/student/courses')} className="text-cyan-500 hover:underline">Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role="student" user={user} />
      
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/student/courses')} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{course.title}</h1>
            <p className="text-sm text-slate-500">Instructor: {course.instructorId?.name || 'Instructor'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area (Video/PDF Player) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-black rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden border border-slate-800 shadow-xl">
              {activeTab === 'video' ? (
                course.videoUrl ? (
                  <video 
                    controls 
                    className="w-full h-full object-contain"
                    src={`${BACKEND_URL}/${course.videoUrl.replace(/\\/g, '/')}`}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-white flex flex-col items-center opacity-50">
                    <PlayCircle className="w-16 h-16 mb-2" />
                    <p>No video uploaded for this course.</p>
                  </div>
                )
              ) : (
                course.documentUrl ? (
                  <iframe 
                    src={`${BACKEND_URL}/${course.documentUrl.replace(/\\/g, '/')}`} 
                    className="w-full h-full bg-white"
                    title="PDF Document"
                  />
                ) : (
                  <div className="text-white flex flex-col items-center opacity-50">
                    <FileText className="w-16 h-16 mb-2" />
                    <p>No PDF uploaded for this course.</p>
                  </div>
                )
              )}
            </div>

            {/* Content Switcher */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex gap-2">
              <button 
                onClick={() => setActiveTab('video')}
                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${activeTab === 'video' ? 'bg-cyan-50 text-cyan-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <PlayCircle className="w-5 h-5" /> Video Lesson
              </button>
              <button 
                onClick={() => setActiveTab('pdf')}
                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${activeTab === 'pdf' ? 'bg-cyan-50 text-cyan-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <FileText className="w-5 h-5" /> Reading Material (PDF)
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-2">About this course</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="col-span-1 space-y-4">
             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4">Course Modules</h3>
               <div className="space-y-2 text-sm">
                 <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-lg text-cyan-700 font-medium flex items-center gap-2">
                   <PlayCircle className="w-4 h-4"/> 1. Introduction
                 </div>
                 <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 flex items-center gap-2">
                   <FileText className="w-4 h-4"/> 2. PDF Notes
                 </div>
                 <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 flex items-center gap-2">
                   <Lock className="w-4 h-4"/> 3. Next Topic (Locked)
                 </div>
               </div>
             </div>

             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white cursor-pointer" onClick={() => navigate('/student/ai-assistant')}>
               <h3 className="font-bold flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5"/> AI Assistant</h3>
               <p className="text-xs text-indigo-100 mb-4">Stuck? Ask the AI a question based on this module's notes.</p>
               <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition">Ask Question</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseDetailStudent;