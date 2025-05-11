import api from "@/services/api.js";
import {toaster} from "@/components/ui/toaster.jsx";


const login = async (email, password) => {
    try {
        const res = await api.post('/auth/login', { email, password });
        if (res.status === 200) {
            await localStorage.setItem('token', res.data.accessToken);
            await localStorage.setItem('refreshToken', res.data.refreshToken);
            await localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}


const loginGoogle = async (token,clientId) => {
    try {
        const res = await api.post('/auth/login-google', { token,clientId });
        if (res.status === 200) {
            await localStorage.setItem('token', res.data.accessToken);
            await localStorage.setItem('refreshToken', res.data.refreshToken);
            await localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data;
        }
    } catch (err) {
        toaster.error({
            title: 'Error',
            description: err.response.data.message,
            status: 'error',
        })
        return false;
    }
}

const register = async (name, email, password) => {
    try {
        const res = await api.post('/auth/register', { name, email, password });
        if (res.status === 201) {
            return true;
        }
    } catch (err) {
        toaster.error({
            title: 'Error',
            description: err.response.data.message,
            status: 'error',
        })
        return false;
    }
}

const logout = async () => {
    try {
        const res = await api.post('/auth/logout');
        if (res.status === 200) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.clear()
            return true;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

export { login, logout,register,loginGoogle };