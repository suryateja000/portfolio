import React, { useState, useEffect } from 'react';
import './StudentModal.css';

const StudentModal = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: '',
    emailNotifications: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [prevhandle,setprevhandle] = useState('')
  const [prevemail,setprevemail] = useState('')

  useEffect(() => {
    if (student) {
      console.log(student)
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        codeforcesHandle: student.codeHandle || '',
        emailNotifications: student.emailNotifications !== false
      });
      setprevhandle(student.codeHandle || '')
      setprevemail(student.email || '')
    }
  }, [student]);

  const validateForm = () => {
  const newErrors = {};
  
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  }
  
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email';
  }
  
  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
    newErrors.phone = 'Please enter a valid phone number';
  }
  
  if (!formData.codeforcesHandle.trim()) {
    newErrors.codeforcesHandle = 'Codeforces handle is required';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.codeforcesHandle)) {
    newErrors.codeforcesHandle = 'Handle can only contain letters, numbers, hyphens, and underscores';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      prevHandle:prevhandle,
      prevEmail:prevemail
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
          <button className="close-btn" onClick={onClose} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-body">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter student's full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+91 9876543210"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="codeforcesHandle">Codeforces Handle *</label>
              <input
                type="text"
                id="codeforcesHandle"
                name="codeforcesHandle"
                value={formData.codeforcesHandle}
                onChange={handleChange}
                className={`form-input ${errors.codeforcesHandle ? 'error' : ''}`}
                placeholder="Enter Codeforces username"
              />
              {errors.codeforcesHandle && <span className="error-message">{errors.codeforcesHandle}</span>}
              <small className="form-hint">
                This will be used to fetch contest and problem data from Codeforces
              </small>
            </div>
            
            <div className="form-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <label htmlFor="emailNotifications" className="checkbox-label">
                  Enable email notifications for inactivity reminders
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner small"></div>
                  {student ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                student ? 'Update Student' : 'Add Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
