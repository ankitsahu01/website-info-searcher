import React from "react";
import "../css/Header.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar">
      <NavLink id="title" to="/">
        SuperCoolWebapp
      </NavLink>
    </nav>
  );
};

export default Header;
