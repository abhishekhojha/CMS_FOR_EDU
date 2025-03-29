import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = API_URL + "/cloudinary";
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
// Create Files
export const createFiles = async (data) => {
  return await axios.post(API_URL_PATH+"/upload", data);
};

// Get All Filess
export const getFiles = async () => {
  return await axios.get(API_URL_PATH);
};

// Get Files by ID
export const getFilesById = async (id) => {
  return await axios.get(`${API_URL_PATH}/${id}`);
};

// Update Files
export const updateFiles = async (id, data) => {
  return await axios.put(`${API_URL_PATH}/${id}`, data);
};

// Delete Files
export const deleteFiles = async (id) => {
  return await axios.delete(`${API_URL_PATH}/delete/${id}`);
};