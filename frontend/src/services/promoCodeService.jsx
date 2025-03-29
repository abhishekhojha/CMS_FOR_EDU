import axios from "axios";
import { API_URL } from "@/config";

const API_URL_PATH = API_URL+"/promocodes";

// ➡️ Create Promo Code
export const createPromoCode = async (data) => {
  const response = await axios.post(API_URL_PATH, data);
  return response.data;
};

// ➡️ Get All Promo Codes
export const getPromoCodes = async () => {
  const response = await axios.get(API_URL_PATH);
  return response.data;
};

// ➡️ Update Promo Code
export const updatePromoCode = async (id, data) => {
  const response = await axios.put(`${API_URL_PATH}/${id}`, data);
  return response.data;
};

// ➡️ Delete Promo Code
export const deletePromoCode = async (id) => {
  const response = await axios.delete(`${API_URL_PATH}/${id}`);
  return response.data;
};
