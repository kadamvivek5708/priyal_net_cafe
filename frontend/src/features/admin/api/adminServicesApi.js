import apiClient from '../../../lib/axios';

export const createService = async (serviceData) => {
  // Calls: POST /api/v1/services/create-service
  const response = await apiClient.post('/services/create-service', serviceData);
  return response.data;
};

export const getAllServices = async () => {
  // Calls: GET /api/v1/services/admin/get-all-services
  const response = await apiClient.get('/services/admin/get-all-services');
  return response.data;
};

export const deleteService = async (serviceId) => {
  // Calls: DELETE /api/v1/services/delete-service/:serviceId
  const response = await apiClient.delete(`/services/delete-service/${serviceId}`);
  return response.data;
};

export const getServiceById = async (serviceId) => {
  // Calls: GET /api/v1/services/get-service/:serviceId
  const response = await apiClient.get(`/services/get-service/${serviceId}`);
  return response.data;
};

export const updateService = async (serviceId, serviceData) => {
  // Calls: PATCH /api/v1/services/update-service/:serviceId
  const response = await apiClient.patch(`/services/update-service/${serviceId}`, serviceData);
  return response.data;
};