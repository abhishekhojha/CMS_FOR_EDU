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
export const getContactForms = async (query) => {
  return await axios.post(API_URL_PATH+query);
};
