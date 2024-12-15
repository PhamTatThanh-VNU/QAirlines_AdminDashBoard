import axiosInstance from "./AuthServices";
import axios from "axios"

const API_URL = "http://localhost:8080"; 

const auth = (authUser) => {
  return axios.post(`${API_URL}/auth`, authUser);
};
const getUserInfo = () => {
  return axiosInstance.get("/userInfo");
};

const UserService = {
  auth,
  getUserInfo
};

export default UserService;