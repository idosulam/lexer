import React from "react";
import "./Sidebar.css";

const sidebarItems = [
  { label: "Files", icon: "file_icon" },
  { label: "Graph", icon: "graph" },
];

const Sidebar = ({ onItemClick, selectedItem }) => {
  return (
    <div className="sidebar">
      {sidebarItems.map((item) => (
        <div
          className={`sidebar-item ${
            item.label === selectedItem ? "active" : ""
          }`}
          key={item.label}
          onClick={() => onItemClick(item.label)}
        >
          <div className={`icon ${item.icon}`}></div>
          <div className="label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
