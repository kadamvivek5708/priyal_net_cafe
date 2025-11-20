import apiClient from '../../../lib/axios';

export const createPost = async (postData) => {
  // Calls: POST /api/v1/post/create-post
  const response = await apiClient.post('/post/create-post', postData);
  return response.data;
};

export const getAllPosts = async () => {
  // Calls: GET /api/v1/post/get-all-posts
  const response = await apiClient.get('/post/admin/get-all-posts');
  return response.data;
};

export const deletePost = async (postId) => {
  // Calls: DELETE /api/v1/post/delete-post/:postId
  const response = await apiClient.delete(`/post/delete-post/${postId}`);
  return response.data;
};

export const getPostById = async (postId) => {
  // Calls: GET /api/v1/post/get-post/:postId
  const response = await apiClient.get(`/post/get-post/${postId}`);
  return response.data;
};

export const updatePost = async (postId, postData) => {
  // Calls: PATCH /api/v1/post/update-post/:postId
  const response = await apiClient.patch(`/post/update-post/${postId}`, postData);
  return response.data;
};