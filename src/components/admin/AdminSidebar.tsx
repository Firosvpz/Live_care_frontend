import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "../../css/admin/admin_sidebar.css";
import { NavList } from "./AdminNavbar"; // Ensure NavList is imported correctly

interface SidebarProps {
  isOpen: boolean; // Receive sidebar open state as a prop
}

interface NavItem {
  title: string;
  path: string;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <motion.div
      className={`admin-sidebar bg-dark text-white ${isOpen ? "open" : "closed"}`}
      initial={{ width: isOpen ? 0 : 250 }}
      animate={{ width: isOpen ? 250 : 0 }}
      transition={{ duration: 0 }}
    >
      <ul className="sidebar-nav list-unstyled p-0 m-0">
        {NavList.map((item: NavItem, index: number) => (
          <li key={index} className="nav-item">
            <NavLink to={item.path} className="nav-link text-white">
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default AdminSidebar;
