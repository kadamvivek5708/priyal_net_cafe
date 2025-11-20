import apiClient from '../../../lib/axios';

// Fetches ONLY active services
export const getPublicServices = async () => {
  const response = await apiClient.get('/services/get-all-services');
  return response.data;
};

export const getPublicServiceById = async (serviceId) => {
  const response = await apiClient.get(`/services/get-service/${serviceId}`);
  return response.data;
};