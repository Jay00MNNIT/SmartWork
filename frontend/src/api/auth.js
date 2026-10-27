import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/auth`;

// Register 
export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Login 
export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

// Save token to localStorage
export const saveToken = (token) => {
    localStorage.setItem('smartwork_token', token);
};

// Get token from localStorage 
export const getToken = () => {
    return localStorage.getItem('smartwork_token');
};


// Save user to localStorage 
export const saveUser = (user) => {
    localStorage.setItem('smartwork_user', JSON.stringify(user));
};

// Get user from localStorage 
export const getUser = () => {
    const user = localStorage.getItem('smartwork_user');
    return user ? JSON.parse(user) : null;
};

// Logout 
export const logout = () => {
    localStorage.removeItem('smartwork_token');
    localStorage.removeItem('smartwork_user');
};