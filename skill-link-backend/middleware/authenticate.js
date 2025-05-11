import jwt from 'jsonwebtoken';
import User from '../model/User.js';


export const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;

        // Check if the user is an admin
        if (req.originalUrl.startsWith('/api/admin') && user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token', error: err.message });
    }
};

