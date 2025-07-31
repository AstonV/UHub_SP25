import mongoose from 'mongoose';

const ProjectCollaborationRequestSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    type: {type: String, enum: ['admin', 'user'], default: 'admin'},
    status: {type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending'},
}, { timestamps: true });

export default mongoose.model('ProjectCollaborationRequest', ProjectCollaborationRequestSchema);
