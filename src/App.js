import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import { RiRobot2Line } from 'react-icons/ri';

function App() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const pages = useMemo(
    () => [
      { component: <Home />, name: 'Home' },
      { component: <Skills />, name: 'Skills' },
      { component: <Projects />, name: 'Projects' },
      { component: <Contact />, name: 'Contact' },
    ],
    []
  );

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <>
      <Layout
        pages={pages}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={setCurrentPageIndex}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {!isChatOpen && (
        <button
          className="chat-toggle-button"
          onClick={toggleChat}
          aria-label="Open AI portfolio assistant"
          title="AI Assistant"
        >
          <RiRobot2Line className="bot-icon-svg" />
        </button>
      )}

      <Chatbot
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
      />
    </>
  );
}

export default App;
