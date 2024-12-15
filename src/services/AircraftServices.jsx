import axiosInstance from "./AuthServices";

const BASE_URL = "http://localhost:8080/aircrafts";
/**
 * Fetch all aircrafts (does not require token)
 */
export const getAllAirCrafts = async () => {
  try {
     const response = await axiosInstance.get(`${BASE_URL}/all`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch aircrafts.");
  }
};

/**
 * Add a new aircraft
 * @param {Object} airCraft - The new aircraft data
 */
export const addAirCraft = async (airCraft) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/add`, airCraft);
    return response.data;
  } catch (err) {
    throw new Error("Failed to add aircraft.");
  }
};

/**
 * Update an aircraft by ID
 * @param {number} id - The ID of the aircraft to update
 * @param {Object} airCraft - The updated aircraft data
 */
export const updateAirCraft = async (id, airCraft) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, airCraft);
    return response.data;
  } catch (err) {
    throw new Error("Failed to update aircraft.");
  }
};

/**
 * Delete an aircraft by ID
 * @param {number} id - The ID of the aircraft to delete
 */
export const deleteAirCraft = async (id) => {
  try {
    await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
  } catch (err) {
    throw new Error("Failed to delete aircraft.");
  }
};
