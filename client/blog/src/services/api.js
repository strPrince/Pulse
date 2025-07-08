import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  getCurrentUser: () => apiClient.get('/current_user'),
  logout: () => apiClient.get('/logout'),
  googleLogin: () => window.location.href = 'http://localhost:3000/auth/google',
};

// Blog API
export const blogAPI = {
  getAll: () => apiClient.get('/blogs'),
  getById: (id) => apiClient.get(`/blogs/${id}`),
  create: (data) => apiClient.post('/blog-posts', data),
  update: (id, data) => apiClient.put(`/blogs/${id}`, data),
  delete: (id) => apiClient.delete(`/blogs/${id}`),
  getByAuthor: (username) => apiClient.get(`/posts/author/${username}`),
  vote: (id, action) => apiClient.post(`/blogs/${id}/vote`, { action }),
  getVoteStatus: (id) => apiClient.get(`/blogs/${id}/vote-status`),
};

// User API
export const userAPI = {
  getProfile: (username) => apiClient.get(`/users/${username}`),
  updateBio: (bio) => apiClient.post('/update_bio', { bio }),
  updateUsername: (username) => apiClient.put('/update_username', { newUsername: username }),
  follow: (userId) => apiClient.post(`/users/follow/${userId}`),
  unfollow: (userId) => apiClient.post(`/users/unfollow/${userId}`),
  getFollowers: (userId) => apiClient.get(`/users/${userId}/followers`),
  getFollowing: (userId) => apiClient.get(`/users/${userId}/following`),
};

// Comment API
export const commentAPI = {
  getByPost: (postId) => apiClient.get(`/comments/${postId}`),
  create: (postId, content) => apiClient.post(`/comments/${postId}`, { content }),
  delete: (commentId) => apiClient.delete(`/comments/${commentId}`),
};

// Tag API
export const tagAPI = {
  getAll: () => apiClient.get('/tags'),
  getBlogs: (tag) => apiClient.get(`/tags/${tag}`),
};

export default apiClient;
