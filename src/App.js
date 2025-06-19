import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentTable from './components/StudentTable';
import StudentProfilePage from './components/StudentProfilePage';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://codeforces-profile-rzac.onrender.com/api';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className={darkMode ? 'dark' : 'light'}>
        <Routes>
          <Route path="/" element={<StudentTable darkMode={darkMode} setDarkMode={setDarkMode} apiBaseUrl={API_BASE_URL} />} />
          <Route path="/codeHandle/:codeHandle" element={<StudentProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;