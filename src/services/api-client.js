import axios from 'axios';


const defaultOptions = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
};

const api = axios.create(defaultOptions);

// Set the AUTH token for any request
api.interceptors.request.use(config => {
    if (['login/', 'signup/'].includes(config.url)) {
        return config;
    }

    const user = localStorage.getItem('user') ?
        JSON.parse(localStorage.getItem('user')) :
        {username: null, token: null};
    if (!user.token) {
        return {
            ...config,
            signal: AbortSignal.abort()
        };
    }
    config.headers.Authorization = `Token ${user.token}`;
    return config;
});

export default api;