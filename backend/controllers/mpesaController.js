const axios = require('axios');
const moment = require('moment');
const Transaction = require('../models/Transaction');

// 1. Initiate STK Push
exports.stkPush = async (req, res) => {
  const { phone, amount, courseId, studentId } = req.body;
  const numericAmount = Number(amount);

  if (typeof phone !== 'string' || !/^254[17]\d{8}$/.test(phone)) {
    return res.status(400).json({ error: 'Enter a valid Kenyan M-Pesa phone number in 254XXXXXXXXX format' });
  }

  if (!Number.isInteger(numericAmount) || numericAmount < 1) {
    return res.status(400).json({ error: 'Amount must be a positive whole number' });
  }

  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!shortcode || !passkey || !callbackUrl || !req.mpesaToken) {
    return res.status(500).json({ error: 'M-Pesa payment service is not fully configured' });
  }

  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: numericAmount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: 'LearnHub',
        TransactionDesc: 'Course Payment'
      },
      {
        headers: { Authorization: `Bearer ${req.mpesaToken}` },
      }
    );

    await Transaction.create({
      merchantRequestID: response.data.MerchantRequestID,
      checkoutRequestID: response.data.CheckoutRequestID,
      resultCode: -1, // -1 means pending
      resultDesc: 'Pending',
      amount: numericAmount,
      phoneNumber: phone,
      courseId,
      studentId
    });

    res.status(200).json({
      message: "STK Push initiated successfully.",
      data: response.data
    });
  } catch (error) {
    console.error("STK Push error:", error.response?.data || error.message);
    res.status(500).json({ error: 'STK Push failed' });
  }
};

// 2. Handle Callback Webhook
exports.stkCallback = async (req, res) => {
  res.status(200).send('Callback received');

  console.log("\n=== INCOMING MPESA CALLBACK ===");
  console.log(JSON.stringify(req.body, null, 2));

  const callbackData = req.body.Body.stkCallback;
  const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callbackData;

  try {
    const transaction = await Transaction.findOne({ checkoutRequestID: CheckoutRequestID });
    if (!transaction) {
      console.log(`[CALLBACK ERROR] Transaction not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return;
    }

    if (ResultCode === 0 && CallbackMetadata) {
      const metadata = CallbackMetadata.Item;
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;

      transaction.resultCode = ResultCode;
      transaction.resultDesc = ResultDesc;
      transaction.amount = amount;
      transaction.mpesaReceiptNumber = mpesaReceiptNumber;
      transaction.phoneNumber = phoneNumber;
      transaction.transactionDate = moment(transactionDate, 'YYYYMMDDHHmmss').toDate();
      
      await transaction.save();
      console.log(`[CALLBACK SUCCESS] Payment of ${amount} received. Course: ${transaction.courseId}`);
    } else {
      transaction.resultCode = ResultCode;
      transaction.resultDesc = ResultDesc;
      await transaction.save();
      console.log(`[CALLBACK FAILED] STK Push Failed: ${ResultDesc}`);
    }
  } catch (error) {
    console.error("Error saving transaction:", error);
  }
};