import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MenuList } from "./Menulist";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../css/common/Header.css";

// Define the shape of the menu items in MenuList
interface MenuItem {
  url: string;
  title: string;
  submenu?: { title: string; url: string }[];
}

const Header: React.FC = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleDropdownMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    setDropdownOpen(false);
  };

  const menuList = MenuList.map(
    ({ url, title, submenu }: MenuItem, index: number) => {
      if (submenu) {
        return (
          <li
            key={index}
            className={`nav-item dropdown ${index === MenuList.length - 1 ? "ms-auto" : ""}`}
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
              className={`dropdown-menu bg-dark ${dropdownOpen ? "show" : ""}`}
              aria-labelledby="navbarDropdown"
            >
              {submenu.map((subitem, subindex) => (
                <li key={subindex}>
                  <NavLink to={subitem.url} className="nav-link dropdown-item">
                    {subitem.title}
                  </NavLink>
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand ms-3" href="/">
          <motion.span
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            LIVE<span className="text-info">CARE</span>
          </motion.span>
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
          className={` navbar-collapse ${clicked ? "show" : ""}`} //collapse
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

export default Header;
