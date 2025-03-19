import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = API_URL + "/pages"
// Create Page
export const createPage = async (data) => {
  return await axios.post(API_URL_PATH, data);
};

// Get All Pages
export const getPages = async () => {
  return await axios.get(API_URL_PATH);
};

// Get Page by ID
export const getPageById = async (id) => {
  return await axios.get(`${API_URL_PATH}/${id}`);
};

// Update Page
export const updatePage = async (id, data) => {
  return await axios.put(`${API_URL_PATH}/${id}`, data);
};

// Delete Page
export const deletePage = async (id) => {
  return await axios.delete(`${API_URL_PATH}/${id}`);
};
