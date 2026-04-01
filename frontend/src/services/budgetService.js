import apiRequest from './api';

const budgetService = {
  getAll: (token) =>
    apiRequest('/budgets', {
      token,
    }),

  create: (token, payload) =>
    apiRequest('/budgets', {
      method: 'POST',
      token,
      body: payload,
    }),

  update: (token, budgetId, payload) =>
    apiRequest(`/budgets/${budgetId}`, {
      method: 'PUT',
      token,
      body: payload,
    }),

  remove: (token, budgetId) =>
    apiRequest(`/budgets/${budgetId}`, {
      method: 'DELETE',
      token,
    }),
};

export default budgetService;
