import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = `${API_URL}/latest-update`;

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
  (error) => Promise.reject(error)
);

// ✅ Create Latest Update
export const createUpdate = async (updateData) => {
  try {
    const response = await axios.post(API_URL_PATH, updateData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating update:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Get All Latest Updates
export const getAllUpdates = async (query = "") => {
  try {
    const response = await axios.get(`${API_URL_PATH}${query}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching updates:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Get Single Update by ID
export const getUpdateById = async (id) => {
  try {
    const response = await axios.get(`${API_URL_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching update:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Update Latest Update
export const updateUpdate = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_URL_PATH}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating update:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Delete Latest Update
export const deleteUpdate = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting update:",
      error.response?.data || error.message
    );
    throw error;
  }
};
