import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { decodeJwtPayload } from "../services";
import "./CSS/Login.css"
import { FaUser, FaLock } from 'react-icons/fa'


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const tokenResponse = await UserService.auth({ username, password });
    const token = tokenResponse.data
    // Giải mã JWT để lấy payload
    const payload = decodeJwtPayload(token);
    const userRole = payload.role;

    // Kiểm tra vai trò của người dùng
    if (userRole !== "ADMIN") {
      throw new Error("Access denied: You do not have the required role.");
    }

    // Lưu token vào localStorage nếu người dùng có vai trò ADMIN
    localStorage.setItem("token", token);

    // Điều hướng tới trang locations
    navigate("/locations");

    // Tải lại trang (nếu cần thiết)
    window.location.reload();
  } catch (err) {
    // Hiển thị lỗi khi đăng nhập không thành công hoặc khi không có quyền truy cập
    setError(err.response?.data || err.message || "Login failed");
  }
};


  return (
    <div className="login-background">
      <div className="login-container">
      <h1>Admin Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-box">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
          <FaUser className='icon'/>
        </div>
        <div className="input-box">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FaLock className='icon'/>
        </div>
        <button type="submit" className="login">Login</button>
      </form>
      </div>
    </div>
  );
};

export default Login;
