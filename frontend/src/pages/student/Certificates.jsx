import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Award, Lock, Download, Loader2, CheckCircle2, RefreshCw, X, Printer } from 'lucide-react';

const StudentCertificates = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Grace', role: 'student' };
  
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [phoneInputs, setPhoneInputs] = useState({});
  const [payingCourseId, setPayingCourseId] = useState(null);
  const [pollingCourseId, setPollingCourseId] = useState(null);

  // State for the Certificate Modal
  const [certificateData, setCertificateData] = useState(null);

  const fetchCoursesAndStatus = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const response = await api.get('/courses');
      const enrolled = response.data.filter(c => c.enrolledStudents?.includes(user._id || user.id));
      
      const academicRes = await api.get('/academic/my-records');
      const academicRecords = academicRes.data;

      const coursesWithStatus = await Promise.all(enrolled.map(async (course) => {
        const statusRes = await api.get(`/mpesa/status/${user._id || user.id}/${course._id}`);
        const isPaid = statusRes.data.paid;

        const record = academicRecords.find(r => r.courseId?._id === course._id || r.courseId === course._id);
        const finalScore = record?.finalScore || 0;
        const isPassed = finalScore >= 50;

        return { ...course, isPaid, isPassed, finalScore, finalGrade: record?.finalGrade };
      }));
      
      setCourses(coursesWithStatus);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [user.id, user._id]);

  useEffect(() => {
    fetchCoursesAndStatus(true);
  }, [fetchCoursesAndStatus]);

  const handlePhoneChange = (courseId, value) => {
    setPhoneInputs(prev => ({ ...prev, [courseId]: value }));
  };

  const handlePayNow = async (courseId) => {
    const phone = phoneInputs[courseId];
    if (!phone || phone.length < 12) {
      alert("Please enter a valid phone number (e.g., 254712345678)");
      return;
    }
    
    setPayingCourseId(courseId);
    try {
      await api.post('/mpesa/stkpush', {
        phone: phone,
        amount: 1, 
        courseId: courseId,
        studentId: user._id || user.id
      });
      
      setPollingCourseId(courseId);
      setPayingCourseId(null);

      let attempts = 0;
      const maxAttempts = 30; // 30 * 4s = 120 seconds

      const interval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await api.get(`/mpesa/status/${user._id || user.id}/${courseId}`);
          
          if (statusRes.data.paid) {
            clearInterval(interval);
            setPollingCourseId(null);
            alert("Payment Confirmed! Certificate Unlocked.");
            fetchCoursesAndStatus(false); 
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            setPollingCourseId(null);
            alert("Payment timeout. The backend has not received the M-Pesa callback yet.");
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 4000);

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to initiate payment");
      setPayingCourseId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role="student" user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/student/dashboard')} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">My Certificates</h1>
          </div>
          <button onClick={() => fetchCoursesAndStatus(true)} className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-medium text-sm shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-cyan-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-10 text-center text-slate-500">
            You are not enrolled in any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-4 ${(course.isPaid && course.isPassed) ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Award className="w-12 h-12" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{course.title}</h3>
                
                <div className="flex gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded font-medium flex items-center gap-1 ${course.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {course.isPaid ? <CheckCircle2 className="w-3 h-3"/> : <Lock className="w-3 h-3"/>} {course.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-medium flex items-center gap-1 ${course.isPassed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {course.isPassed ? <CheckCircle2 className="w-3 h-3"/> : <Lock className="w-3 h-3"/>} 
                    {course.finalScore ? `Score: ${course.finalScore}% (${course.finalGrade})` : 'No Grade'}
                  </span>
                </div>

                {course.isPaid && course.isPassed ? (
                  <button 
                    onClick={() => setCertificateData(course)} // Opens the modal
                    className="w-full bg-cyan-500 text-white font-medium py-3 rounded-xl hover:bg-cyan-600 transition flex items-center justify-center gap-2 mt-auto"
                  >
                    <Download className="w-5 h-5" /> Download Certificate
                  </button>
                ) : (
                  <div className="w-full space-y-3 mt-auto">
                    {!course.isPassed && (
                      <p className="text-xs text-yellow-600 font-medium bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                        You must achieve at least 50% final grade to unlock this certificate.
                      </p>
                    )}
                    
                    {!course.isPaid && (
                      <>
                        <p className="text-xs text-red-500 font-medium flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3" /> Payment Required
                        </p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter Phone 254..." 
                            value={phoneInputs[course._id] || ''}
                            onChange={(e) => handlePhoneChange(course._id, e.target.value)}
                            disabled={pollingCourseId === course._id}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 bg-slate-50 disabled:opacity-50" 
                          />
                          <button 
                            onClick={() => handlePayNow(course._id)}
                            disabled={payingCourseId === course._id || pollingCourseId === course._id}
                            className="bg-blue-500 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition whitespace-nowrap flex items-center justify-center min-w-[100px] disabled:opacity-75"
                          >
                            {payingCourseId === course._id ? (
                              <Loader2 className="w-4 h-4 animate-spin"/>
                            ) : pollingCourseId === course._id ? (
                              <><Loader2 className="w-3 h-3 animate-spin mr-1"/> Waiting...</>
                            ) : (
                              'Pay Now'
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CERTIFICATE VIEW / PRINT MODAL */}
      {certificateData && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[99999] p-4 overflow-y-auto print:bg-white print:p-0 print:block">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl relative my-8 print:shadow-none print:max-w-none print:w-full print:rounded-none print:my-0">
            
            {/* Close Button (Hidden on Print) */}
            <button 
              onClick={() => setCertificateData(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Certificate Design */}
            <div className="border-[12px] border-double border-cyan-600 p-10 text-center relative bg-slate-50">
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-yellow-500"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-yellow-500"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-yellow-500"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-yellow-500"></div>

              <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              
              <h1 className="text-4xl font-serif text-slate-800 font-bold mb-2 uppercase tracking-widest">Certificate of Completion</h1>
              <p className="text-slate-500 mb-8 italic text-lg">This is to certify that</p>
              
              <h2 className="text-3xl font-bold text-cyan-600 mb-8 border-b-2 border-slate-300 inline-block pb-2 px-8">
                {user.name}
              </h2>
              
              <p className="text-slate-600 mb-4 text-lg">has successfully completed the course</p>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-6">"{certificateData.title}"</h3>
              
              <p className="text-slate-600 mb-8">
                achieving a final score of <span className="font-bold text-cyan-600">{certificateData.finalScore}% ({certificateData.finalGrade})</span>
              </p>

              <div className="flex justify-between items-end mt-16 pt-8 border-t border-slate-200">
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Date Issued</p>
                </div>
                
                <div className="text-center">
                   <p className="font-serif italic text-xl text-slate-800 border-b border-slate-400 pb-1 px-4">LearnHub LMS</p>
                   <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Authorized Signature</p>
                </div>
              </div>
            </div>

            {/* Action Buttons (Hidden on Print) */}
            <div className="mt-6 flex justify-center gap-4 print:hidden">
              <button 
                onClick={() => window.print()} 
                className="bg-cyan-500 text-white font-medium py-3 px-8 rounded-xl hover:bg-cyan-600 transition flex items-center gap-2 shadow-lg"
              >
                <Printer className="w-5 h-5" /> Print / Save as PDF
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
export default StudentCertificates;