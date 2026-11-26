import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Search, CheckCircle2, XCircle, Clock, Loader2, UserCheck, X } from 'lucide-react';

const Attendance = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student' };
  
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Instructor states
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/academic/my-records');
      let allLogs = [];
      response.data.forEach(record => {
        if (record.attendance && record.attendance.length > 0) {
          record.attendance.forEach(att => {
            allLogs.push({
              name: record.studentId?.name || user.name,
              course: record.courseId?.title || 'Unknown Course',
              date: new Date(att.date).toLocaleDateString(),
              status: att.status
            });
          });
        }
      });
      allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLogs(allLogs);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    
    if (user.role === 'instructor') {
      const fetchInstructorCourses = async () => {
        try {
          const res = await api.get(`/courses/instructor/${user._id || user.id}`);
          setCourses(res.data);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      fetchInstructorCourses();
    }
  }, [user.role, user._id, user.id, user.name]);

  // Fetch students when instructor selects a course in the modal
  useEffect(() => {
    if (selectedCourse) {
      const fetchStudents = async () => {
        try {
          const res = await api.get(`/courses/${selectedCourse}`);
          // Handle both cases: raw data or nested inside a course object
          const courseData = res.data.course || res.data;
          const students = courseData.enrolledStudents || [];
          setEnrolledStudents(students);
          
          const initialData = {};
          students.forEach(s => {
            const id = typeof s === 'object' ? s._id : s; 
            initialData[id] = 'Present';
          });
          setAttendanceData(initialData);
        } catch (error) {
          console.error("Error fetching students:", error);
          setEnrolledStudents([]);
        }
      };
      fetchStudents();
    }
  }, [selectedCourse]);

  const handleMarkAttendance = async () => {
    if (enrolledStudents.length === 0) {
      alert("There are no students enrolled in this course yet.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const promises = Object.keys(attendanceData).map(studentId => 
        api.post('/academic/mark-attendance', {
          studentId,
          courseId: selectedCourse,
          status: attendanceData[studentId]
        })
      );
      await Promise.all(promises);
      setIsModalOpen(false);
      setSelectedCourse('');
      fetchAttendance(); 
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || error.message || 'Failed to save attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = logs.length || 1;
  const presentCount = logs.filter(l => l.status === 'Present').length;
  const absentCount = logs.filter(l => l.status === 'Absent').length;
  const lateCount = logs.filter(l => l.status === 'Late').length;

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex relative">
      <Sidebar role={user.role} user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Attendance Overview</h1>
          </div>
          {user.role === 'instructor' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-md hover:bg-cyan-600 transition flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" /> Mark Attendance
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600"><CheckCircle2 className="w-6 h-6"/></div>
            <div><p className="text-slate-500 text-sm">Present</p><h3 className="text-xl font-bold text-slate-800">{Math.round((presentCount/total)*100)}%</h3></div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl text-red-600"><XCircle className="w-6 h-6"/></div>
            <div><p className="text-slate-500 text-sm">Absent</p><h3 className="text-xl font-bold text-slate-800">{Math.round((absentCount/total)*100)}%</h3></div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600"><Clock className="w-6 h-6"/></div>
            <div><p className="text-slate-500 text-sm">Late</p><h3 className="text-xl font-bold text-slate-800">{Math.round((lateCount/total)*100)}%</h3></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Recent Logs</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search student..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-cyan-400" 
              />
            </div>
          </div>
          
          {isLoading ? (
             <div className="flex justify-center items-center h-40 text-cyan-500"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr><th className="px-6 py-4">Student Name</th><th className="px-6 py-4">Course</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-6 text-slate-500">No attendance logs found.</td></tr>
                ) : (
                  filteredLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-slate-800">{log.name}</td>
                      <td className="px-6 py-4 text-slate-600">{log.course}</td>
                      <td className="px-6 py-4 text-slate-500">{log.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${log.status === 'Present' ? 'bg-green-100 text-green-700' : log.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mark Attendance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Mark Today's Attendance</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Course</label>
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 text-sm"
              >
                <option value="">-- Choose a course --</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>

            {selectedCourse && enrolledStudents.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Students</p>
                {enrolledStudents.map((student, idx) => {
                  const sId = typeof student === 'object' ? student._id : student;
                  const sName = typeof student === 'object' ? student.name : `Student ID: ${String(sId).substring(0,6)}...`;
                  
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-medium text-slate-800 text-sm">{sName}</span>
                      <select 
                        value={attendanceData[sId] || 'Present'}
                        onChange={(e) => setAttendanceData({...attendanceData, [sId]: e.target.value})}
                        className={`px-2 py-1 rounded-lg text-xs font-medium border-none focus:ring-0 cursor-pointer ${
                          attendanceData[sId] === 'Present' ? 'bg-green-100 text-green-700' : 
                          attendanceData[sId] === 'Absent' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedCourse && enrolledStudents.length === 0 && (
              <p className="text-sm text-center text-red-500 py-4 bg-red-50 rounded-xl border border-red-100">
                No students are enrolled in this course yet.
              </p>
            )}

            <button 
              onClick={handleMarkAttendance}
              disabled={isSubmitting || !selectedCourse || enrolledStudents.length === 0}
              className="w-full bg-cyan-500 text-white font-medium py-2.5 rounded-xl hover:bg-cyan-600 transition disabled:opacity-50 flex justify-center items-center mt-4"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Attendance;