const Course = require('../models/Course');

const createCourse = async (req, res) => {
  try {
    const videoFile = req.files && req.files.video ? req.files.video[0].path : null;
    const documentFile = req.files && req.files.document ? req.files.document[0].path : null;

    const newCourse = new Course({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      instructorId: req.body.instructorId,
      videoUrl: videoFile,
      documentUrl: documentFile
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.params.instructorId }).sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'Published' }).populate('instructorId', 'name').sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const enrollInCourse = async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.enrolledStudents.includes(studentId)) return res.status(400).json({ message: 'Already enrolled' });
    course.enrolledStudents.push(studentId);
    await course.save();
    res.status(200).json({ message: 'Enrolled successfully', course });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('instructorId', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

// NEW FUNCTION: Get course details specifically for the instructor (includes enrolled students)
const getInstructorCourseDetail = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructorId', 'name')
      .populate('enrolledStudents', 'name email'); // Populates student names and emails
      
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { createCourse, getInstructorCourses, getAllCourses, enrollInCourse, getCourseById, getInstructorCourseDetail };