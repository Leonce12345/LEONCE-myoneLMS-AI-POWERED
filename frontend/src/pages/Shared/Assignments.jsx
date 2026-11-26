import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Upload, FileText, Clock, Loader2, X, CheckSquare, Eye } from 'lucide-react';

const Assignments = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student' };
  
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [courses, setCourses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ courseId: '', title: '', dueDate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null); 
  const [gradeData, setGradeData] = useState({ score: '', grade: '' });
  const [isGrading, setIsGrading] = useState(false);

  const [viewAssignment, setViewAssignment] = useState(null); 

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/academic/my-records');
      let allAssignments = [];
      
      response.data.forEach(record => {
        if (record.assignments && record.assignments.length > 0) {
          record.assignments.forEach(ass => {
            allAssignments.push({
              id: ass._id,
              recordId: record._id,
              title: ass.title,
              course: record.courseId?.title || 'Unknown Course',
              studentName: record.studentId?.name || 'Student',
              due: new Date(ass.dueDate).toLocaleDateString(),
              status: ass.status,
              grade: ass.grade,
              score: ass.score
            });
          });
        }
      });
      
      setAssignments(allAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    
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
  }, [user.role, user._id, user.id]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/academic/create-assignment', formData);
      setIsCreateModalOpen(false);
      setFormData({ courseId: '', title: '', dueDate: '' });
      fetchAssignments();
      alert('Assignment created successfully for all enrolled students!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setIsGrading(true);
    try {
      await api.put(`/academic/grade-assignment/${selectedAssignment.recordId}/${selectedAssignment.id}`, {
        score: Number(gradeData.score),
        grade: gradeData.grade
      });
      setSelectedAssignment(null); 
      setGradeData({ score: '', grade: '' });
      fetchAssignments();
      alert('Grade saved successfully!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to save grade');
    } finally {
      setIsGrading(false);
    }
  };

  // THE FIX: Standard onClick handlers
  const handleViewClick = (assignment) => {
    console.log("View Details button clicked for:", assignment.title);
    setViewAssignment(assignment);
  };

  const handleGradeClick = (assignment) => {
    console.log("Review / Grade button clicked for:", assignment.title);
    setGradeData({ score: assignment.score || '', grade: assignment.grade || '' });
    setSelectedAssignment(assignment);
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center flex relative">
      <Sidebar role={user.role} user={user} />
      
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Assignments & Exams</h1>
          </div>
          {user.role === 'instructor' && (
            <button 
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-md hover:bg-cyan-600 transition flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Create Assignment
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-cyan-500"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-slate-500 shadow-sm border border-slate-100">
            No assignments found.
          </div>
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    assignment.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 
                    assignment.status === 'Graded' ? 'bg-green-50 text-green-600' : 
                    'bg-slate-100 text-slate-400'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{assignment.title}</h3>
                    <p className="text-sm text-slate-500">{assignment.course} • Due {assignment.due}</p>
                    {user.role === 'instructor' && (
                      <p className="text-xs font-medium text-cyan-600 mt-1">Student: {assignment.studentName}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {assignment.status === 'Graded' ? (
                     <div className="text-right">
                       <p className="text-xs text-slate-500">Score</p>
                       <p className="font-bold text-green-600 text-lg">{assignment.grade} ({assignment.score}%)</p>
                     </div>
                  ) : (
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${
                      assignment.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {assignment.status === 'Pending' ? <Clock className="w-4 h-4"/> : null}
                      {assignment.status}
                    </span>
                  )}
                  
                  {user.role === 'instructor' && (
                    <button 
                      type="button"
                      onClick={() => handleGradeClick(assignment)}
                      className="border border-slate-200 px-4 py-2 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2"
                    >
                      <CheckSquare className="w-4 h-4"/> Review / Grade
                    </button>
                  )}
                  {user.role === 'student' && (
                    <button 
                      type="button"
                      onClick={() => handleViewClick(assignment)}
                      className="border border-slate-200 px-4 py-2 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4"/> View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {isCreateModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[99999]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Create New Assignment</h2>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Course</label>
                <select required value={formData.courseId} onChange={(e) => setFormData({...formData, courseId: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 text-sm">
                  <option value="">-- Choose a course --</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 text-sm" placeholder="e.g., Mid-Term Exam" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input type="date" required value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 text-sm" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-500 text-white font-medium py-2.5 rounded-xl hover:bg-cyan-600 transition flex justify-center items-center">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Assignment'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* GRADE ASSIGNMENT MODAL */}
      {selectedAssignment && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[99999]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button type="button" onClick={() => setSelectedAssignment(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Grade Assignment</h2>
            <p className="text-sm text-slate-500 mb-4">{selectedAssignment.title} - <span className="font-medium text-cyan-600">{selectedAssignment.studentName}</span></p>
            
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Score (%)</label>
                <input type="number" min="0" max="100" required value={gradeData.score} onChange={(e) => setGradeData({...gradeData, score: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 text-sm" placeholder="e.g., 85" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Letter Grade</label>
                <input type="text" required value={gradeData.grade} onChange={(e) => setGradeData({...gradeData, grade: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50 text-sm" placeholder="e.g., A, B+, C" />
              </div>
              <button type="submit" disabled={isGrading} className="w-full bg-green-500 text-white font-medium py-2.5 rounded-xl hover:bg-green-600 transition flex justify-center items-center">
                {isGrading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Grade'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* STUDENT VIEW DETAILS MODAL */}
      {viewAssignment && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[99999]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button type="button" onClick={() => setViewAssignment(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Assignment Details</h2>
            
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Title</p>
                <p className="font-semibold text-slate-800">{viewAssignment.title}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Course</p>
                <p className="font-medium text-slate-700">{viewAssignment.course}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Due Date</p>
                <p className="font-medium text-slate-700">{viewAssignment.due}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${viewAssignment.status === 'Graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {viewAssignment.status}
                </span>
              </div>
              {viewAssignment.status === 'Graded' && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-500">Your Score</p>
                  <p className="font-bold text-green-600 text-lg">{viewAssignment.grade} ({viewAssignment.score}%)</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
export default Assignments;