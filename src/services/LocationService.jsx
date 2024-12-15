import axiosInstance  from "./AuthServices";
const BASE_URL = "http://localhost:8080/locations";

/**
 * Function to fetch all locations (does not require token)
 */
export const fetchLocations = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/all`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch locations.");
  }
};

/**
 * Function to add a new location
 */
export const addLocation = async (newLocation) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/add`, newLocation);
    return response.data;
  } catch (err) {
    throw new Error("Failed to add location.");
  }
};

/**
 * Function to delete a location by ID
 */
export const deleteLocation = async (id) => {
  try {
    await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
  } catch (err) {
    throw new Error("Failed to delete location.");
  }
};

/**
 * Function to update an existing location by ID
 */
export const updateLocation = async (id, updatedLocation) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, updatedLocation);
    return response.data;
  } catch (err) {
    throw new Error("Failed to update location.");
  }
};
