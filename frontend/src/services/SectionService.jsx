import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = API_URL + "/sections";
// Create Section
export const createSection = async (data) => {
  return await axios.post(API_URL_PATH, data);
};

// Get All Sections
export const getSections = async (id) => {
  return await axios.get(`${API_URL_PATH}/${id}`);
};

// Get Section by ID
export const getSectionById = async (id) => {
  return await axios.get(`${API_URL_PATH}/${id}`);
};

// Update Section
export const updateSection = async (data) => {
  return await axios.put(`${API_URL_PATH}/merge-update`, data);
};
