// src/pages/Home.jsx
import React from 'react';
import arrow from '../images/arrow.png'; 
import resume from '../Resume-B.pdf';

function Home({ toggleChat }) {
  const handleResumeDownload = () => {
    const resumeUrl = resume; 
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Surya_Resume.pdf'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      <div className="bento-box hero-box">
        <div className="hero-main-text">
          <h1>Hello there, I'm Surya.</h1>
          <h1>You can send offer letters later —nice meeting you!😁</h1>
        </div>

        <p className='subtitle'>{"< AI-FullStack-Engineer />"}</p>
        
        <div className="resume-download-cta" onClick={handleResumeDownload}>
          <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Resume</span>
        </div>

        <div className="chatbot-cta" onClick={toggleChat}>
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
