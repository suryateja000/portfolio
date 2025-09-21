import React, { useState, useEffect } from 'react';
import { FiGithub, FiEye } from 'react-icons/fi';
import { FaReact, FaNodeJs, FaPython, FaMicrosoft  } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiSupabase, SiPostgresql, SiTensorflow, SiKeras, SiJupyter, SiStreamlit, SiSocketdotio, SiLangchain, SiFastapi, SiGoogle  } from 'react-icons/si';

import stu_visual from '../images/stu.png';
import eco_visual from '../images/eco.png';
import sen_visual from '../images/sen.png';
import dig_visual from '../images/dig.png';
import cn_visual from '../images/cn.png';
import serv_visual from '../images/serv.png';
import qb_visual from '../images/qb.png';
import s2p_visual from '../images/S2p.png';

const portfolioData = {
  projects: [
    {
    title: 'Stream2Pod',
    description: 'An interactive platform that transforms YouTube videos into engaging podcast experiences with real-time AI-powered Q&A capabilities.',
    visual: s2p_visual,
    liveUrl: '#',
    githubUrl: 'https://github.com/suryateja000/Stream2pod', 
    tags: ['Web', 'AI/ML'],
    tech_stack: [
        { name: 'React', icon: <FaReact /> },
        { name: 'FastAPI', icon: <SiFastapi /> },
        { name: 'Google Gemini AI', icon: <SiGoogle /> },
        { name: 'Microsoft Edge TTS', icon: <FaMicrosoft  /> }
    ],
  },
  {
    title: 'Student Progress System',
    description: 'A MERN stack app to track student Codeforces activity, update progress daily at 2 AM, and email alerts to students inactive for 7+ days.',
      visual: stu_visual,
      liveUrl: 'https://profilesofcodeforces.netlify.app/',
      githubUrl: 'https://github.com/suryateja000/Codeforces',
      tags: ['Web', 'MERN Stack'],
      tech_stack: [ { name: 'React', icon: <FaReact /> }, { name: 'MongoDB', icon: <SiMongodb /> }, { name: 'Node.js', icon: <FaNodeJs /> }, { name: 'Express', icon: <SiExpress /> } ],
    },
    {
      title: 'AI Answer Key Generator',
      description: 'An intelligent Streamlit app using Gemini AI to generate answer keys from PDF question banks with RAG for accuracy.',
      visual: qb_visual,
      liveUrl: 'https://question-bank-to-answer-key.streamlit.app/',
      githubUrl: 'https://github.com/suryateja000/Qb_to_Ak',
      tags: ['AI/ML'],
      tech_stack: [ { name: 'Python', icon: <FaPython /> }, { name: 'Streamlit', icon: <SiStreamlit /> }, { name: 'LangChain', icon: <SiLangchain /> } ],
    },
    {
      title: 'EcoTrack - Recycling App',
      description: 'A React Native app linking users and collectors to recycling centers with real-time tracking and QR scans for a transparent recycling process.',
      visual: eco_visual,
      liveUrl: '#',
      githubUrl: 'https://github.com/suryateja000/Eco-track-frontend-',
      tags: ['Mobile'],
      tech_stack: [ { name: 'React Native', icon: <FaReact /> }, { name: 'Node.js', icon: <FaNodeJs /> }, { name: 'Socket.IO', icon: <SiSocketdotio /> }, { name: 'MongoDB', icon: <SiMongodb /> } ],
    },
    {
        title: 'Sentiment Analyzer',
        description: 'A real-time sentiment analysis tool that evaluates text to generate detailed polarity and subjectivity scores, along with intuitive visual feedback for instant emotional insights.',
        visual: sen_visual,
        liveUrl: 'https://monumental-axolotl-41dbde.netlify.app/',
        githubUrl: 'https://github.com/suryateja000/Sentiment-analysis',
        tags: ['Web', 'AI/ML'],
        tech_stack: [ { name: 'React', icon: <FaReact /> }, { name: 'Python', icon: <FaPython /> }, { name: 'FastAPI', icon: <SiFastapi /> } ],
    },
    {
        title: 'Course Navigator',
        description: 'A web platform guiding post-12th students to academic courses with personalized suggestions tailored to their skills and interests.',
        visual: cn_visual,
        liveUrl: 'https://suryateja000.github.io/Course-Navigator/',
        githubUrl: 'https://github.com/suryateja000/Course-Navigator',
        tags: ['Web'],
        tech_stack: [ { name: 'React', icon: <FaReact /> }, { name: 'Node.js', icon: <FaNodeJs /> }, { name: 'Express', icon: <SiExpress /> }, { name: 'MongoDB', icon: <SiMongodb /> } ],
    },
    {
        title: 'Service Marketplace',
        description: 'A platform where services can be posted or searched by location, enabling easy contact—especially during urgent or critical situations.',
        visual: serv_visual,
        liveUrl: 'https://service-market.netlify.app',
        githubUrl: '#',
        tags: ['Web'],
        tech_stack: [ { name: 'React', icon: <FaReact /> }, { name: 'Supabase', icon: <SiSupabase /> }, { name: 'PostgreSQL', icon: <SiPostgresql /> } ],
    },
    {
        title: 'Handwritten Digit Recognition',
        description: 'Recognizes handwritten digits instantly—even with messy input—through efficient, real-time digit analysis.',
        visual: dig_visual,
        liveUrl: '#',
        githubUrl: 'https://github.com/suryateja000/Digit-analyse',
        tags: ['AI/ML', 'Desktop'],
        tech_stack: [ { name: 'TensorFlow', icon: <SiTensorflow /> }, { name: 'Keras', icon: <SiKeras /> }, { name: 'Python', icon: <FaPython /> }, { name: 'Jupyter', icon: <SiJupyter /> } ],
    },

  ],
};

