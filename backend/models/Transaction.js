const mongoose = require('mongoose'); 

const transactionSchema = new mongoose.Schema({
  merchantRequestID: { type: String, required: true },
  checkoutRequestID: { type: String, required: true },
  resultCode: { type: Number, required: true }, // -1 = Pending, 0 = Success, >0 = Failed
  resultDesc: { type: String, required: true },
  amount: { type: Number },
  mpesaReceiptNumber: { type: String },
  phoneNumber: { type: String },
  transactionDate: { type: Date },
  
  // NEW FIELDS
  courseId: { type: String, required: true },
  studentId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);