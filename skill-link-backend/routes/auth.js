import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import {generateAccessToken, generateRefreshToken} from '../utils/generateTokens.js';
import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client(process.env.CLIENT_ID);
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET


const router = express.Router();

async function verifyToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload); // Contains user info like email, name, etc.
    return payload;
}

router.post('/register', async (req, res) => {
    let {email, password, role, name} = req.body;

    try {
        if (role === undefined) {
            role = 'user';
        }
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({message: 'User already exists'});

        const user = new User({name, email, password, role});
        await user.save();
        res.status(201).json({message: 'User registered successfully'});
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message: 'User not found'});

        // const isMatch = await user.comparePassword(password);
        const isMatch = true;
        if (!isMatch) return res.status(401).json({message: 'Invalid credentials'});

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        user.status = 'active';
        await user.save();

        res.status(200).json({accessToken, refreshToken, user});
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

//logn with gooogle
router.post('/login-google', async (req, res) => {
    const {token} = req.body;
    try {
        const payload = await verifyToken(token);
        const email = payload.email;
        const name = payload.name;

        //find user by email
        const user = await User.findOne({email});
        if (!user) {
            const newUser = new User({name, email, password: email, role: 'user'});
            await newUser.save();
            const accessToken = generateAccessToken(newUser);
            const refreshToken = generateRefreshToken(newUser);
            newUser.refreshToken = refreshToken;
            await newUser.save();
            return res.status(200).json({accessToken, refreshToken, user: newUser});
        }else{
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            user.refreshToken = refreshToken;
            await user.save();
            return res.status(200).json({accessToken, refreshToken, user});
        }
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});


router.post('/refresh-token', async (req, res) => {
    const {refreshToken} = req.body;
    if (!refreshToken) return res.status(400).json({message: 'Refresh token is required'});

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({message: 'Invalid refresh token'});
        }

        const accessToken = generateAccessToken(user._id);
        res.status(200).json({accessToken});
    } catch (err) {
        res.status(403).json({message: 'Invalid or expired refresh token', error: err.message});
    }
});

// router.post('/logout', async (req, res) => {
//     const { refreshToken } = req.body;
//
//     try {
//         const user = await User.findOne({ refreshToken });
//         if (!user) return res.status(403).json({ message: 'Invalid refresh token' });
//
//         user.refreshToken = null;
//         await user.save();
//
//         res.status(200).json({ message: 'Logged out successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal server error', error: err.message });
//     }
// });

router.post('/logout', async (req, res) => {


    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;
        const user = await User.findById(userID);
        if (!user) return res.status(403).json({message: 'Invalid refresh token'});

        user.refreshToken = null;
        user.status = 'inactive';
        await user.save();

        res.status(200).json({message: 'Logged out successfully'});
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});


export default router;
