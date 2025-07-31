import api from "@/services/api.js";


const getUserData = async () => {
    try {
        const res = await api.get('/profile');
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return {};
    }
}

const getNotifications = async () => {
    try {
        const res = await api.get('/notifications');
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}

const getAllSkills = async () => {
    try {
        const res = await api.get('/skills/all');
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}


const assignSkill = async (skillIds) => {
    try {
        const res = await api.post('/skills/assign', {
            "skillIDs" : skillIds
        });
        if (res.status === 200) {
            return true;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

const changeUserBio = async (bio) => {
    try {
        const res = await api.post('/profile/change-bio', {
            "bio" : bio
        });
        if (res.status === 200) {
            return true;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

const uploadProfileImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append('image', image);
        const res = await api.post('/profile/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return {};
    }
}

export { changeUserBio,getUserData, getAllSkills,assignSkill,uploadProfileImage,getNotifications };