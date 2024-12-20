import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { Sidebar, ThemeSettings, Navbar, Footer } from "./components";
import {
  Location,
  Login,
  Flight,
  Aircraft,
  NewsManagement,
  BookingManagement,
  Dashboard,
} from "./pages";
import "./App.css";

import { useStateContext } from "./context/ContextProvider";

const App = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();
  const isAuthenticated = !!localStorage.getItem("token");
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <>
      <div className={currentMode === "Dark" ? "dark" : ""}>
        <BrowserRouter>
          {isAuthenticated ? (
            <div className="flex relative dark:bg-main-dark-bg">
              <div
                className="fixed right-4 bottom-4"
                style={{ zIndex: "1000" }}
              >
                <TooltipComponent content="Settings" position="Top">
                  <button
                    type="button"
                    onClick={() => setThemeSettings(true)}
                    style={{ background: currentColor, borderRadius: "50%" }}
                    className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                  >
                    <FiSettings />
                  </button>
                </TooltipComponent>
              </div>
              {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                  <Sidebar />
                </div>
              ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                  <Sidebar />
                </div>
              )}
              <div
                className={
                  activeMenu
                    ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                    : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
                }
              >
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                  <Navbar />
                </div>
                <div>
                  {themeSettings && <ThemeSettings />}

                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    {/* dashboard  */}
                    <Route path="/locations" element={<Location />} />
                    <Route path="/aircraft" element={<Aircraft />} />
                    <Route path="/flights" element={<Flight />} />
                    <Route path="/news" element={<NewsManagement />} />
                    <Route path="/bookings" element={<BookingManagement />} />
                  </Routes>
                </div>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </BrowserRouter>
      </div>
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg bg-main-bg md:pl-72 w-full  "
            : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
        }
      >
        {" "}
        <Footer />
      </div>
    </>
  );
};

export default App;
