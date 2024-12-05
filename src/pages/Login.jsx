import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthServices";
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
      const response = await AuthService.auth({ username, password });
      localStorage.setItem("token", response.data); 
      navigate("/flights"); 
      window.location.reload();
    } catch (err) {
      setError(err.response?.data || "Login failed");
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
