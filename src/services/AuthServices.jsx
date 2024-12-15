import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }
});

// Helper function: Decode JWT payload (base64 URL)
export const decodeJwtPayload = (token) => {
  try {
    const payloadBase64Url = token.split(".")[1]; 
    const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payloadJson = atob(payloadBase64); 
    return JSON.parse(payloadJson); 
  } catch (error) {
    throw new Error("Invalid token format.");
  }
};


// Helper function to get the token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token fou nd. Please log in.");
  }
  const payload = decodeJwtPayload(token)
  const userRole = payload.role;
  if (!["ADMIN"].includes(userRole)) { 
    throw new Error("Access denied: You do not have the required role.");
  }
  return token;
};

// Request Interceptor: Thêm token vào header của tất cả các request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi khi nhận phản hồi từ server
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu token không hợp lệ hoặc hết hạn, xóa token
      localStorage.removeItem("token");
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
