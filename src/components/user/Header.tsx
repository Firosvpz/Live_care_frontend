import React, { useState } from "react";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "../../css/common/Header.css";
import { UserMenuList } from "./NavList";
import { useDispatch } from "react-redux";
import { removeUserCredential } from "../../redux/slices/user_slice";
import { logoutUser } from "../../api/user_api";

const UserHeader: React.FC = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Manage dropdown hover states for submenu items
  const handleDropdownMouseEnter = (index: number) => {
    setDropdownOpen(index);
  };

  const handleDropdownMouseLeave = () => {
    setDropdownOpen(null);
  };

  // Handle user logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await logoutUser(); // Call the logout API function
        dispatch(removeUserCredential());
        toast.success("User logged out successfully");
        navigate("/"); // Redirect to the home page
      } catch (error) {
        toast.error("Error logging out. Please try again.");
        console.error("Logout error:", error);
      }
    }
  };

  // Generate menu items
  const menuList = UserMenuList.map(({ title, url, submenu }, index) => {
    if (submenu) {
      // Items with submenus
      return (
        <li
          key={index}
          className={`nav-item dropdown`}
          onMouseEnter={() => handleDropdownMouseEnter(index)}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <span
            className="nav-link dropdown-toggle"
            id={`navbarDropdown${index}`}
            role="button"
            aria-expanded={dropdownOpen === index ? "true" : "false"}
          >
            {title}
          </span>
          <ul
            className={`dropdown-menu submenu ${dropdownOpen === index ? "show" : ""}`}
            aria-labelledby={`navbarDropdown${index}`}
          >
            {submenu.map((subitem, subindex) => (
              <li key={subindex}>
                {subitem.url === "/logout" ? (
                  <span
                    className="nav-link dropdown-item"
                    onClick={handleLogout}
                  >
                    {subitem.title}
                  </span>
                ) : (
                  <NavLink to={subitem.url} className="nav-link dropdown-item">
                    {subitem.title}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </li>
      );
    } else {
      // Items without submenus, such as "Home"
      return (
        <li key={index} className="nav-item">
          <NavLink to={url} className="nav-link">
            {title}
          </NavLink>
        </li>
      );
    }
  });

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand ms-3" href="/">
          <span className="brand-text text-white">
            LIVE<span className="text-highlight">CARE</span>
          </span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleClick}
          aria-controls="navbarNav"
          aria-expanded={clicked ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={clicked ? faTimes : faBars} />
        </button>
        <motion.div
          className={`navbar-collapse ${clicked ? "show" : ""}`}
          id="navbarNav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="navbar-nav mx-auto">{menuList}</ul>
        </motion.div>
      </div>
    </nav>
  );
};

export default UserHeader;
