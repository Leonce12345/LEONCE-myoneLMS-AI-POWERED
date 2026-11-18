import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, PlayCircle, Loader2, BookOpen } from 'lucide-react';

const MyCoursesStudent = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Grace', role: 'student' };
  
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`, { studentId: user._id || user.id });
      alert('Enrolled successfully!');
      fetchCourses(); // Refresh the list to show enrolled status
    } catch (error) {
      console.error("Enrollment error:", error);
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role="student" user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/student/dashboard')} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
          <h1 className="text-2xl font-bold text-slate-800">Available & Enrolled Courses</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-cyan-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-10 text-center text-slate-500">
            No courses available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              // Check if the current student is in the enrolledStudents array
              const isEnrolled = course.enrolledStudents?.includes(user._id || user.id);
              
              return (
                <div key={course._id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="h-32 bg-slate-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center text-slate-400">
                      <BookOpen className="w-10 h-10 opacity-30" />
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded bg-cyan-100 text-cyan-700">
                        {course.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-slate-500 mb-1">By: {course.instructorId?.name || 'Instructor'}</p>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                    
                    {isEnrolled && (
                      <>
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                          {/* Hardcoded 10% progress for now until we build the tracking logic */}
                          <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `10%` }}></div>
                        </div>
                        <p className="text-right text-xs font-bold text-slate-600 mb-4">10% Complete</p>
                      </>
                    )}
                  </div>

                  {isEnrolled ? (
                    <button onClick={() => navigate(`/student/courses/${course._id}`)} className="w-full bg-cyan-50 text-cyan-600 font-medium py-2 rounded-xl hover:bg-cyan-100 transition flex items-center justify-center gap-2">
                      <PlayCircle className="w-4 h-4"/> Continue Learning
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEnroll(course._id)} 
                      disabled={enrollingId === course._id}
                      className="w-full bg-cyan-500 text-white font-medium py-2 rounded-xl hover:bg-cyan-600 transition flex items-center justify-center gap-2 disabled:bg-cyan-300"
                    >
                      {enrollingId === course._id ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Enroll Now'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyCoursesStudent;