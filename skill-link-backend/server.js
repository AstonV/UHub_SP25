import http from "http";
import app from "./app.js";
import {Server} from "socket.io";
import Chat from "./model/Chat.js";
import ProjectChat from "./model/ProjectChat.js";
import User from "./model/User.js";

const userSocketMap = new Map();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
});
io.on('connection', (socket) => {
    socket.on('register', (userId) => {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ID: ${socket.id}`);
    });

    socket.on('refreshChat', async (data) => {
        console.log(data);

        const { sender, receiver } = data;
        const chats = await Chat.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ timestamp: 1 });
        socket.emit('receiveChat', chats);
    });

    // Listen for messages
    socket.on('sendMessage', async (data) => {
        const { sender, receiver, message } = data;

        // Save the message to the database
        const chat = new Chat({ sender, receiver, message });
        console.log(`Chat Message from ${sender} to ${receiver}: ${message}`);
        await chat.save();



        // Emit the message to multiple users
        io.to(sender).emit('receiveMessage', chat);
        io.to(receiver).emit('receiveMessage', chat);
    });

    // Handle user joining with their user ID
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined`);
    });

    socket.on('privateMessage', ({ senderId, receiverId, message }) => {
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
            const chat = new Chat({ sender: senderId, receiver: receiverId, message });
            chat.save();
            io.to(receiverSocketId).emit('receiveMessage', chat);
            io.to(senderId).emit('receiveMessage', chat);
            console.log(`Message sent from ${senderId} to ${receiverId}: ${message}`);
        } else {
            console.log(`User ${receiverId} is not connected`);
        }
    })

    //project chat
    socket.on('projectMessage', async ({ senderId, projectId, message }) => {
        console.log(`Project message received from ${senderId} to project ${projectId}: ${message}`);
        const chat = new ProjectChat({ sender: senderId, projectId: projectId, message });
        await chat.save();
        //populate sender
        await chat.populate('sender')
        io.emit('receiveProjectMessage', chat);
        console.log(`Project message sent from ${senderId} to project ${projectId}: ${message}`);
    });


    // receiveProjectMessage
    socket.on('refreshProjectChat', async (projectId) => {
        const chats = await ProjectChat.find({ projectId }).sort({ timestamp: 1 });
        socket.emit('receiveProjectChat', chats);
    })

    socket.on('disconnect', () => {
        for (let [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});


export { server, io };