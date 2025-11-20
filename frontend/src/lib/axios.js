import axios from 'axios';

// Ensure this matches your backend URL
const API_URL = 'http://localhost:3000/api/v1'; 

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies (refresh tokens)
});

// --- 1. Request Interceptor ---
// Automatically adds the Authorization header to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. Response Interceptor ---
// Handles global errors, like 401 (Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Ideally, we would try to refresh the token here.
      // For now, to keep it simple and ensure you don't get stuck in loops:
      // We will log the user out if the token is invalid.
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminData');
      
      // Force redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;