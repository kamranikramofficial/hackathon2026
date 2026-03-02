import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL for the backend (without /api)
export const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
    (config) => {
        const user = Cookies.get('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                if (parsedUser.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (e) {
                console.error('Error parsing user cookie:', e);
                Cookies.remove('user');
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear cookie and redirect
            Cookies.remove('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
