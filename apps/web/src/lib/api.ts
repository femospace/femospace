import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for cookies
    headers: {
        // Axios will automatically set Content-Type to application/json for objects
        // and to multipart/form-data with boundary for FormData.
        // Hardcoding it here can interfere with file uploads.
    },
});

// Request interceptor to add access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('femo_access_token') || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // If using a mock token, don't try to refresh or redirect
                if (localStorage.getItem('femo_access_token') === 'mock-access-token') {
                    console.warn('401 error with mock token. Ignoring redirect.');
                    return Promise.reject(error);
                }

                // Attempt to refresh token
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );


                // Store new access token
                localStorage.setItem('femo_access_token', data.access_token);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('femo_access_token');
                localStorage.removeItem('femo_user');

                // Only redirect if not already on public routes
                const path = window.location.pathname;
                if (!path.startsWith('/auth') && path !== '/' && path !== '/terms' && path !== '/privacy') {
                    window.location.href = '/';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
