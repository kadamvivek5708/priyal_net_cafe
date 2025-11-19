import apiClient from '../../../lib/axios';

export const getAnalyticsSummary = async (sortBy = 'views') => {
  // Calls: /api/v1/analytics/getAnalyticalSummary
  const response = await apiClient.get('/analytics/getAnalyticalSummary', {
    params: { sortBy }
  });
  return response.data; 
};