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

/**
 * Function to delete all cancelled bookings
 */
export const deleteCancelledBookings = async () => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/deleteCancelled`);
    return response.data; // Bạn có thể xử lý thông báo trả về từ API ở đây
  } catch (err) {
    throw new Error("Failed to delete cancelled bookings.");
  }
};
/**
 * Function to cancel a booking by ID
 */
export const handleCancelBooking = async (id) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/cancelBooking/${id}`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to cancel booking.");
  }
};
