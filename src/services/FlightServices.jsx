import axiosInstance from "./AuthServices";

const BASE_URL = "http://localhost:8080/flights"

// Lấy tất cả các chuyến bay
export const getAllFlights = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/all`);
    return response.data; // Dữ liệu chuyến bay trả về
  } catch (error) {
    console.error("Error fetching all flights: ", error);
    throw error;  // Ném lỗi để xử lý ở nơi gọi
  }
};

// Tìm kiếm chuyến bay theo tiêu chí
export const searchFlights = async (originCode, destinationCode, departureTime) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/search`, {
      params: {
        originCode: originCode,
        destinationCode: destinationCode,
        departureTime: departureTime
      }
    });
    return response.data; // Dữ liệu chuyến bay tìm được
  } catch (error) {
    console.error("Error searching flights: ", error);
    throw error;  // Ném lỗi để xử lý ở nơi gọi
  }
};

export const addNewFlight = async (flightDTO) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/add`, flightDTO);
    return response.data; 
  } catch (error) {
    console.error("Error adding flight: ", error);
    throw error;
  }
}
export const updateFlight = async(index ,flightDTO) => {
 try {
    const response = await axiosInstance.put(`${BASE_URL}/update/${index}`, flightDTO);
    return response.data; // Dữ liệu chuyến bay cập nhật
  } catch (error) {
    console.error("Error updating flight: ", error);
    throw error; 
  }
}

// Xóa một chuyến bay theo ID
export const deleteFlight = async (id) => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
    return response; // Xử lý response nếu cần
  } catch (error) {
    console.error(`Error deleting flight with ID ${id}: `, error);
    throw error;  // Ném lỗi để xử lý ở nơi gọi
  }
};
