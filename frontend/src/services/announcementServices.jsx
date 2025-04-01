import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = API_URL + "/announcement";

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

// Create Announcement
export const createAnnouncement = async (data) => {
  return await axios.post(API_URL_PATH, data);
};

// Get All Announcements
export const getAnnouncements = async (query = "") => {
  return await axios.get(API_URL_PATH + query);
};
export const getAllAnnouncements = async () => {
  return await axios.get(API_URL_PATH + "/all");
};

// Get Announcement by ID
export const getAnnouncementById = async (id) => {
  return await axios.get(`${API_URL_PATH}/${id}`);
};

// Mark Announcement as Read
export const markAnnouncementAsRead = async (id) => {
  return await axios.put(`${API_URL_PATH}/${id}/read`);
};

// Delete Announcement
export const deleteAnnouncement = async (id) => {
  return await axios.delete(`${API_URL_PATH}/${id}`);
};

// Get Unread Announcement Count
export const getUnreadAnnouncementCount = async () => {
  return await axios.get(`${API_URL_PATH}/unread-count`);
};
