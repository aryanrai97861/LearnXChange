export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/login`,
    profile: `${API_BASE_URL}/auth/profile`,
    test: `${API_BASE_URL}/test`
};

export const WS_URL = 'ws://localhost:3001'; 