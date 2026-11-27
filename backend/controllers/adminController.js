const Staff = require('../models/Staff');
const Course = require('../models/Course');
const Transaction = require('../models/Transaction');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Counts
    const totalStudents = await Staff.countDocuments({ role: 'student' });
    const totalInstructors = await Staff.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();

    // 2. Revenue Calculation (Only successful payments: resultCode === 0)
    const successfulTransactions = await Transaction.find({ resultCode: 0 });
    const totalRevenue = successfulTransactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // 3. Recent Transactions for Live Feed
    const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(3);

    // 4. Monthly Revenue for Chart (Current Year)
    const monthlyRevenue = await Transaction.aggregate([
      { $match: { resultCode: 0 } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          value: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format monthly data for Recharts (Jan, Feb, etc.)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedRevenueData = monthlyRevenue.map(item => ({
      name: monthNames[item._id - 1],
      value: item.value
    }));

    res.status(200).json({
      totalStudents,
      totalInstructors,
      totalCourses,
      totalRevenue,
      recentTransactions,
      revenueData: formattedRevenueData
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};