import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://hackathon-server-4c7a.onrender.com/api',
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
    (config) => {
        const user = Cookies.get('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.token) {
                config.headers.Authorization = `Bearer ${parsedUser.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
