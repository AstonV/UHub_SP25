import mongoose from 'mongoose';

const ProjectChatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    message: { type: String, required: true },
    system: { type: Boolean, default: false },
    file: { type: String, default: null },
    meetLink: { type: String , default: null},
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('ProjectChat', ProjectChatSchema);
