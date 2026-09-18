import React from 'react';
import resume from '../Resume.pdf';

function Home() {
  const handleResume = () => {
    const resumeUrl = resume;
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenChat = () => {
    const chatBtn = document.querySelector('.chat-toggle-button');
    if (chatBtn) {
      chatBtn.click();
    }
  };

  return (
    <div className="page-container">
      <div className="bento-box hero-box">
        <div className="hero-main-text">
          <h1>Hello there, I'm Surya.</h1>
          <h1>I write code that thinks, nice meeting you!</h1>
        </div>

        <p className="subtitle">{"< AI-FullStack-Engineer />"}</p>
        
        <div className="resume-download-cta" onClick={handleResume}>
          <span>View Resume</span>
        </div>

        <div className="ai-assistant-guide" onClick={handleOpenChat} title="Chat with AI Assistant">
          <div className="guide-badge">
            <span className="guide-text">Ask about me</span>
          </div>
          <div className="guide-arrow-box">
            <svg
              className="guide-arrow-svg"
              width="100"
              height="140"
              viewBox="0 0 100 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="6" r="3.5" className="guide-arrow-dot" />
              <path
                d="M 8 6 L 8 56 L 68 116"
                className="guide-arrow-path"
              />
              <polygon
                points="80,128 63,123 68,116 73,111"
                className="guide-arrow-head"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;