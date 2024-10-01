import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MenuList } from "./Menulist";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../css/common/Header.css";

const Header: React.FC = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleDropdownMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    setDropdownOpen(false);
  };

  const handleClick = () => {
    setClicked(!clicked);
  };

  const menuList = MenuList.map(({ url, title, submenu }, index) => {
    if (submenu) {
      return (
        <li
          key={index}
          className="nav-item dropdown"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <span
            className="nav-link dropdown-toggle cursor-pointer text-white"
            role="button"
          >
            {title}
          </span>
          <motion.ul
            className={`dropdown-menu submenu ${dropdownOpen ? "block" : "hidden"}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: dropdownOpen ? 1 : 0,
              y: dropdownOpen ? 0 : -10,
            }}
            transition={{ duration: 0.3 }}
          >
            {submenu.map((subitem, subindex) => (
              <li key={subindex}>
                <NavLink
                  to={subitem.url}
                  className="nav-link dropdown-item text-white"
                >
                  {subitem.title}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        </li>
      );
    }
    return (
      <li key={index} className="nav-item">
        <NavLink to={url} className="nav-link text-white">
          {title}
        </NavLink>
      </li>
    );
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-dark  sticky-top">
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
          aria-expanded={clicked}
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={clicked ? faTimes : faBars} />
        </button>
        <div
          className={`navbar-collapse ${clicked ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto text-white">{menuList}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
