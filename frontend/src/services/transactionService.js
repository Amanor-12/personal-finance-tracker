import apiRequest from './api';

const transactionService = {
  getAll: (token) =>
    apiRequest('/transactions', {
      token,
    }),

  create: (token, payload) =>
    apiRequest('/transactions', {
      method: 'POST',
      token,
      body: payload,
    }),

  update: (token, transactionId, payload) =>
    apiRequest(`/transactions/${transactionId}`, {
      method: 'PUT',
      token,
      body: payload,
    }),

  remove: (token, transactionId) =>
    apiRequest(`/transactions/${transactionId}`, {
      method: 'DELETE',
      token,
    }),
};

export default transactionService;
