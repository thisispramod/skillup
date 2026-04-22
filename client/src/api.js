import axios from 'axios';

//const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
//const productionURL = 'http://65.0.103.169:5005/api';

const api = axios.create({
  //baseURL: !isLocalhost ? productionURL : (import.meta.env.VITE_API_URL || 'https://tuts-etests.onrender.com/api'), 
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

//console.log({
  //  'isLocalhost' : isLocalhost,
    // 'VITE_API_URL': import.meta.env.VITE_API_URL,
// });

// Auto-add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Prevent redirect loop if already on login/register
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
