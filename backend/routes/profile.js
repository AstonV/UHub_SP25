import express from 'express';
import User from '../model/User.js';
import Notification from '../model/Notification.js';
import { authenticate } from '../middleware/authenticate.js';
import jwt from "jsonwebtoken";
import multer from "multer";
import Task from "../model/Task.js";
import ProjectCollaborationRequest from '../model/Requests.js';
import Project from "../model/Project.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile'); // Directory for storing images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Match users based on skills and interests
router.get('/', authenticate, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userID = decoded.id;

    try {
        const user = await User.findById(userID);
        if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

        await user.populate('skills');

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Update user profile Image
router.post('/upload-image', authenticate, upload.single('image'), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userID = decoded.id;

    const imagePath = req.file.path;

    try {
        const user = await User.findByIdAndUpdate(userID, { profileImage: imagePath }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Image uploaded successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
});

//Change user bio
router.post('/change-bio', authenticate, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userID = decoded.id;

    const { bio } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userID, { bio }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Bio updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating bio', error });
    }
});


router.get('/tasks', authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Access token is missing' });

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;
        console.log("User ID",userID);
        const tasks = await Task.find({ assignedTo: userID });

        //populate project details
        for (let i = 0; i < tasks.length; i++) {
            await tasks[i].populate('project');
        }


        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//get Users Collaborate Request
router.get('/collaboration-request', authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;
        console.log(userID);


        const user = User.findById(userID);
        const requests = await ProjectCollaborationRequest.find({user: userID,status: 'pending'}).populate('project');
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

//accept or reject project collaboration request
router.post('/project/:projectId', authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;

        const {projectId} = req.params;
        const {action} = req.body;

        const request = await ProjectCollaborationRequest.findOne({project: projectId, user: userID});
        if (!request) return res.status(404).json({message: 'Request not found'});

        const adminUsers = await User.find({role: 'admin'});
        const adminUserIds = adminUsers.map(user => user._id);
        const adminId = adminUserIds[0];
        const project = await Project.findById(projectId);
        const user = await User.findById(userID);

        //set Notification on Admin
        const notification = Notification({
            user: adminId,
            message: `User ${user.name} has ${action} the collaboration request for project ${project.name}`
        })

        await notification.save();
        if (action === 'accept') {
            request.status = 'accepted';
            await request.save();
            project.collaborators.push(user);
            await project.save();
            res.status(200).json({message: 'Request accepted successfully'});
        } else if (action === 'reject') {
            request.status = 'rejected';
            await request.deleteOne();
            res.status(200).json({message: 'Request rejected successfully'});
        } else {
            res.status(400).json({message: 'Invalid action'});
        }
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
})

export default router;
