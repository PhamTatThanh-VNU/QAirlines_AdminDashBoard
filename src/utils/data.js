import React from "react";
import { TbPlaneInflight } from "react-icons/tb";
import { FaLocationDot, FaRegNewspaper } from "react-icons/fa6";
import { MdFlight } from "react-icons/md";
export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Locations",
        icon: <FaLocationDot />,
      },
      {
        name: "Aircraft",
        icon: <MdFlight />,
      },
      {
        name: "Flights",
        icon: <TbPlaneInflight />,
      },
      {
        name: "News",
        icon: <FaRegNewspaper />,
      },
    ],
  },
];
export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];
