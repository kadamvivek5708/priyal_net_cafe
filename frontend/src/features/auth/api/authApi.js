import apiClient from '../../../lib/axios';

export const adminLogin = async ({ username, password }) => {
  // route --> /api/v1/admin/login-admin
  const response = await apiClient.post('/admin/login-admin', {
    username,
    password,
  });
  return response.data; // This will be the ApiResponse { statusCode, data, message }
};

export const adminLogout = async () => {
  // This matches your backend route: /api/v1/admin/logout
  const response = await apiClient.post('/admin/logout');
  return response.data;
};