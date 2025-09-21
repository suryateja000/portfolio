// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

function Layout({ pages, currentPageIndex, setCurrentPageIndex }) {
  // Changed initial state to 'false' for light mode by default
  const [isDarkMode, setIsDarkMode] = useState(false); 

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="navbar">

      <ul className="nav-links">
        {pages.map((page, index) => (
          <li key={index}>
            <a
              href={`#${page.name.toLowerCase()}`}
              className={currentPageIndex === index ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPageIndex(index);
              }}
            >
              {page.name}
            </a>
          </li>
        ))}
      </ul>
      <button onClick={toggleTheme} className="theme-toggle">
        {isDarkMode ? <FiSun /> : <FiMoon />}
      </button>
    </nav>
  );
}

export default Layout;
