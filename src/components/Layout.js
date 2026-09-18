import React, { useRef } from 'react';
import { FiHome, FiLayers, FiBriefcase, FiMail } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const navIcons = {
  'Home': <FiHome />,
  'Skills': <FiLayers />,
  'Projects': <FiBriefcase />,
  'Contact': <FiMail />,
};

function Layout({ pages, currentPageIndex, setCurrentPageIndex, isDarkMode, toggleTheme }) {
  const isThrottled = useRef(false);

  const goToPage = (nextIndex) => {
    if (nextIndex === currentPageIndex) return;
    if (nextIndex < 0 || nextIndex >= pages.length) return;
    setCurrentPageIndex(nextIndex);
  };

  const scheduleThrottle = () => {
    isThrottled.current = true;
    setTimeout(() => {
      isThrottled.current = false;
    }, 800);
  };

  const handleDirection = (direction) => {
    if (isThrottled.current) return;
    if (direction === 'down') {
      goToPage(currentPageIndex + 1);
    } else if (direction === 'up') {
      goToPage(currentPageIndex - 1);
    }
    scheduleThrottle();
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) < 20) return;
    handleDirection(e.deltaY > 0 ? 'down' : 'up');
  };

  const touchStartY = useRef(null);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current == null || touchStartX.current == null) return;
    const endY = e.changedTouches[0].clientY;
    const endX = e.changedTouches[0].clientX;
    const deltaY = endY - touchStartY.current;
    const deltaX = endX - touchStartX.current;

    const isInsideScrollable = e.target.closest(
      '.skills-main-bento, .projects-list-column, .projects-viewport-column, .contact-layout-container'
    );

    // If gesture is inside scrollable container and primarily vertical, let it scroll naturally
    if (isInsideScrollable && Math.abs(deltaY) > Math.abs(deltaX)) {
      touchStartY.current = null;
      touchStartX.current = null;
      return;
    }

    // Horizontal swipe takes precedence for horizontal page slide
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      handleDirection(deltaX < 0 ? 'down' : 'up');
    } else if (!isInsideScrollable && Math.abs(deltaY) > 50) {
      handleDirection(deltaY < 0 ? 'down' : 'up');
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  return (
    <>
      <header className="site-header">
        <nav className="navbar" aria-label="Main Navigation">
          <ul className="nav-links">
            {pages.map((page, index) => (
              <li key={page.name}>
                <a
                  href="/"
                  className={index === currentPageIndex ? 'active' : ''}
                  title={page.name}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(index);
                  }}
                >
                  {navIcons[page.name] || page.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-theme-box">
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
      </header>

      <div className="portfolio-container">
        <div
          className="fullpage-container"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="pages-container"
            style={{
              transform: `translateX(-${currentPageIndex * 100}vw)`,
            }}
          >
            {pages.map((page, index) => (
              <section key={page.name} className="page-section">
                <div className="page-content">
                  <div className="page-container">
                    {page.component}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
