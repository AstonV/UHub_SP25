import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['personal', 'group'], default: 'personal' }
}, { timestamps: true });

export default mongoose.model('Skill', SkillSchema);
