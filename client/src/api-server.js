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

export default api;
// This file is a copy of api-server.js but is ignored by git. It can be used for local development without affecting the main api.js file that is used in production.