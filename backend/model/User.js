import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
    bio: { type: String, default: null },
    // Array of skills
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    interests: [{ type: String }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, default: 'inactive' },
    profileImage: { type: String, default: null },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
