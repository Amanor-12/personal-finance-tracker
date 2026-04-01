import apiRequest from './api';

const authService = {
  register: (payload) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: payload,
    }),

  login: (payload) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: payload,
    }),

  getCurrentUser: (token) =>
    apiRequest('/auth/me', {
      token,
    }),
};

export default authService;
