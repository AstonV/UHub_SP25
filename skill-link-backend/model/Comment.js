import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        status: { type: String, enum: ['approved', 'flagged', 'rejected'], default: 'approved' },
    },
    { timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);
