const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
  const { body, headers = {}, method = 'GET', token } = options;
  const requestHeaders = {
    ...headers,
  };

  if (body) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const requestError = new Error(data.message || 'Request failed.');
    requestError.status = response.status;
    requestError.details = data.errors || data.details || null;
    throw requestError;
  }

  return data;
}

export default apiRequest;
