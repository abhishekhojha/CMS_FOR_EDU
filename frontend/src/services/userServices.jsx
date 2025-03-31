import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = API_URL + "/users";

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


// Get All Orders
export const getUsers = async (query) => {
  return await axios.get(API_URL_PATH+query);
};