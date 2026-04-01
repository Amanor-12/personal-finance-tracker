import apiRequest from './api';

const dashboardService = {
  getSummary: (token) =>
    apiRequest('/dashboard/summary', {
      token,
    }),
};

export default dashboardService;
