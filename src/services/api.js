import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('schoolerp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle status codes gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or backend offline - standard handled error
      return Promise.reject({
        message: 'Cannot reach server. Running in mock demonstration mode.',
        isNetworkError: true,
      });
    }

    const { status, data } = error.response;
    let message = data?.message || 'An unexpected error occurred';

    switch (status) {
      case 400:
        message = data?.message || 'Validation error: please check required fields.';
        break;
      case 401:
        message = 'Session expired or unauthorized. Please log in again.';
        localStorage.removeItem('schoolerp_token');
        localStorage.removeItem('schoolerp_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case 403:
        message = 'Access forbidden: you do not have permission for this operation.';
        break;
      case 404:
        message = data?.message || 'The requested resource was not found.';
        break;
      case 409:
        message = data?.message || 'Conflict: a record with these details already exists.';
        break;
      case 500:
        message = 'Internal server error. Please try again later.';
        break;
      default:
        message = data?.message || `Request failed with status ${status}`;
    }

    return Promise.reject({ status, message, data });
  }
);

export default api;
