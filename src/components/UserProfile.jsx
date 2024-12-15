import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Button } from '.';
import { useStateContext } from '../context/ContextProvider';
import UserService from '../services/UserService'; // Import AuthService
import { CircularProgress } from '@mui/material';
const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear()
    window.location.href = '/login'; 
  };
const UserProfile = () => {
  const { currentColor } = useStateContext();
  const [user, setUser] = useState(null); // State để lưu thông tin người dùng
  const [error, setError] = useState(null); // State để lưu lỗi nếu có

  useEffect(() => {
    // Gọi API lấy thông tin người dùng khi component mount
    UserService.getUserInfo()
      .then((response) => {
        setUser(response.data); 
      })
      .catch((err) => {
        setError(err.response ? err.response.data : "An error occurred"); 
      });
  }, []); 

  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <CircularProgress color="success" size="20px"/>;
  }

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">Admin</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">{user.fullName}</p> {/* Hiển thị tên người dùng từ API */}
          <p className="text-gray-500 text-sm dark:text-gray-400">{user.role}</p> {/* Hiển thị role từ API (nếu có) */}
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">{user.username}</p> {/* Hiển thị email từ API */}
        </div>
      </div>
      <div>
      </div>
      <div className="mt-5">
        <Button color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="10px"
          width="full"
          onClick={handleLogout} >
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;  
