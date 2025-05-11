import express from 'express';
import Notification from '../model/Notification.js';
import { authenticate } from '../middleware/authenticate.js';
import jwt from "jsonwebtoken";

const router = express.Router();

// Get notifications for a user
router.get('/', authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;
        const notifications = await Notification.find({ user: userID }).exec();
        //sort notifications by date
        notifications.sort((a, b) => b.createdAt - a.createdAt);
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Create a new notification
router.post('/', authenticate, async (req, res) => {
    const { message } = req.body;

    try {
        const notification = new Notification({
            user: req.user.id,
            message,
        });

        await notification.save();
        res.status(201).json({ message: 'Notification created' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

export default router;
