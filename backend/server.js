require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const path = require('path');

const Staff = require('./models/Staff');
const authRoutes = require('./routes/authRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const courseRoutes = require('./routes/courseRoutes');
const aiRoutes = require('./routes/aiRoutes'); 
const academicRoutes = require('./routes/academicRoutes'); 
const messageRoutes = require('./routes/messageRoutes'); // <-- ADDED

const app = express();
app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'a_secure_random_string',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, sameSite: 'none' }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
    },
    async(accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
            let existingStaff = await Staff.findOne({ googleId: profile.id });
            if (existingStaff) return done(null, existingStaff);
            if (email) {
                existingStaff = await Staff.findOne({ email });
                if (existingStaff) {
                    existingStaff.googleId = profile.id;
                    existingStaff.isVerified = true;
                    await existingStaff.save();
                    return done(null, existingStaff);
                }
            }
            const newStaff = await new Staff({
                googleId: profile.id,
                email: email,
                name: profile.displayName,
                role: 'student',
                isVerified: true
            }).save();
            return done(null, newStaff);
        } catch (error) {
            return done(error, null);
        }
    }
));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'emails']
    },
    async(accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
            let existingStaff = await Staff.findOne({ facebookId: profile.id });
            if (existingStaff) return done(null, existingStaff);
            if (email) {
                existingStaff = await Staff.findOne({ email });
                if (existingStaff) {
                    existingStaff.facebookId = profile.id;
                    existingStaff.isVerified = true;
                    await existingStaff.save();
                    return done(null, existingStaff);
                }
            }
            const newStaff = await new Staff({
                facebookId: profile.id,
                email: email,
                name: profile.displayName,
                role: 'student',
                isVerified: true
            }).save();
            return done(null, newStaff);
        } catch (error) {
            return done(error, null);
        }
    }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async(id, done) => {
    try {
        const user = await Staff.findById(id);
        done(null, user);
    } catch (error) { done(error, null); }
});

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) { 
        console.error("[Database] Connection Error:", error); 
        process.exit(1); 
    }
};
connectDB();

const requireDoubleLayerAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) return res.status(401).json({ error: 'Unauthorized: Session missing' });
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized: JWT missing' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id !== req.session.userId) return res.status(403).json({ error: 'Forbidden: Token mismatch' });
        req.user = decoded;
        next();
    } catch (error) { return res.status(401).json({ error: 'Unauthorized: Invalid JWT' }); }
};

app.use('/api/auth', authRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/academic', academicRoutes); 
app.use('/api/messages', messageRoutes); // <-- ADDED

app.get('/api/users', requireDoubleLayerAuth, async(req, res) => {
    try {
        const users = await Staff.find({}, 'name email');
        res.status(200).json(users);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch users' }); }
});

const handleSocialAuthSuccess = (req, res, user) => {
    req.session.userId = user._id.toString();
    req.session.save((err) => {
        if (err) return res.redirect(`${process.env.FRONTEND_URL}/login`);
        const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const userRole = String(user.role || '').toLowerCase().trim();
        let targetDashboard = '/dashboard';
        if (userRole === 'admin') targetDashboard = '/admin/dashboard';
        else if (userRole === 'instructor') targetDashboard = '/instructor/dashboard';
        return res.redirect(`${process.env.FRONTEND_URL}${targetDashboard}?token=${token}`);
    });
};

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }), (req, res) => handleSocialAuthSuccess(req, res, req.user));

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL}/login` }), (req, res) => handleSocialAuthSuccess(req, res, req.user));

app.get('/auth/tiktok', (req, res) => {
    const csrfState = Math.random().toString(36).substring(7);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });
    const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&scope=user.info.basic&response_type=code&redirect_uri=${process.env.BACKEND_URL}/auth/tiktok/callback&state=${csrfState}`;
    res.redirect(url);
});

app.get('/auth/tiktok/callback', async(req, res) => {
    try {
        const tokenResponse = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
            client_key: process.env.TIKTOK_CLIENT_KEY, client_secret: process.env.TIKTOK_CLIENT_SECRET, code: req.query.code, grant_type: 'authorization_code', redirect_uri: `${process.env.BACKEND_URL}/auth/tiktok/callback`
        }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        const userResponse = await axios.get('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name', { headers: { 'Authorization': `Bearer ${tokenResponse.data.access_token}` } });
        const tiktokUser = userResponse.data.data.user;
        let existingStaff = await Staff.findOne({ tiktokId: tiktokUser.open_id });
        if (!existingStaff) {
            existingStaff = await new Staff({ tiktokId: tiktokUser.open_id, name: tiktokUser.display_name, role: 'student', isVerified: true }).save();
        }
        req.login(existingStaff, (err) => {
            if (err) throw err;
            handleSocialAuthSuccess(req, res, existingStaff);
        });
    } catch (error) { res.redirect(`${process.env.FRONTEND_URL}/login`); }
});

app.get('/', (req, res) => res.status(200).json({ message: 'API is running...' }));
app.use((req, res, next) => res.status(404).json({ error: 'Endpoint not found' }));
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Server Error', message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));