const axios = require('axios');
require('dotenv').config();

// ADD THESE 2 LINES OUTSIDE FUNCTION - to keep token in memory
let cachedToken = null;
let tokenExpiry = null;

const generateToken = async (req, res, next) => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    return res.status(500).json({ error: 'M-Pesa credentials are not configured' });
  }

  // CHECK CACHE FIRST - If token still valid, use it
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    req.mpesaToken = cachedToken;
    return next();
  }

  // Create base64 encoded string from key and secret
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    
    // SAVE TOKEN FOR NEXT 50 MINUTES
    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + 50 * 60 * 1000; // 50 mins
    
    // Attach token to the request object
    req.mpesaToken = cachedToken;
    next();
    
  } catch (error) {
    console.error("Token error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate M-Pesa token' });
  }
};

module.exports = { generateToken };