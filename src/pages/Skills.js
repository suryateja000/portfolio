import React from 'react';
import { FaPython, FaReact, FaNodeJs, FaGitAlt, FaDatabase, FaDocker } from 'react-icons/fa';
import { IoLogoJavascript } from 'react-icons/io5';
import { SiTailwindcss, SiMongodb, SiSupabase, SiTensorflow, SiFastapi, SiLangchain, SiHtml5, SiCss3, SiExpress, SiFigma, SiSocketdotio } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { TbBrandNextjs, TbBrandReactNative } from 'react-icons/tb';
import { FiCpu } from 'react-icons/fi';
import { LangGraph } from '@lobehub/icons';

const skillGroups = [
  {
    title: "Frontend & Mobile",
    skills: [
      { name: 'JavaScript', icon: <IoLogoJavascript /> },
      { name: 'React.js', icon: <FaReact /> },
      { name: 'React Native', icon: <TbBrandReactNative /> },
      { name: 'Next.js', icon: <TbBrandNextjs /> },
      { name: 'HTML5', icon: <SiHtml5 /> },
      { name: 'CSS3', icon: <SiCss3 /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
    ]
  },
  {
    title: "Backend & Databases",
    skills: [
      { name: 'Node.js', icon: <FaNodeJs /> },
      { name: 'Python', icon: <FaPython /> },
      { name: 'FastAPI', icon: <SiFastapi /> },
      { name: 'Express', icon: <SiExpress /> },
      { name: 'SQL', icon: <FaDatabase /> },
      { name: 'MongoDB', icon: <SiMongodb /> },
      { name: 'Supabase', icon: <SiSupabase /> },
    ]
  },
  {
    title: "Artificial Intelligence",
    skills: [
      { name: 'LangGraph', icon: <LangGraph /> },
      { name: 'LangChain', icon: <SiLangchain /> },
      { name: 'TensorFlow', icon: <SiTensorflow /> },
      { name: 'LLMs & RAG', icon: <FiCpu /> },
    ]
  },
  {
    title: "Tools & Workflow",
    skills: [
      { name: 'Git / GitHub', icon: <FaGitAlt /> },
      { name: 'Docker', icon: <FaDocker /> },
      { name: 'VS Code', icon: <VscVscode /> },
      { name: 'Figma', icon: <SiFigma /> },
      { name: 'Socket.io', icon: <SiSocketdotio /> },
    ]
  }
];

const SkillCell = ({ skill }) => (
  <div className="skill-cell">
    <span className="skill-icon">{skill.icon}</span>
    <span className="skill-name">{skill.name}</span>
  </div>
);

const SkillPanel = ({ group }) => (
  <div className="skill-panel">
    <h3 className="panel-title">{group.title}</h3>
    <div className="panel-grid">
      {group.skills.map(skill => (
        <SkillCell key={skill.name} skill={skill} />
      ))}
    </div>
  </div>
);

function Skills() {
  return (
    <div className="skills-main-bento">
      <div className="skills-scroll-container">
        {skillGroups.map(group => (
          <SkillPanel key={group.title} group={group} />
        ))}
      </div>
    </div>
  );
}

export default Skills;
