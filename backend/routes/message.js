import express from 'express';
import Message from '../model/Message.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Send a message
router.post('/', authenticate, async (req, res) => {
    const { receiver, content } = req.body;

    try {
        const message = new Message({
            sender: req.user.id,
            receiver,
            content,
        });
        await message.save();

        res.status(200).json({ message: 'Message sent' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Get all messages for a user
router.get('/:conversationId', authenticate, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.conversationId },
                { sender: req.params.conversationId, receiver: req.user.id }
            ]
        }).exec();

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

export default router;
