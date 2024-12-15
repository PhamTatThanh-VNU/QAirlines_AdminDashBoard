import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { decodeJwtPayload } from "../services";
import "./CSS/Login.css"
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { Box, Button, TextField, Typography, Grid, Divider, IconButton, Checkbox, FormControlLabel } from '@mui/material';


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      <Grid container className="login-container">
        {/* Side with Image or Illustration */}
        <Grid
          item
          xs={false}
          md={6}
          className="login-image"
        />

        {/* Login Form Side */}
        <Grid
          item
          xs={12}
          md={6}
          className="login-form-container"
        >
          <Box className="login-box">
            <Typography variant="h5" className="login-title">
              Welcome Back
            </Typography>
            <Typography variant="body1" className="login-subtitle">
              Log in to your admin account to continue
            </Typography>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} className="login-form">
              <TextField
                margin="normal"
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                required
                InputLabelProps={{ shrink: true }}
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                fullWidth
                name="password"
                label="Password"
                required
                InputLabelProps={{ shrink: true }}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <TbEye /> : <TbEyeClosed />}  {/* Biểu tượng tùy chỉnh */}
                    </IconButton>
                  ),
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Box display="flex" justifyContent="flex-start" mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="red"
                      sx={{
                        '&.Mui-checked': {
                          color: '#8DD3BA', // Màu khi được chọn (checked)
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)', // Màu nền khi hover
                        }
                      }}
                    />
                  }
                  label="Remember Me"
                />
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
              >
                Log In
              </Button>
            </Box>

            {/* Divider with or */}
            <Divider sx={{ my: 3 }}></Divider>
          </Box>
        </Grid>
      </Grid>
    </div>



  );
};

export default Login;
