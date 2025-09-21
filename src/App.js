import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import './index.css';
import bot from "./images/bot.png";

function App() {
  
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isThrottled = useRef(false);

  const touchStartY = useRef(null);
  const touchStartX = useRef(null);

  const toggleChat = () => {
    console.log('Toggle chat called, current state:', isChatOpen);
    setIsChatOpen(prev => !prev);
  };

  const pages = [
    { component: <Home toggleChat={toggleChat} />, path: '/', name: 'Home' },
    { component: <Skills />, path: '/skills', name: 'Skills' },
    { component: <Projects />, path: '/projects', name: 'Projects' },
    { component: <Contact />, path: '/contact', name: 'Contact' }
  ];

  useEffect(() => {
    const handleWheel = (event) => {
      if (isChatOpen && event.target.closest('.chat-window')) {
        return;
      }
      
      if (isThrottled.current) return;
      isThrottled.current = true;
      setTimeout(() => { isThrottled.current = false; }, 1200);
      const scrollThreshold = 3;

      if (event.deltaY < -scrollThreshold) { 
        setCurrentPageIndex(prev => Math.max(0, prev - 1));
      } else if (event.deltaY > scrollThreshold) {
        setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1));
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (isThrottled.current) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY.current - touchEndY;
      const deltaX = Math.abs(touchStartX.current - touchEndX);
      const threshold = 50;

      if (deltaX > Math.abs(deltaY) * 0.8) return;

      if (Math.abs(deltaY) > threshold) {
        isThrottled.current = true;
        setTimeout(() => { isThrottled.current = false; }, 1200);
        
        if (deltaY > 0 && currentPageIndex < pages.length - 1) {
          setCurrentPageIndex(currentPageIndex + 1);
        } else if (deltaY < 0 && currentPageIndex > 0) {
          setCurrentPageIndex(currentPageIndex - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel);
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isChatOpen, currentPageIndex, pages.length]); 

  useEffect(() => {
    window.history.pushState(null, '', pages[currentPageIndex].path);
  }, [currentPageIndex]);

  console.log('App render - isChatOpen:', isChatOpen);

  return (
    <div className="fullpage-container">
      <Layout
        pages={pages}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={setCurrentPageIndex}
      />
      <div
        className="pages-container"
        style={{ transform: `translateX(-${currentPageIndex * 100}vw)` }}
      >
        {pages.map((page, index) => (
          <section key={index} className="page-section">
            {page.component}
          </section>
        ))}
      </div>
      <button 
        onClick={() => {
          console.log('Chat toggle button clicked');
          toggleChat();
        }} 
        className="chat-toggle-button"
      >
      <img src={bot} alt="Chatbot Icon" className="bot-icon" />
      </button>
      <Chatbot isChatOpen={isChatOpen} toggleChat={toggleChat} />
    </div>
  );
}

export default App;
