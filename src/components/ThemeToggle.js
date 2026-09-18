import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import '../styles/theme-toggle.css';

function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <button
      className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      type="button"
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <FiSun className="theme-toggle-icon sun-icon" />
      ) : (
        <FiMoon className="theme-toggle-icon moon-icon" />
      )}
    </button>
  );
}

export default ThemeToggle;
