import express from 'express';
import User from '../model/User.js';
import { authenticate } from '../middleware/authenticate.js';
import jwt from "jsonwebtoken";
import Chat from "../model/Chat.js";
import multer from "multer";
import {io} from "../server.js";
import ProjectChat from "../model/ProjectChat.js";
import Project from "../model/Project.js";

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/chat'); // Directory for storing images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

//Get All Users id,name,email,role,skills
router.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.find({},{_id:1,name:1,email:1,role:1,skills:1,status: 1,profileImage:1});
        //populate skills
        await User.populate(users,{path:'skills',select:'name'});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

//Get User by ID
router.get('/users/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

//get chat history between two users
router.get('/private/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;

    try {
        const chats = await Chat.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 },
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history', error });
    }
});

// upload file to chat
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;
        const chat = new Chat({
            sender,
            receiver,
            message,
            file: req.file.path,
            system: false
        });

        io.emit('receiveMessage', chat);

        await chat.save();
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error });
    }
});

router.post('/community-upload', upload.single('file'), async (req, res) => {
    try {
        const { sender, message,projectId } = req.body;
        const project = Project.findById(projectId);
        console.log(project)
        const chat = new ProjectChat({ sender: sender, projectId:projectId, message,file: req.file.path });
        await chat.populate('sender')
        io.emit('receiveProjectMessage', chat);
        await chat.save();
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error });
    }
});

//get chat history of a project
router.get('/project/:projectId', async (req, res) => {
    const { projectId } = req.params;

    console.log("projectId", projectId);

    try {
        const chats = await ProjectChat.find({ projectId: projectId }).sort({ timestamp: 1 });
        await ProjectChat.populate(chats, { path: 'sender'});
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history', error });
    }
});



export default router;
