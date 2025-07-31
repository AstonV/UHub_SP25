import api from "@/services/api.js";


const getUsers = async () => {
    try {
        const res = await api.get('/admin/users');
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}

const addUser = async (user) => {
    try {
        const res = await api.post('/auth/register', {
            name: user.name,
            email: user.email,
            password: user.email,
            role: "user"
        });
        if (res.status === 201) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}

const deleteUser = async (userId) => {
    try {
        const res = await api.delete(`/admin/users/${userId}`);
        if (res.status === 200) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}

const addNewSkill = async (newSkill) => {

    try {
        const res = await api.post('/admin/skills', {
            skills:{
                name: newSkill.name,
                description: newSkill.description
            }
        });
        if (res.status === 201) {
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}

export { getUsers, addUser,deleteUser,addNewSkill };