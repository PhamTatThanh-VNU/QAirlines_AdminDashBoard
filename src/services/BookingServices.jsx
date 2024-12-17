import axiosInstance from "./AuthServices";

const BASE_URL = "http://localhost:8080/bookings";

/**
 * Function to fetch all bookings
 */
export const fetchAllBookings = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/allBooking`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch bookings.");
  }
};

/**
 * Function to confirm a booking by ID
 */
export const confirmBooking = async (id) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/confirmBooking/${id}`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to confirm booking.");
  }
};
