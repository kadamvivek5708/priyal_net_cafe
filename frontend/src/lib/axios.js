import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1'; 

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, //sending cookies
});

// We'll add token interceptors here later
// apiClient.interceptors.request.use(...)

export default apiClient;