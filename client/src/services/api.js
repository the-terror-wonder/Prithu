import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor to add the token to every request if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  // console.log("Token in api file: " + token);
  if (token) {
    // This now sends the token in the standard "Bearer" format
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;