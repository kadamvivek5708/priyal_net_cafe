// src/features/admin/api/adminAnalyticsApi.js
import apiClient from '../../../lib/axios';

export const getAnalyticsSummary = async () => {
  // Calls: /api/v1/analytics/getAnalyticalSummary
  const response = await apiClient.get('/analytics/getAnalyticalSummary');
  return response.data; // Returns { statusCode, data: { totalVisits, topPosts }, ... }
};