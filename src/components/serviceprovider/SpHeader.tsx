import React, { useState } from "react";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import "../../css/common/Header.css";
import { useDispatch } from "react-redux";
import { SpMenuList } from "./SpNavList";
import { removeServiceProviderCredential } from "../../redux/slices/sp_slice";

interface MenuItem {
  url: string;
  title: string;
  submenu?: { title: string; url: string }[];
}

const SpHeader: React.FC = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDropdownMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear user credentials from Redux store
        dispatch(removeServiceProviderCredential());
        toast.success("service provider logout successfully");
        navigate("/");
        console.log("Logged out!");
      }
    });
  };

  const menuList = SpMenuList.map(
    ({ url, title, submenu }: MenuItem, index: number) => {
      if (submenu) {
        return (
          <li
            key={index}
            className={`nav-item dropdown ${index === SpMenuList.length - 1 ? "ms-auto" : ""}`}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <span
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              aria-expanded={dropdownOpen ? "true" : "false"}
            >
              {title}
            </span>
            <ul
              className={`dropdown-menu submenu  ${dropdownOpen ? "show" : ""}`}
              aria-labelledby="navbarDropdown"
            >
              {submenu.map((subitem, subindex) => (
                <li key={subindex}>
                  {subitem.url === "/logout" ? (
                    <span
                      className="nav-link dropdown-item "
                      onClick={handleLogout}
                    >
                      {subitem.title}
                    </span>
                  ) : (
                    <NavLink
                      to={subitem.url}
                      className="nav-link dropdown-item "
                    >
                      {subitem.title}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </li>
        );
      }
      return (
        <li key={index} className="nav-item">
          <NavLink to={url} className="nav-link">
            {title}
          </NavLink>
        </li>
      );
    },
  );

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
          className={` navbar-collapse ${clicked ? "show" : ""}`}
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

export default SpHeader;
