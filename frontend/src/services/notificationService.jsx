import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = API_URL + "/notifications";

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

// Create Notification
export const createNotification = async (data) => {
  return await axios.post(API_URL_PATH, data);
};

// Get All Notifications
export const getNotifications = async (query = "") => {
  return await axios.get(API_URL_PATH + query);
};
export const getAllNotifications = async () => {
  return await axios.get(API_URL_PATH + "/all");
};
// Get Notification by ID
export const getNotificationById = async (id) => {
  return await axios.get(`${API_URL_PATH}/${id}`);
};

// Mark Notification as Read
export const markNotificationAsRead = async (id) => {
  return await axios.put(`${API_URL_PATH}/${id}/read`);
};

// Delete Notification
export const deleteNotification = async (id) => {
  return await axios.delete(`${API_URL_PATH}/${id}`);
};

// Get Unread Notification Count
export const getUnreadNotificationCount = async () => {
  return await axios.get(`${API_URL_PATH}/unread-count`);
};