const filterCategories = [
  { id: 'All', label: 'All Projects'}, { id: 'Web', label: 'Web Apps'}, { id: 'AI/ML', label: 'AI & ML'}, { id: 'Mobile', label: 'Mobile'},
];

const MobileProjectCard = ({ project }) => (
  <div className="mobile-project-card">
    <div className="mobile-card-image">
      <img src={project.visual} alt={project.title} />
    </div>
    <div className="mobile-card-content">
      <h3 className="mobile-card-title">{project.title}</h3>
      <p className="mobile-card-description">{project.description}</p>
      <div className="mobile-card-footer">
        <div className="mobile-card-tech">
          {project.tech_stack.map((tech, i) => (
            <div key={i} className="tech-icon-container" data-tooltip={tech.name}>{tech.icon}</div>
          ))}
        </div>
        <div className="mobile-card-actions">
          {project.liveUrl && project.liveUrl !== '#' && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="action-btn primary"><FiEye/></a>}
          {project.githubUrl && project.githubUrl !== '#' && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="action-btn secondary"><FiGithub/></a>}
        </div>
      </div>
    </div>
  </div>
);

function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const filteredProjects = portfolioData.projects.filter(project => 
    activeFilter === 'All' || project.tags.includes(activeFilter)
  );

  useEffect(() => {
    setActiveProjectIndex(0);
  }, [activeFilter]);
  
  const activeProject = filteredProjects[activeProjectIndex] || filteredProjects[0];

  return (
    <div className="page-container">
      <div className="projects-header">
        <div className="filter-section">
          <div className="filter-tabs">
            {filterCategories.map(category => (
              <button key={category.id} className={`filter-tab ${activeFilter === category.id ? 'active' : ''}`} onClick={() => setActiveFilter(category.id)}>
                <span className="filter-label"><p>{category.label}</p></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="projects-layout-wrapper">
          <div className="projects-interactive-layout">
            <div className="projects-list-column">
              <div className="projects-list-container">
                {filteredProjects.map((project, index) => (
                  <div key={index} className={`project-list-item ${index === activeProjectIndex ? 'active' : ''}`} onMouseEnter={() => setActiveProjectIndex(index)}>
                    <h3 className="project-list-title">{project.title}</h3>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="projects-viewport-column">
              {activeProject && (
                <div className="viewport-content" key={activeProject.title}>
                  <div className="viewport-image-wrapper">
                    <img src={activeProject.visual} alt={activeProject.title} className="viewport-image"/>
                  </div>
                  <div className="viewport-details">
                    <p className="viewport-description">{activeProject.description}</p>
                    <div className="viewport-footer">
                      <div className="viewport-tech">
                        {activeProject.tech_stack.map((tech, i) => (
                          <div key={i} className="tech-icon-container" data-tooltip={tech.name}>{tech.icon}</div>
                        ))}
                      </div>
                      <div className="viewport-actions">
                        {activeProject.liveUrl && activeProject.liveUrl !== '#' && <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="action-btn primary"><FiEye/><span>Live</span></a>}
                        {activeProject.githubUrl && activeProject.githubUrl !== '#' && <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="action-btn secondary"><FiGithub/><span>Code</span></a>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="projects-mobile-layout">
            {filteredProjects.map((project, index) => (
              <MobileProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      ) : (
        <div className="no-results-footer"><p>No projects found for this category.</p></div>
      )}
    </div>
  );
}

export default Projects;
