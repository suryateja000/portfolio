import React from 'react';
import { FaPython, FaReact, FaNodeJs, FaGitAlt, FaDatabase } from 'react-icons/fa';
import { IoLogoJavascript } from 'react-icons/io5';
import { SiTailwindcss, SiMongodb, SiMysql, SiSupabase, SiTensorflow, SiFastapi, SiLangchain } from 'react-icons/si';
import { TbBrandNextjs, TbBrandReactNative } from 'react-icons/tb';
import { FiCpu } from 'react-icons/fi';

const skillGroups = {
  "Frontend & Mobile": [
    { name: 'JavaScript', icon: <IoLogoJavascript /> },
    { name: 'React.js', icon: <FaReact /> },
    { name: 'Next.js', icon: <TbBrandNextjs /> },
    { name: 'React Native', icon: <TbBrandReactNative /> },
    { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
  ],
  "Backend & Databases": [
    { name: 'Node.js', icon: <FaNodeJs /> },
    { name: 'Python', icon: <FaPython /> },
    { name: 'FastAPI', icon: <SiFastapi /> },
    { name: 'SQL', icon: <FaDatabase /> },
    { name: 'MongoDB', icon: <SiMongodb /> },
    { name: 'MySQL', icon: <SiMysql /> },
  ],
  "AI & Tools": [
    { name: 'TensorFlow', icon: <SiTensorflow /> },
    { name: 'LangChain', icon: <SiLangchain /> },
    { name: 'LLMs', icon: <FiCpu /> },
    { name: 'Git/GitHub', icon: <FaGitAlt /> },
    { name: 'Supabase', icon: <SiSupabase /> },
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
