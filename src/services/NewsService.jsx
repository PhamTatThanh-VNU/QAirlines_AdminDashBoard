import axiosInstance from "./AuthServices";
const BASE_URL = "http://localhost:8080/news";

/**
 * Function to fetch all news
 */
export const fetchAllNews = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/all`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch news.");
  }
};

/**
 * Function to create a new news
 */
export const createNews = async (newsData) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/create`, newsData);
    return response.data;
  } catch (err) {
    throw new Error("Failed to create news.");
  }
};

/**
 * Function to update an existing news by ID
 */
export const updateNews = async (id, updatedNews) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, updatedNews);
    return response.data;
  } catch (err) {
    throw new Error("Failed to update news.");
  }
};

/**
 * Function to delete a news by ID
 */
export const deleteNews = async (id) => {
  try {
    await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
  } catch (err) {
    throw new Error("Failed to delete news.");
  }
};

/**
 * Function to accept news and change status from DRAFT to PUBLISHED
 */
export const acceptNews = async (id) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/accept/${id}`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to accept news.");
  }
};

