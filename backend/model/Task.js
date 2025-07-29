import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['todo', 'in progress', 'completed'], default: 'todo' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    dueDate: { type: Date },
    fromDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , default: null},
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
