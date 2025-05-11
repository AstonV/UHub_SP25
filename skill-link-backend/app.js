import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from './db.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import matchingRoutes from './routes/matching.js';
import messageRoutes from './routes/message.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import profileRoutes from './routes/profile.js';
import skillsRoutes from './routes/skills.js';
import communityRoutes from './routes/community.js';
import emailRoutes from './routes/email.js';
import meeting from "./routes/meeting.js";


//cors import
import cors from 'cors';
import { authenticate } from './middleware/authenticate.js';
import fs from 'fs';
import "./cronJobs.js"; // This starts the cron job

const uploadDir = 'uploads/projects';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

//cors
app.use(cors());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
// Project Management Routes
app.use('/api/projects', projectRoutes);
// Messaging Routes
app.use('/api/messages', messageRoutes);
// Notification Routes
app.use('/api/notifications', notificationRoutes);
// Admin Routes
app.use('/api/admin', adminRoutes);
// Profile Routes
app.use('/api/profile', profileRoutes);

// Matching Routes
app.use('/api/matching', matchingRoutes);
// Skills Routes
app.use('/api/skills', skillsRoutes);
//Chat Routes
app.use('/api/chat', communityRoutes);
//Meeting Routes
app.use('/api/meeting', meeting);

app.get('/api/protected', authenticate, (req, res) => {
    res.status(200).json({ message: `Hello, user ${req.user.id}! You are authorized.` });
});

app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello, API!'});
});


export default app;
