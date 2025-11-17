import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import bot from "./images/bot.png";

function App() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      />

      <button
        className="chat-toggle-button"
        onClick={toggleChat}
        aria-label="Open portfolio assistant"
      >
        <img src={bot} alt="Chatbot" className="bot-icon" />
      </button>

      <Chatbot isChatOpen={isChatOpen} toggleChat={toggleChat} />
    </>
  );
}

export default App;
