import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL for the backend (without /api)
export const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 20000, // 20 seconds - enough for slow hosting but not too long
});

// Cache parsed user to avoid repeated JSON parsing
let cachedUser = null;

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
    (config) => {
        const userCookie = Cookies.get('user');
        
        // Use cache if available and matches cookie
        if (!cachedUser || cachedUser.raw !== userCookie) {
            if (userCookie) {
                try {
                    cachedUser = {
                        data: JSON.parse(userCookie),
                        raw: userCookie
                    };
                } catch (e) {
                    console.error('Error parsing user cookie:', e);
                    Cookies.remove('user');
                    cachedUser = null;
                }
            } else {
                cachedUser = null;
            }
        }
        
        if (cachedUser?.data?.token) {
            config.headers.Authorization = `Bearer ${cachedUser.data.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
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
