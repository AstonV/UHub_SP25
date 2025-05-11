import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import jwt from "jsonwebtoken";
import Skills from "../model/Skills.js";
import User from "../model/User.js";
import skills from "../model/Skills.js";

const router = express.Router();

// Match users based on skills and interests
router.get('/all', authenticate, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userID = decoded.id;

    try {
        const skills = await Skills.find();
        res.status(200).json(skills);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//add skill to a user
router.post('/assign', authenticate, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { skillIDs } = req.body;
    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userID = decoded.id;

    try {
        const skills = await Skills.find({ _id: { $in: skillIDs } });
        if (!skills) return res.status(404).json({ message: 'Skill not found' });

        console.log(skills);


        const user = await User.findById(userID);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.skills = skills;
        await user.save();

        res.status(200).json({ message: 'Skill added successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

export default router;
