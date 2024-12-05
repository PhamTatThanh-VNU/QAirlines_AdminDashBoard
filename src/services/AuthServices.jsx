import axios from "axios";

const API_URL = "http://localhost:8080"; 

const auth = (authUser) => {
  return axios.post(`${API_URL}/auth`, authUser);
};
const getUserInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return Promise.reject("Token is missing");
  }
  return axios.get(`${API_URL}/userInfo`, {
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`, 
    },
  });
};
const AuthService = {
  auth,
  getUserInfo
};

export default AuthService;
