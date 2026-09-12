import React from 'react';
import { FaPython, FaReact, FaNodeJs, FaGitAlt, FaDatabase, FaJava, FaAws, FaDocker } from 'react-icons/fa';
import { IoLogoJavascript } from 'react-icons/io5';
import { SiTailwindcss, SiMongodb, SiSupabase, SiTensorflow, SiFastapi, SiLangchain, SiTypescript, SiHtml5, SiCss3, SiC, SiExpress, SiPostgresql, SiVercel, SiFigma, SiSocketdotio } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { TbBrandNextjs, TbBrandReactNative } from 'react-icons/tb';
import { FiCpu } from 'react-icons/fi';
import { LangGraph } from '@lobehub/icons';


const skillGroups = {
  "Frontend & Mobile": [
    { name: 'JavaScript', icon: <IoLogoJavascript /> },
    { name: 'TypeScript', icon: <SiTypescript /> },
    { name: 'React.js', icon: <FaReact /> },
    { name: 'React Native', icon: <TbBrandReactNative /> },
    { name: 'Next.js', icon: <TbBrandNextjs /> },
    { name: 'HTML', icon: <SiHtml5 /> },
    { name: 'CSS', icon: <SiCss3 /> },
    { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
  ],
  "Backend & Databases": [
    { name: 'Node.js', icon: <FaNodeJs /> },
    { name: 'Python', icon: <FaPython /> },
    { name: 'Java', icon: <FaJava /> },
    { name: 'C', icon: <SiC /> },
    { name: 'FastAPI', icon: <SiFastapi /> },
    { name: 'Express', icon: <SiExpress /> },
    { name: 'SQL', icon: <FaDatabase /> },
    { name: 'MongoDB', icon: <SiMongodb /> },
    { name: 'PostgreSQL', icon: <SiPostgresql /> },
    { name: 'Supabase', icon: <SiSupabase /> },
  ],
  "AI & Tools": [
    { name: 'LangGraph', icon: <LangGraph /> },
    { name: 'LangChain', icon: <SiLangchain /> },
    { name: 'TensorFlow', icon: <SiTensorflow /> },
    { name: 'LLMs & RAG', icon: <FiCpu /> },
    { name: 'Git/GitHub', icon: <FaGitAlt /> },
    { name: 'AWS', icon: <FaAws /> },
    { name: 'Docker', icon: <FaDocker /> },
    { name: 'VS Code', icon: <VscVscode /> },
    { name: 'Figma', icon: <SiFigma /> },
    { name: 'Socket.io', icon: <SiSocketdotio /> },
    { name: 'Vercel / Netlify', icon: <SiVercel /> },
  ]
};

const SkillPanel = ({ title, skills }) => (
  <div className="skill-panel">
    <h3 className="panel-title">{title}</h3>
    <div className="panel-grid">
      {skills.map(skill => (
        <div key={skill.name} className="skill-cell">
          <span className="skill-icon">{skill.icon}</span>
          <span className="skill-name">{skill.name}</span>
        </div>
      ))}
    </div>
  </div>
);

function Skills() {
  return (
    <div className="skills-page-container">
      <div className="skills-main-bento">
        <SkillPanel title="Frontend & Mobile" skills={skillGroups["Frontend & Mobile"]} />
        <SkillPanel title="Backend & Databases" skills={skillGroups["Backend & Databases"]} />
        <SkillPanel title="AI & Tools" skills={skillGroups["AI & Tools"]} />
      </div>
    </div>
  );
}

export default Skills;
