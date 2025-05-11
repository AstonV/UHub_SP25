import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    key: { type: String, default: 'user' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', MessageSchema);
