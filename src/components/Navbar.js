// src/components/Navbar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi'; // Import icons

function Navbar({ isDarkMode, toggleTheme }) {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/skills">Skills</NavLink></li>
        <li><NavLink to="/projects">Projects</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {isDarkMode ? <FiSun /> : <FiMoon />}
      </button>
    </nav>
  );
}

export default Navbar;
