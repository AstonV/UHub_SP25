import express from 'express';
import User from '../model/User.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Match users based on skills and interests
router.post('/', authenticate, async (req, res) => {
    const { skills, interests } = req.body;

    try {
        const matchedUsers = await User.find({
            $or: [
                { skills: { $in: skills } },
                { interests: { $in: interests } }
            ]
        }).exec();

        res.status(200).json(matchedUsers);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

export default router;
