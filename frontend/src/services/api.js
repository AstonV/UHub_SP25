import axios from 'axios';
import {API_URL} from "@/config.js";

const api = axios.create({
    baseURL: API_URL, // Update to your backend API URL
    headers: {
        'Content-Type': 'application/json',
    }
});

// Set up interceptors to attach the JWT token on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Get the JWT token from localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Check whether the token is expired or not and use refresh token to get a new access token
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    console.log(error);
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const res = await api.post('/auth/refresh-token', { refreshToken });
            if (res.status === 200) {
                localStorage.setItem('token', res.data.accessToken);
                return api(originalRequest);
            }
        } catch (err) {
            console.error(err);
        }
    }
    return Promise.reject(error);
});

export default api;
