import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios'; // <-- Using our centralized API client
import { ArrowLeft, Upload, Video, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const CreateCourse = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'Sarah Njoki', role: 'instructor' };

  // 1. State for standard text inputs
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Data & ML',
    price: ''
  });

  // 2. State for files
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  
  // 3. State for loading and error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // 4. Handle text input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // We MUST use FormData to send files alongside text
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('instructorId', user._id || user.id);

      // Append files if they exist
      // NOTE: These keys ('video', 'document') must match your backend multer setup
      if (videoFile) data.append('video', videoFile);
      if (pdfFile) data.append('document', pdfFile);

      // Send to backend
      const response = await api.post('/courses', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201 || response.status === 200) {
        setMessage('Course created successfully!');
        setTimeout(() => navigate('/instructor/courses'), 1500);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role="instructor" user={user} />

      <div className="flex-1 p-6 overflow-y-auto h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/instructor/dashboard')} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Create New Course</h1>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-xl font-medium ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Course Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Introduction to Data Science" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4" 
                    placeholder="What will students learn in this course?" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50"
                    >
                      <option value="Data & ML">Data & ML</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (KES)</label>
                    <input 
                      type="number" 
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="1500" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 bg-slate-50" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Course Materials</h2>
              <p className="text-xs text-slate-500 mb-4">Upload PDFs and videos. The backend will process these for the AI Assistant.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {/* PDF Upload */}
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-cyan-500 hover:bg-cyan-50/50 transition cursor-pointer flex flex-col items-center justify-center">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    className="hidden" 
                  />
                  <FileText className={`w-8 h-8 mx-auto mb-3 ${pdfFile ? 'text-green-500' : 'text-cyan-500'}`} />
                  <p className="text-sm font-semibold text-slate-700">{pdfFile ? pdfFile.name : 'Upload PDF Notes'}</p>
                  <p className="text-xs text-slate-500 mt-1">{pdfFile ? 'File selected' : 'PDF up to 10MB'}</p>
                </label>

                {/* Video Upload */}
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-cyan-500 hover:bg-cyan-50/50 transition cursor-pointer flex flex-col items-center justify-center">
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="hidden" 
                  />
                  <Video className={`w-8 h-8 mx-auto mb-3 ${videoFile ? 'text-green-500' : 'text-cyan-500'}`} />
                  <p className="text-sm font-semibold text-slate-700">{videoFile ? videoFile.name : 'Upload Video Lesson'}</p>
                  <p className="text-xs text-slate-500 mt-1">{videoFile ? 'File selected' : 'MP4 up to 500MB'}</p>
                </label>
              </div>
            </div>
          </div>

          {/* Right Sidebar (Publish Options) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Publish Settings</h3>
              
              <div className="space-y-3 mb-6">
                <p className={`text-sm flex items-center gap-2 ${formData.title && formData.description ? 'text-slate-700' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${formData.title && formData.description ? 'text-green-500' : 'text-slate-300'}`}/> Details Added
                </p>
                <p className={`text-sm flex items-center gap-2 ${videoFile || pdfFile ? 'text-slate-700' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${videoFile || pdfFile ? 'text-green-500' : 'text-slate-300'}`}/> Materials Uploaded
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-cyan-500 text-white font-medium py-3 rounded-xl hover:bg-cyan-600 transition shadow-md shadow-cyan-200 disabled:bg-cyan-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin"/> Publishing...</> : 'Publish Course'}
                </button>
                <button type="button" className="w-full bg-slate-100 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-200 transition">
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;