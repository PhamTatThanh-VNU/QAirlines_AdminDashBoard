import React, { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import {UserProfile} from '.'
import { useStateContext } from '../context/ContextProvider';
import UserService from '../services/UserService'; 

// Component cho nút điều hướng (Menu)
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

// Component Navbar chính
const Navbar = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null); 
  
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
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  // Cập nhật lại kích thước màn hình khi resize
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Điều chỉnh menu active dựa trên kích thước màn hình
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  // Tắt mở sidebar menu
  const handleActiveMenu = () => setActiveMenu(!activeMenu);


  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      {/* Button Menu */}
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />

      {/* Profile Dropdown */}
      <div className="flex">
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('UserProfile')}
          >
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{' '}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {user? user.fullName : "Admin"}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
        {isClicked.UserProfile &&  (<UserProfile />)}
      </div>
    </div>
  );
};

export default Navbar;
