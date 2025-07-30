

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import {generateAccessToken, generateRefreshToken} from '../utils/generateTokens.js';
import {OAuth2Client} from 'google-auth-library';
import fetch from "node-fetch";
import base64 from "base-64";
import Message from "../model/Message.js";
import Chat from "../model/Chat.js";

const zoomAccountId = process.env.ZOOM_ACCOUNT_ID;
const zoomClientId =process.env.ZOOM_CLIENT_ID;
const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET;


const router = express.Router();

const getAuthHeaders = () => {
    console.log('zoomClientId', zoomClientId);
    console.log('zoomClientSecret', zoomClientSecret);
    return {
        Authorization: `Basic ${base64.encode(
            `${zoomClientId}:${zoomClientSecret}`
        )}`,
        "Content-Type": "application/json",
    };
};

const generateZoomAccessToken = async () => {
    try {
        const response = await fetch(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`,
            {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    grant_type: "authorization_code"
                }),
            }
        );
        const jsonResponse = await response.json();

        console.log("generateZoomAccessToken JsonResponse --> ", jsonResponse);

        return jsonResponse?.access_token;
    } catch (error) {
        console.log("generateZoomAccessToken Error --> ", error);
        throw error;
    }
};

const generateZoomMeeting = async (
    hostEmail,
    title,
    date,
    guestEmail
) => {
    try {
        const zoomAccessToken = await generateZoomAccessToken();
        console.log('zoomAccessToken', zoomAccessToken);

        const response = await fetch(
            `https://api.zoom.us/v2/users/me/meetings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${zoomAccessToken}`,
                },
                body: JSON.stringify({
                    agenda: title || "Meeting Agenda",
                    default_password: false,
                    duration: 60,
                    password: "12345",

                    settings: {
                        allow_multiple_devices: true,
                        calendar_type: 1,
                        email_notification: true,
                        encryption_type: "enhanced_encryption",
                        focus_mode: true,
                        // global_dial_in_countries: ["US"],
                        host_video: true,
                        join_before_host: true,
                        meeting_authentication: true,
                        meeting_invitees: [
                            {
                                email: hostEmail,
                            },
                        ],
                        mute_upon_entry: true,
                        participant_video: true,
                        private_meeting: true,
                        waiting_room: false,
                        watermark: false,
                        continuous_meeting_chat: {
                            enable: true,
                        },
                    },
                    start_time: new Date(date).toLocaleDateString(),
                    timezone: "Asia/Kolkata",
                    topic: "Zoom Meeting for YT Demo",
                    type: 2, // 1 -> Instant Meeting, 2 -> Scheduled Meeting
                }),
            }
        );

        const jsonResponse = await response.json();

        console.log("generateZoomMeeting JsonResponse --> ", jsonResponse);

        return jsonResponse
    } catch (error) {
        console.log("generateZoomMeeting Error --> ", error);
        throw error;
    }
};

router.get('/token', async (req, res) => {
    try {
        res.status(200).json({ message: 'Zoom Meeting created successfully', data: getAuthHeaders() });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


router.post('/create', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const currentUserId = decoded.id;
        const userId = req.body.userId;
        const date = req.body.date;
        const title = req.body.title;
        const user = await User.findById(userId).exec();
        const guestEmail = user.email;
        const currentUser = await User.findById(currentUserId).exec();
        const hostEmail = currentUser.email;

        const meeting =  await generateZoomMeeting(
            hostEmail,
            title,
            date,
            guestEmail
        );
        console.log('meeting', meeting);

        if(meeting){
            const data = {
                meetingId: meeting.id,
                meetingLink: meeting.join_url,
                meetingPassword: meeting.password,
                meetingStartUrl: meeting.start_url,
            }
            const message = new Chat({
                sender: currentUserId,
                receiver:userId,
                message: 'Meeting created Click to Join on ' + new Date(date).toLocaleDateString() + ' at ' + new Date(date).toLocaleTimeString(),
                meetLink : data.meetingLink,
                system: true
            });
            await message.save();
            res.status(200).json({ message: 'Zoom Meeting created successfully', data:data });
        }else{
            res.status(500).json({ message: 'Error creating Zoom Meeting'});
        }

    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

export default router;