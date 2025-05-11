import api from "@/services/api.js";


const getAllUsers = async () => {
    try {
        const res = await api.get('/chat/users');
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}

const getChatHistory = async (user2) => {
    try {
        const user1 = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null;
        const res = await api.get(`/chat/private/${user1}/${user2}`);
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}

const getProjectChatHistory = async (projectId) => {
    try {
        const res = await api.get(`/chat/project/${projectId}`);
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}

const createNewMeeting = async (userId, date, title) => {
    try {
        const res = await api.post('/meeting/create', { userId, date, title });
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}

const uploadFile = async (sender, receiver, file) => {
    try {
        const formData = new FormData();
        formData.append('sender', sender);
        formData.append('receiver', receiver);
        formData.append('message', 'Sent a file');
        formData.append('file', file);
        const res = await api.post('/chat/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (res.status === 201) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}


const uploadProjectFile = async (sender, projectId,file) => {
    try {
        const formData = new FormData();
        formData.append('sender', sender);
        formData.append('projectId', projectId);
        formData.append('message', 'Sent a file');
        formData.append('file', file);
        const res = await api.post('/chat/community-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (res.status === 201) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}

export { uploadProjectFile,getAllUsers,uploadFile, getChatHistory,getProjectChatHistory,createNewMeeting };