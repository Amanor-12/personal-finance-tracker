import apiRequest from './api';

const categoryService = {
  getAll: (token) =>
    apiRequest('/categories', {
      token,
    }),

  create: (token, payload) =>
    apiRequest('/categories', {
      method: 'POST',
      token,
      body: payload,
    }),

  update: (token, categoryId, payload) =>
    apiRequest(`/categories/${categoryId}`, {
      method: 'PUT',
      token,
      body: payload,
    }),

  remove: (token, categoryId) =>
    apiRequest(`/categories/${categoryId}`, {
      method: 'DELETE',
      token,
    }),
};

export default categoryService;
