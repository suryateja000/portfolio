import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaFileCsv, FaSearch, FaEye, FaEdit, FaTrash, FaSync } from 'react-icons/fa';
import StudentModal from './StudentModal';
import './StudentTable.css';

const StudentTable = ({ darkMode, setDarkMode, apiBaseUrl }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get(`https://codeforces-profile.onrender.com/getStudents`);
      setStudents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

//{codeHandle,email,newhandle}

  const handleSaveStudent = async (formData) => {
    console.log(formData)
   try {  if(editingStudent){
          const codeHandle = formData.prevHandle 
          const mailupdate= formData.emailNotifications?1:0 
          const email = formData.email
          const prevemail = formData.prevEmail
          console.log("ppp",prevemail)
          if(codeHandle && (codeHandle!=formData.codeforcesHandle)){
          const data = await axios.put('https://codeforces-profile.onrender.com/student/updateHandle',{codeHandle,email,newhandle:formData.codeforcesHandle}) 
          }
          const mail = await axios.post('https://codeforces-profile.onrender.com/student/mailupdate',{value:mailupdate,handle:formData.codeforcesHandle})
          if(prevemail){
          await axios.put('https://codeforces-profile.onrender.com/student/updateStudent',{name:formData.name,email:formData.email,phone:formData.phone,oldemail:prevemail})
          }
          fetchStudents(); 
          setShowModal(false);
      setEditingStudent(null);



    }
    else{
      await axios.post('https://codeforces-profile.onrender.com/student/addStudent',{
        name:formData.name,
        email:formData.email,
        phno:formData.phone,
        codeHandle:formData.codeforcesHandle
      })
      setShowModal(false);
      setEditingStudent(null);
      fetchStudents();
    }
  
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${apiBaseUrl}/students/${studentId}`);
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };
  
  const handleViewDetails = (codeHandle) => {
    navigate(`/codeHandle/${codeHandle}`);
  };

  const handleSync = async (studentId, e) => {
    e.stopPropagation();
    try {
      await axios.post(`${apiBaseUrl}/students/sync/${studentId}`);
      fetchStudents(); 
    } catch (error) {
      console.error("Error syncing student data:", error);
      alert(`Failed to sync student: ${error.response?.data || error.message}`);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone Number', 'Codeforces Handle', 'Current Rating', 'Max Rating'];
    const csvRows = [
      headers.join(','),
      ...filteredStudents.map(student => 
        [
          `"${student.name}"`,
          student.email,
          student.phone || 'N/A',
          student.codeHandle,
          student.currRating || 0,
          student.maxRating || 0
        ].join(',')
      )
    ].join('\n');
  
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'students_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(student =>
    Object.values(student).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-management">
      <header className="page-header">
        <div className="header-left">
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">Manage and track student progress</p>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="btn">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <main>
        <div className="controls-bar">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="action-buttons" style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => { setEditingStudent(null); setShowModal(true); }}>
              <FaPlus /> Add Student
            </button>
            <button className="btn" onClick={exportToCSV}>
              <FaFileCsv /> Export CSV
            </button>
          </div>
        </div>

        <div className="table-container">
          <div className="table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email & Phone</th>
                  <th>Codeforces Handle</th>
                  <th>Current Rating</th>
                  <th>Max Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>
                        <div>{student.email}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                          {student.phone || 'No phone'}
                        </div>
                      </td>
                      <td>{student.codeHandle}</td>
                      <td>{student.currRating > 0 ? student.currRating : 'N/A'}</td>
                      <td>{student.maxRating > 0 ? student.maxRating : 'N/A'}</td>
                      <td className="actions-cell">
                        <button className="btn btn-sm" title="View Details" onClick={() => handleViewDetails(student.codeHandle)}>
                          <FaEye />
                        </button>
                        <button className="btn btn-sm" title="Edit" onClick={() => handleEditStudent(student)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm" title="Delete" onClick={() => handleDeleteStudent(student._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      {showModal && (
        <StudentModal 
          student={editingStudent} 
          onSave={handleSaveStudent} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default StudentTable;
