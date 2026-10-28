const mongoose = require('mongoose'); 

const transactionSchema = new mongoose.Schema({
  merchantRequestID: { type: String, required: true },
  checkoutRequestID: { type: String, required: true },
  resultCode: { type: Number, required: true },
  resultDesc: { type: String, required: true },
  amount: { type: Number },
  mpesaReceiptNumber: { type: String },
  phoneNumber: { type: String },
  transactionDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);