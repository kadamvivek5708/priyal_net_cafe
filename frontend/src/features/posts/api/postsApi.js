import apiClient from '../../../lib/axios';

// Fetches ONLY active posts
export const getPublicPosts = async () => {
  const response = await apiClient.get('/post/get-all-posts');
  return response.data;
};

// Fetches single post details (and tracks view count)
export const getPublicPostById = async (postId) => {
  const response = await apiClient.get(`/post/get-post/${postId}`);
  return response.data;
};

export const getExpiredPosts = async () => {
  const response = await apiClient.get('/post/get-expired-posts');
  return response.data;
};