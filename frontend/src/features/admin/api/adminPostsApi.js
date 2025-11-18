// src/features/admin/api/adminPostsApi.js
import apiClient from '../../../lib/axios';

export const createPost = async (postData) => {
  // Calls: POST /api/v1/post/create-post
  const response = await apiClient.post('/post/create-post', postData);
  return response.data;
};

export const getAllPosts = async () => {
  // Calls: GET /api/v1/post/get-all-posts
  const response = await apiClient.get('/post/get-all-posts');
  return response.data;
};