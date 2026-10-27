import axios from 'axios';
import { getToken } from './auth';

const BASE_URL = 'https://smartwork-upt0.onrender.com';
const API_URL = `${BASE_URL}/api/tasks`;

// Get auth header 
const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

// Fetches all tasks from database
export const getTasks = async () => {
    const response = await axios.get(API_URL, authHeader());
    return response.data;
};

// Adds new task to database
export const addTask = async (task) => {
    const response = await axios.post(API_URL, task, authHeader());
    return response.data;
};

// Updates existing task in database
export const updateTask = async (id, task) => {
    const response = await axios.put(`${API_URL}/${id}`, task, authHeader());
    return response.data;
};

// Deletes task from database 
export const deleteTask = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
};