import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = API_URL + "/courses";
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
// Create Course
export const createCourse = async (data) => {
  return await axios.post(API_URL_PATH, data);
};

// Get All Courses
export const getCourses = async () => {
  return await axios.get(API_URL_PATH+"/all");
};

// Get Course by ID
export const getCourseById = async (id) => {
  return await axios.get(`${API_URL_PATH}/${id}`);
};

// Update Course
export const updateCourse = async (id, data) => {
  return await axios.put(`${API_URL_PATH}/${id}`, data);
};

// Delete Course
export const deleteCourse = async (id) => {
  return await axios.delete(`${API_URL_PATH}/${id}`);
};
export const unpublishCourseById = async (id,status) => {
  return await axios.patch(`${API_URL_PATH}/${id}/${status}/unpublish`);
};