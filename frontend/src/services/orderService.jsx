import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = API_URL + "/payment";

// Configure Axios interceptor for token
axios.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create Order
export const createOrder = async (data) => {
  return await axios.post(API_URL_PATH, data);
};

// Get All Orders
export const getOrders = async (query) => {
  return await axios.get(API_URL_PATH + query);
};

// Get Order by ID
export const getOrderById = async (id) => {
  return await axios.get(`${API_URL_PATH}/${id}`);
};

// Update Order
export const updateOrder = async (id, data) => {
  return await axios.put(`${API_URL_PATH}/${id}`, data);
};

// Delete Order
export const deleteOrder = async (id) => {
  return await axios.delete(`${API_URL_PATH}/${id}`);
};
export const getOrdersByCourseId = async (courseId, page) => {
  return await axios.get(`${API_URL_PATH}/filter/${courseId}?page=${page}`);
};
export const exportOrdersByCourseId = async (courseId,limit) => {
  return await axios.get(`${API_URL_PATH}/export/${courseId}?limit=${limit === 'all' ? 0 : limit}`, {
    responseType: "blob",
  });
};
