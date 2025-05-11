import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    system: { type: Boolean, default: false },
    file: { type: String, default: null },
    meetLink: { type: String , default: null},
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Chat', ChatSchema);
