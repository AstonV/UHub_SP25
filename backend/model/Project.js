import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['personal', 'group'], default: 'personal' },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    start_date: { type: Date , required: true},
    end_date: { type: Date , required: true},
    priority: { type:String, enum: ['low', 'medium', 'high'], default: 'low' },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    image: { type: String }, // URL or path to the image
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
