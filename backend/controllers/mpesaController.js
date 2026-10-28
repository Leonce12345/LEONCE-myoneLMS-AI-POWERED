const axios = require('axios');
const moment = require('moment');
const Transaction = require('../models/Transaction');

// 1. Initiate STK Push
exports.stkPush = async (req, res) => {

// In sandbox, phone must be the test number: 254708374149
const { phone, amount } = req.body;
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

// Timestamp must be YYYYMMDDHHmmss format in Africa/Nairobi time
const timestamp = moment().format('YYYYMMDDHHmmss');
const password =
Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

try {
const response = await axios.post(
'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
{
BusinessShortCode: shortcode,
Password: password,
Timestamp: timestamp,
TransactionType: 'CustomerPayBillOnline',
Amount: numericAmount, // Integer only
PartyA: phone,
PartyB: shortcode,

PhoneNumber: phone,
CallBackURL: callbackUrl,
AccountReference: 'SandboxTest',
TransactionDesc: 'Test Payment'
},
{
headers: {
Authorization: `Bearer ${req.mpesaToken}`,
},
}
);

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
// Always respond 200 OK immediately to acknowledge receipt
res.status(200).send('Callback received');

const callbackData = req.body.Body.stkCallback;
const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc,
CallbackMetadata } = callbackData;

// ResultCode 0 = Success. Anything else is an error (e.g., user cancelled).
if (ResultCode === 0 && CallbackMetadata) {
const metadata = CallbackMetadata.Item;

const amount = metadata.find(item => item.Name === 'Amount')?.Value;
const mpesaReceiptNumber = metadata.find(item => item.Name ===
'MpesaReceiptNumber')?.Value;
const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;
const transactionDate = metadata.find(item => item.Name ===
'TransactionDate')?.Value;

const formattedDate = moment(transactionDate, 'YYYYMMDDHHmmss').toDate();

try {
await Transaction.create({

merchantRequestID: MerchantRequestID,
checkoutRequestID: CheckoutRequestID,
resultCode: ResultCode,
resultDesc: ResultDesc,
amount,
mpesaReceiptNumber,
phoneNumber,
transactionDate: formattedDate
});
console.log(`Sandbox payment of ${amount} received from ${phoneNumber}`);
} catch (error) {
console.error("Error saving transaction:", error);
}
} else {
console.log(`STK Push Failed: ${ResultDesc}`);
try {
await Transaction.create({
merchantRequestID: MerchantRequestID,
checkoutRequestID: CheckoutRequestID,
resultCode: ResultCode,
resultDesc: ResultDesc
});

} catch (error) {
console.error("Error saving failed transaction:", error);
}
}
};