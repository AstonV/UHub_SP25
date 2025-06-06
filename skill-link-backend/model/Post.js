import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['approved', 'flagged', 'rejected'], default: 'approved' },
    },
    { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
