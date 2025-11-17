// src/pages/Home.jsx
import React from 'react';
import arrow from '../images/arrow.png'; 
import resume from '../Resume.pdf';

function Home({ toggleChat }) {
  const handleResume = () => {
    const resumeUrl = resume;
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-container">
      <div className="bento-box hero-box">
        <div className="hero-main-text">
          <h1>Hello there, I'm Surya.</h1>
          <h1>You can send offer letters later —nice meeting you!😁</h1>
        </div>

        <p className='subtitle'>{"< AI-FullStack-Engineer />"}</p>
        
        <div className="resume-download-cta" onClick={handleResume}>
          <span>View Resume</span>
        </div>

        <div className="chatbot-cta">
          <span>Ask about me</span>
        </div>
        
        <div className="hero-icon">
          <img className="arrow" src={arrow} alt="arrow icon" />
        </div>
      </div>
    </div>
  );
}

export default Home;