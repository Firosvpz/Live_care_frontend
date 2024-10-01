import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Close button icon
import { NavList } from "./AdminNavbar"; // Ensure NavList is imported correctly
import "../../css/admin/admin_sidebar.css"; // Import additional custom styles

interface SidebarProps {
  isOpen: boolean; // Receive sidebar open state as a prop
  // setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle sidebar state
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  // Handle sidebar close
  // const handleSidebarClose = () => {
  //   setIsOpen(false); // Set sidebar to closed
  // };

  return (
    <motion.div
      className={`admin-sidebar bg-gray-900 text-white shadow-xl ${isOpen ? "open" : "closed"}`}
      initial={{ width: 0 }}
      animate={{ width: isOpen ? 250 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Close button */}
      <div className="sidebar-header p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <button
          className="text-white focus:outline-none"
          // onClick={handleSidebarClose}
          aria-label="Close sidebar"
        >
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button>
      </div>

      <div className="sidebar-content">
        <ul className="sidebar-nav list-none p-0 m-0">
          {NavList.map((item, index) => (
            <motion.li
              key={index}
              className="nav-item"
              whileHover={{ scale: 1.05, x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <NavLink to={item.path} className="nav-link flex items-center gap-4 p-4  rounded-lg">
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                <span className="nav-text">{item.title}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
